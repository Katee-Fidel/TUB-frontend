"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { api } from "@/lib/api";

function TicketCard({ ticket }) {
  const event = ticket.event || {};
  const eventDate = event.date ? new Date(event.date) : null;
  const isPaid = ticket.status === "paid";

  return (
    <article className="bg-surface border border-white/10 rounded-card overflow-hidden shadow-lg">
      <div className="relative aspect-[16/9] bg-surface-2 overflow-hidden">
        {event.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.bannerUrl}
            alt={`${event.title || "Event"} poster`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-2 px-6 text-center">
            <span className="font-display text-2xl uppercase tracking-wide text-muted">
              {event.title || "TUB Event"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <div className="absolute left-4 bottom-4 right-4">
          <p className="font-display text-2xl uppercase tracking-wide text-ivory drop-shadow">
            {event.title || "Event"}
          </p>
          {eventDate && !Number.isNaN(eventDate.getTime()) && (
            <p className="text-sm text-ivory/90 mt-1">
              {eventDate.toLocaleDateString()} · {event.venue || "Venue TBA"}
            </p>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-xs uppercase tracking-[0.18em] font-semibold text-marigold">
            {ticket.status}
          </span>
          <span className="text-muted text-xs">
            Qty {ticket.quantity} · KES {Number(ticket.totalAmount || 0).toLocaleString()}
          </span>
        </div>

        {isPaid && ticket.qrImageUrl ? (
          <div className="rounded-card bg-ink border border-white/10 p-5">
            <p className="text-center text-xs uppercase tracking-[0.18em] text-muted mb-4">
              Present this QR at the entrance
            </p>
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ticket.qrImageUrl}
                alt="Ticket QR code"
                className="w-full max-w-[260px] aspect-square rounded-xl bg-white p-3"
              />
            </div>
          </div>
        ) : (
          <div className="rounded-card border border-white/10 bg-ink p-6 text-center">
            <p className="font-semibold">Payment pending</p>
            <p className="text-muted text-sm mt-1">Your QR code will appear once the ticket is confirmed.</p>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-ink/60 border border-white/5 p-3">
            <p className="text-muted text-xs uppercase tracking-wide">Venue</p>
            <p className="mt-1 truncate">{event.venue || "TBA"}</p>
          </div>
          <div className="rounded-lg bg-ink/60 border border-white/5 p-3">
            <p className="text-muted text-xs uppercase tracking-wide">Purchased</p>
            <p className="mt-1 truncate">
              {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <span>Ticket ID</span>
          <span className="font-mono truncate max-w-[65%]" title={ticket._id}>{ticket._id}</span>
        </div>
      </div>
    </article>
  );
}

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
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <NavBar />
          <div className="mt-10 mb-8">
            <p className="text-marigold text-xs uppercase tracking-[0.2em] font-semibold">Your passes</p>
            <h1 className="font-display text-4xl uppercase tracking-wide mt-2">My tickets</h1>
            <p className="text-muted mt-2">Your event poster and entry QR are kept together on each ticket.</p>
          </div>

          {loading && <p className="text-muted">Loading your tickets...</p>}
          {error && <p className="text-hibiscus">{error}</p>}
          {!loading && tickets.length === 0 && (
            <div className="bg-surface border border-white/10 rounded-card p-10 text-center">
              <p className="text-muted">No tickets yet.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-16">
            {tickets.map((ticket) => <TicketCard key={ticket._id} ticket={ticket} />)}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
