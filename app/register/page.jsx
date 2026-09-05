"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthShell from "@/components/AuthShell";

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
    <AuthShell mode="register" error={error} submitting={submitting} onSubmit={handleSubmit}>
      <label className="auth-field">
        <span>Full name</span>
        <input name="name" type="text" placeholder="Full name" value={form.name} onChange={handleChange} required />
      </label>
      <label className="auth-field">
        <span>Email address</span>
        <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
      </label>
      <label className="auth-field">
        <span>Phone number</span>
        <input name="phone" type="tel" placeholder="2547XXXXXXXX" value={form.phone} onChange={handleChange} required />
      </label>
      <label className="auth-field">
        <span>Password</span>
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      </label>
      <fieldset className="auth-role">
        <legend>Account type</legend>
        <label className={form.role === "fan" ? "selected" : ""}><input type="radio" name="role" value="fan" checked={form.role === "fan"} onChange={handleChange} /> Fan</label>
        <label className={form.role === "artist" ? "selected" : ""}><input type="radio" name="role" value="artist" checked={form.role === "artist"} onChange={handleChange} /> Artist</label>
      </fieldset>
    </AuthShell>
  );
}