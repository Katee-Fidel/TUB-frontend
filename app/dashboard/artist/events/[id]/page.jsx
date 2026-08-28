"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { api } from "@/lib/api";

const money = (value) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(value || 0);

export default function EventAnalyticsPage() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.id) return;
    setLoading(true);
    api.getEventAnalytics(params.id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params?.id]);

  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <main className="min-h-screen bg-ink text-ivory">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 pb-16">
          <NavBar />
          <div className="mt-10 flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link href="/dashboard/artist" className="text-sm text-muted hover:text-ivory">← Back to events</Link>
              <h1 className="font-display text-3xl uppercase tracking-wide mt-3">{data?.event?.title || "Event dashboard"}</h1>
              {data?.event && <p className="text-muted mt-1">{data.event.venue} · {new Date(data.event.date).toLocaleString()}</p>}
            </div>
            {data?.event && <Link href={`/dashboard/artist/scan?eventId=${data.event._id}`} className="bg-marigold text-marigold-dark rounded-full px-5 py-2.5 text-sm font-extrabold">Validate tickets</Link>}
          </div>

          {loading && <p className="text-muted mt-10">Loading event analytics...</p>}
          {error && <div className="mt-8 rounded-card border border-hibiscus/30 bg-hibiscus/10 p-4 text-hibiscus">{error}</div>}

          {data && (
            <>
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                {[
                  ["Revenue", money(data.analytics.revenue)],
                  ["Tickets sold", data.analytics.ticketsSold],
                  ["Remaining", data.analytics.ticketsRemaining],
                  ["Check-ins", data.analytics.checkIns],
                  ["Paid", data.analytics.paidTickets],
                  ["Pending", data.analytics.pendingTickets],
                  ["Cancelled", data.analytics.cancelledTickets],
                  ["Capacity", data.analytics.capacity],
                ].map(([label, value]) => (
                  <div key={label} className="bg-surface border border-white/10 rounded-card p-5">
                    <p className="text-muted text-xs uppercase tracking-wide">{label}</p>
                    <p className="font-display text-2xl mt-2">{value}</p>
                  </div>
                ))}
              </section>

              <section className="mt-8 bg-surface border border-white/10 rounded-card overflow-hidden">
                <div className="p-5 border-b border-white/10"><h2 className="font-display text-xl uppercase">Recent transactions</h2></div>
                {data.recentTransactions.length === 0 ? (
                  <p className="p-6 text-muted">No ticket transactions yet.</p>
                ) : (
                  <div className="divide-y divide-white/10">
                    {data.recentTransactions.map((ticket) => (
                      <div key={ticket._id} className="p-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{ticket.user?.name || "Guest"}</p>
                          <p className="text-xs text-muted">{ticket.user?.email || ""} · {new Date(ticket.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{ticket.quantity} ticket{ticket.quantity === 1 ? "" : "s"} · {money(ticket.totalAmount)}</p>
                          <p className="text-xs text-muted uppercase">{ticket.status} · {ticket.paymentMethod}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
