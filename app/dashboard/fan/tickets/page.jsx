"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { api } from "@/lib/api";

const POLL_INTERVAL = 5000;
const MAX_POLLS = 24;

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const pollCount = useRef(0);

  const loadTickets = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      const data = await api.getMyTickets();
      setTickets(data.tickets || []);
      return data.tickets || [];
    } catch (err) {
      setError(err.message || "Could not load your tickets");
      return [];
    } finally {
      silent ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  const hasPendingTickets = tickets.some((ticket) => ticket.status === "pending");

  useEffect(() => {
    if (!hasPendingTickets) {
      pollCount.current = 0;
      return;
    }

    const interval = setInterval(async () => {
      pollCount.current += 1;
      const updated = await loadTickets(true);
      const stillPending = updated.some((ticket) => ticket.status === "pending");
      if (!stillPending || pollCount.current >= MAX_POLLS) {
        clearInterval(interval);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [hasPendingTickets, loadTickets]);

  return (
    <ProtectedRoute allowedRoles={["fan"]}>
      <main className="min-h-screen bg-ink text-ivory">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <NavBar />

          <section className="mt-10 border-b border-white/20 pb-8">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-marigold">Your entry pass</p>
                <h1 className="font-display text-4xl uppercase leading-none tracking-wide sm:text-5xl">My tickets</h1>
                {hasPendingTickets && (
                  <p className="mt-3 max-w-xl text-sm text-muted">
                    Payment confirmation is being checked automatically. Complete the M-Pesa prompt on your phone.
                  </p>
                )}
              </div>
              <button
                onClick={() => loadTickets(true)}
                disabled={loading || refreshing}
                className="border border-white/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-ivory transition hover:border-white disabled:opacity-50"
              >
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </section>

          <section className="py-8">
            {loading && <p className="text-sm text-muted">Loading your tickets...</p>}

            {error && (
              <div className="mb-6 border border-hibiscus/50 bg-hibiscus/10 p-4 text-sm text-hibiscus">
                {error}
                <button onClick={() => loadTickets()} className="ml-3 font-bold underline underline-offset-4">Retry</button>
              </div>
            )}

            {!loading && tickets.length === 0 && (
              <div className="border border-white/20 bg-surface-lowest p-10 text-center sm:p-16">
                <p className="mb-2 font-display text-2xl uppercase">No tickets yet.</p>
                <p className="text-sm text-muted">Your confirmed event passes will appear here.</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tickets.map((ticket) => {
                const status = String(ticket.status || "").toLowerCase();
                const statusMessage = status === "pending"
                  ? "Waiting for payment confirmation"
                  : status === "paid"
                    ? "Payment confirmed — ready for entry"
                    : status === "used"
                      ? "This ticket has already been used for entry"
                      : status === "cancelled"
                        ? "Payment was not completed or was cancelled"
                        : ticket.status;
                const statusClass = status === "cancelled" ? "text-hibiscus" : status === "used" ? "text-muted" : "text-marigold";

                return (
                  <article key={ticket._id} className="overflow-hidden border border-white/25 bg-surface">
                    <header className="border-b border-dashed border-white/30 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Event pass</p>
                          <h2 className="font-display text-2xl uppercase leading-tight tracking-wide text-ivory">{ticket.event?.title || "Event"}</h2>
                        </div>
                        <span className={`shrink-0 border border-current px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${statusClass}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="mt-3 text-xs uppercase tracking-[0.08em] text-muted">
                        {ticket.event?.date ? new Date(ticket.event.date).toLocaleString() : "Date unavailable"}
                      </p>
                    </header>

                    <div className="p-5">
                      <p className="mb-5 text-xs leading-relaxed text-muted">{statusMessage}</p>

                      {(status === "paid" || status === "used") && ticket.qrImageUrl && (
                        <div className="border border-white/20 bg-white p-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={ticket.qrImageUrl} alt="Ticket QR" className="mx-auto aspect-square w-full max-w-52 object-contain" />
                        </div>
                      )}

                      {(status === "paid" || status === "used") && !ticket.qrImageUrl && (
                        <div className="border border-white/20 p-8 text-center">
                          <p className="font-display text-lg uppercase">QR preparing</p>
                          <p className="mt-2 text-xs text-muted">Your ticket is confirmed. Refresh in a moment.</p>
                        </div>
                      )}

                      {status === "pending" && (
                        <div className="border border-marigold/40 bg-marigold/5 p-5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-marigold">Payment pending</p>
                          <p className="mt-2 text-xs leading-relaxed text-muted">Keep this page open while your M-Pesa payment is confirmed.</p>
                        </div>
                      )}

                      {status === "cancelled" && (
                        <div className="border border-hibiscus/40 bg-hibiscus/5 p-5">
                          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-hibiscus">Ticket cancelled</p>
                          <p className="mt-2 text-xs leading-relaxed text-muted">This pass is not valid for entry.</p>
                        </div>
                      )}

                      <div className="mt-5 grid grid-cols-2 border-t border-white/15 pt-4">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Quantity</p>
                          <p className="mt-1 text-sm font-bold text-ivory">{ticket.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Total</p>
                          <p className="mt-1 text-sm font-bold text-ivory">KES {ticket.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
