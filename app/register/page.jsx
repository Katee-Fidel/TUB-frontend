"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "fan",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await register(form);
      router.push(user.role === "artist" ? "/dashboard/artist" : "/dashboard/fan");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink text-ivory flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-2xl text-marigold block text-center mb-8">
          Tamasha-Hub
        </Link>

        <div className="bg-surface border border-white/10 rounded-card p-8">
          <h1 className="font-display text-2xl uppercase tracking-wide mb-6">Create an account</h1>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label">Full name</label>
              <input name="name" placeholder="" value={form.name} onChange={handleChange} required className="!text-black" />
            </div>

            <div className="field">
              <label className="field-label">Email</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="field">
              <label className="field-label">Phone</label>
              <input name="phone" type="tel" placeholder="2547XXXXXXXX" value={form.phone} onChange={handleChange} required />
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>

            <div className="field">
              <label className="field-label">I am a...</label>
              <div className="flex gap-2">
                <label
                  className={`flex-1 text-center py-2.5 rounded-full text-sm font-semibold cursor-pointer border transition ${
                    form.role === "fan"
                      ? "bg-marigold text-marigold-dark border-marigold"
                      : "border-white/10 text-muted"
                  }`}
                >
                  <input type="radio" name="role" value="fan" checked={form.role === "fan"} onChange={handleChange} className="hidden" />
                  Fan
                </label>
                <label
                  className={`flex-1 text-center py-2.5 rounded-full text-sm font-semibold cursor-pointer border transition ${
                    form.role === "artist"
                      ? "bg-marigold text-marigold-dark border-marigold"
                      : "border-white/10 text-muted"
                  }`}
                >
                  <input type="radio" name="role" value="artist" checked={form.role === "artist"} onChange={handleChange} className="hidden" />
                  Artist
                </label>
              </div>
            </div>

            {error && <p className="text-hibiscus text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-marigold text-marigold-dark rounded-full py-3 font-extrabold hover:opacity-90 disabled:opacity-50 transition"
            >
              {submitting ? "Creating account..." : "Register"}
            </button>
          </form>
        </div>

        <p className="text-muted text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-marigold font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}