"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import EventCard from "@/components/EventCard";
import { api } from "@/lib/api";
export default function ArtistPage(){const {id}=useParams();const [data,setData]=useState(null);const [error,setError]=useState("");useEffect(()=>{if(id)api.getUserProfile(id).then(setData).catch(e=>setError(e.message))},[id]);return <main className="min-h-screen bg-ink text-ivory"><div className="max-w-5xl mx-auto px-4 sm:px-8"><NavBar/>{error&&<p className="mt-10 text-hibiscus">{error}</p>}{!data&&!error&&<p className="mt-10 text-muted">Loading profile...</p>}{data&&<><div className="mt-10 flex items-center gap-4"><div className="w-16 h-16 rounded-full bg-marigold overflow-hidden">{data.user.avatarUrl&&<img src={data.user.avatarUrl} alt="" className="w-full h-full object-cover"/>}</div><div><h1 className="font-display text-3xl uppercase">{data.user.name}</h1><p className="text-muted text-sm">{data.user.role === "artist" ? "Artist & event organizer" : "Tamasha member"}</p></div></div><h2 className="font-display text-2xl uppercase mt-10 mb-5">Upcoming events</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">{data.events.map(event=><EventCard key={event._id} event={event}/>)}</div>{data.user.role!=="artist"&&<Link href="/community" className="text-marigold">Back to community</Link>}</>}</div></main>}
