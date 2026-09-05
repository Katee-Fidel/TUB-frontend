"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/AuthShell";

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
    <AuthShell mode="login" error={error} submitting={submitting} onSubmit={handleSubmit}>
      <label className="auth-field">
        <span>Email address</span>
        <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
      </label>
      <label className="auth-field auth-field-password">
        <span>Password</span>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <span className="auth-eye" aria-hidden="true">○</span>
      </label>
      <div className="auth-options">
        <label><input type="checkbox" /> <span>Remember me</span></label>
        <a href="#forgot-password">Forgot password?</a>
      </div>
    </AuthShell>
  );
}