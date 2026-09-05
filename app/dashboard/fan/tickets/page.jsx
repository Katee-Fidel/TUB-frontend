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
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <NavBar />
          <div className="flex flex-wrap items-center justify-between gap-4 mt-10 mb-6">
            <div>
              <h1 className="font-display text-3xl uppercase tracking-wide">My tickets</h1>
              {hasPendingTickets && <p className="text-marigold text-sm mt-2">Payment confirmation is being checked automatically. Complete the M-Pesa prompt on your phone.</p>}
            </div>
            <button onClick={() => loadTickets(true)} disabled={loading || refreshing} className="border border-white/10 rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-50">
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {loading && <p className="text-muted">Loading your tickets...</p>}
          {error && <div className="mb-5 rounded-card border border-hibiscus/30 bg-hibiscus/10 p-4 text-hibiscus">{error}<button onClick={() => loadTickets()} className="ml-3 underline">Retry</button></div>}
          {!loading && tickets.length === 0 && (
            <div className="bg-surface border border-white/10 rounded-card p-10 text-center">
              <p className="text-muted">No tickets yet.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
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

              return (
                <div key={ticket._id} className="bg-surface border border-white/10 rounded-card overflow-hidden p-5">
                  <p className="font-display text-lg uppercase tracking-wide mb-1">{ticket.event?.title || "Event"}</p>
                  <p className="text-muted text-sm mb-3">{ticket.event?.date ? new Date(ticket.event.date).toLocaleString() : ""}</p>
                  <p className={`text-xs uppercase tracking-wide font-semibold mb-1 ${status === "cancelled" ? "text-hibiscus" : "text-marigold"}`}>{ticket.status}</p>
                  <p className="text-muted text-xs mb-4">{statusMessage}</p>
                  {(status === "paid" || status === "used") && ticket.qrImageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ticket.qrImageUrl} alt="Ticket QR" className="w-36 h-36 rounded-lg bg-white p-2 mx-auto" />
                  )}
                  {(status === "paid" || status === "used") && !ticket.qrImageUrl && (
                    <p className="text-muted text-xs text-center py-8">Your ticket is confirmed. The QR code is being prepared; refresh in a moment.</p>
                  )}
                  <p className="text-muted text-xs mt-4">Qty: {ticket.quantity} · KES {ticket.totalAmount}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
