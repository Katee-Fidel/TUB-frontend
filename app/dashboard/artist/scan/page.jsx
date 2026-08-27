"use client";

import { useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { api } from "@/lib/api";

export default function TicketValidationPage() {
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const data = await api.validateTicket(token);
      setResult({ type: "success", message: data.message, ticket: data.ticket });
      setToken("");
    } catch (error) {
      setResult({ type: "error", message: error.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <main className="min-h-screen bg-ink text-ivory">
        <div className="max-w-xl mx-auto px-8">
          <NavBar />

          <div className="mt-10 mb-8">
            <Link href="/dashboard/artist" className="text-muted text-sm hover:text-ivory">← Your events</Link>
            <h1 className="font-display text-3xl uppercase tracking-wide mt-4">Validate ticket</h1>
            <p className="text-muted mt-2">Scan a guest&apos;s QR code with your scanner, then paste its token here to admit them.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface border border-white/10 rounded-card p-6">
            <label className="field-label" htmlFor="ticket-token">Ticket QR token</label>
            <textarea
              id="ticket-token"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              required
              rows={5}
              placeholder="Scanner output appears here"
              className="w-full rounded-lg bg-ink border border-white/10 p-3 text-sm text-ivory focus:outline-none focus:border-marigold"
            />
            <button
              type="submit"
              disabled={submitting || !token.trim()}
              className="w-full mt-4 bg-marigold text-marigold-dark rounded-full px-6 py-3 font-extrabold hover:opacity-90 disabled:opacity-50 transition"
            >
              {submitting ? "Checking ticket..." : "Admit guest"}
            </button>
          </form>

          {result && (
            <div className={`mt-5 rounded-card border p-5 ${result.type === "success" ? "border-marigold/40 bg-marigold/10" : "border-hibiscus/40 bg-hibiscus/10"}`}>
              <p className={result.type === "success" ? "text-marigold font-semibold" : "text-hibiscus font-semibold"}>{result.message}</p>
              {result.ticket && (
                <p className="text-muted text-sm mt-2">
                  {result.ticket.user?.name || "Guest"} · {result.ticket.event?.title || "Event"} · {result.ticket.quantity} ticket(s)
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
