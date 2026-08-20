"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <main style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Create an account</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone (e.g. 2547XXXXXXXX)" value={form.phone} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />

        <fieldset>
          <legend>I am a...</legend>
          <label>
            <input type="radio" name="role" value="fan" checked={form.role === "fan"} onChange={handleChange} />
            Fan
          </label>
          <label>
            <input type="radio" name="role" value="artist" checked={form.role === "artist"} onChange={handleChange} />
            Artist
          </label>
        </fieldset>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>
    </main>
  );
}
