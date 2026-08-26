"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { api } from "@/lib/api";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getMyTickets()
      .then((data) => setTickets(data.tickets))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute allowedRoles={["fan"]}>
      <main className="min-h-screen bg-ink text-ivory">
        <div className="max-w-5xl mx-auto px-8">
          <NavBar />
          <h1 className="font-display text-3xl uppercase tracking-wide mt-10 mb-6">My tickets</h1>

          {loading && <p className="text-muted">Loading your tickets...</p>}
          {error && <p className="text-hibiscus">{error}</p>}
          {!loading && tickets.length === 0 && (
            <div className="bg-surface border border-white/10 rounded-card p-10 text-center">
              <p className="text-muted">No tickets yet.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="bg-surface border border-white/10 rounded-card overflow-hidden p-5">
                <p className="font-display text-lg uppercase tracking-wide mb-1">{ticket.event?.title || "Event"}</p>
                <p className="text-muted text-sm mb-3">
                  {ticket.event?.date ? new Date(ticket.event.date).toLocaleString() : ""}
                </p>
                <p className="text-xs uppercase tracking-wide font-semibold mb-3 text-marigold">{ticket.status}</p>
                {ticket.status === "paid" && ticket.qrImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ticket.qrImageUrl} alt="Ticket QR" className="w-32 h-32 rounded-lg bg-white p-2 mx-auto" />
                )}
                <p className="text-muted text-xs mt-3">Qty: {ticket.quantity} · KES {ticket.totalAmount}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}