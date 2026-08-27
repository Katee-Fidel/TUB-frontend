"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import Link from "next/link";

export default function PostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const [replacementImage, setReplacementImage] = useState(null);

  useEffect(() => {
    api.getPosts().then((data) => setPosts(data.posts)).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  async function submitPost(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!image) return setError("Choose a photo to post.");
    setSubmitting(true); setError("");
    try {
      const data = await api.createPost(caption, image);
      setPosts((current) => [data.post, ...current]);
      setCaption(""); setImage(null);
      form.reset();
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  }

  async function likePost(id) {
    if (!user) return setError("Log in to like posts.");
    try {
      const data = await api.togglePostLike(id);
      setPosts((current) => current.map((post) => post._id === id ? { ...post, likes: data.liked ? [...post.likes, user._id] : post.likes.filter((like) => like !== user._id), likeCount: data.likeCount } : post));
    } catch (err) { setError(err.message); }
  }

  async function submitComment(event, id) {
    event.preventDefault();
    const text = (comments[id] || "").trim();
    if (!text) return;
    try {
      const data = await api.addPostComment(id, text);
      setPosts((current) => current.map((post) => post._id === id ? { ...post, comments: [...post.comments, data.comment] } : post));
      setComments((current) => ({ ...current, [id]: "" }));
    } catch (err) { setError(err.message); }
  }

  async function editPost(post) {
    const caption = window.prompt("Edit caption", post.caption || "");
    if (caption === null) return;
    try { const data = await api.updatePost(post._id, caption, replacementImage); setPosts((current) => current.map((item) => item._id === post._id ? data.post : item)); setEditingPostId(null); setReplacementImage(null); }
    catch (err) { setError(err.message); }
  }

  async function removePost(id) {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try { await api.deletePost(id); setPosts((current) => current.filter((post) => post._id !== id)); }
    catch (err) { setError(err.message); }
  }

  return (
    <main className="min-h-screen bg-ink text-ivory"><div className="max-w-2xl mx-auto px-8"><NavBar />
      <div className="mt-10 mb-6"><h1 className="font-display text-3xl uppercase tracking-wide">Community feed</h1><p className="text-muted mt-2">Share the moments around Tamasha Hub.</p></div>
      {user && <form onSubmit={submitPost} className="bg-surface border border-white/10 rounded-card p-5 mb-8">
        <textarea value={caption} onChange={(event) => setCaption(event.target.value)} maxLength={500} placeholder="Write a caption..." className="w-full bg-ink border border-white/10 rounded-lg p-3 text-sm" rows={3} />
        <div className="flex flex-wrap gap-3 mt-3 items-center"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setImage(event.target.files?.[0] || null)} required /><button disabled={submitting} className="bg-marigold text-marigold-dark rounded-full px-5 py-2 text-sm font-extrabold disabled:opacity-50">{submitting ? "Posting..." : "Share photo"}</button></div>
      </form>}
      {error && <p className="text-hibiscus mb-5">{error}</p>}
      {loading && <p className="text-muted">Loading posts...</p>}
      <div className="space-y-6 pb-16">{posts.map((post) => { const liked = user && post.likes.some((like) => (like._id || like) === user._id); const own = user?._id === (post.user?._id || post.user); return <article key={post._id} className="bg-surface border border-white/10 rounded-card overflow-hidden"><img src={post.imageUrl} alt={post.caption || "Community post"} className="w-full max-h-[560px] object-cover" /><div className="p-4 sm:p-5"><div className="flex items-center justify-between gap-3">{post.user?.role === "artist" ? <Link href={`/artists/${post.user._id}`} className="font-semibold hover:text-marigold">{post.user.name}</Link> : <p className="font-semibold">{post.user?.name || "Tamasha member"}</p>}{own&&<div className="flex gap-3 text-xs"><button onClick={()=>setEditingPostId(editingPostId===post._id?null:post._id)} className="text-marigold">Edit</button><button onClick={()=>removePost(post._id)} className="text-hibiscus">Delete</button></div>}</div>{editingPostId===post._id&&<div className="mt-3 flex flex-wrap gap-2 items-center"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setReplacementImage(e.target.files?.[0]||null)}/><button onClick={()=>editPost(post)} className="text-sm text-marigold font-semibold">Save caption/photo</button></div>}{post.caption && <p className="mt-2 text-sm">{post.caption}</p>}<button onClick={() => likePost(post._id)} className={`mt-4 text-sm font-semibold ${liked ? "text-marigold" : "text-muted hover:text-ivory"}`}>{liked ? "♥ Liked" : "♡ Like"} · {post.likeCount ?? post.likes.length}</button><div className="mt-4 space-y-2">{post.comments.map((comment) => <p key={comment._id} className="text-sm text-muted"><span className="text-ivory font-semibold">{comment.user?.name || "Member"}</span> {comment.text}</p>)}</div>{user && <form onSubmit={(event) => submitComment(event, post._id)} className="flex gap-2 mt-4"><input value={comments[post._id] || ""} onChange={(event) => setComments((current) => ({ ...current, [post._id]: event.target.value }))} maxLength={300} placeholder="Add a comment" className="flex-1 min-w-0 bg-ink border border-white/10 rounded-full px-4 py-2 text-sm" /><button className="text-marigold text-sm font-semibold">Send</button></form>}</div></article>; })}</div>
    </div></main>
  );
}
