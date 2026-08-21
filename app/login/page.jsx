"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
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
      const user = await login(form);
      router.push(user.role === "artist" ? "/dashboard/artist" : "/dashboard/fan");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink text-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display text-2xl text-marigold block text-center mb-8">
          TUB
        </Link>

        <div className="bg-surface border border-white/10 rounded-card p-8">
          <h1 className="font-display text-2xl uppercase tracking-wide mb-6">Log in</h1>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label">Email</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>

            {error && <p className="text-hibiscus text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-marigold text-marigold-dark rounded-full py-3 font-extrabold hover:opacity-90 disabled:opacity-50 transition"
            >
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>

        <p className="text-muted text-sm text-center mt-6">
          New here?{" "}
          <Link href="/register" className="text-marigold font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}