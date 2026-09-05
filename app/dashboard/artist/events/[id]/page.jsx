"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { api } from "@/lib/api";

const money = (value) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(Number(value) || 0);

function Stat({ label, value, detail }) {
  return <div className="bg-surface border border-white/10 rounded-card p-5"><p className="text-muted text-xs uppercase tracking-wide">{label}</p><p className="font-display text-2xl mt-2">{value}</p>{detail && <p className="text-muted text-xs mt-1">{detail}</p>}</div>;
}

export default function EventAnalyticsPage() {
  const params = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (silent = false) => {
    if (!params?.id) return;
    silent ? setRefreshing(true) : setLoading(true);
    setError("");
    try { setData(await api.getEventAnalytics(params.id)); }
    catch (err) { setError(err.message || "Could not load event analytics"); }
    finally { silent ? setRefreshing(false) : setLoading(false); }
  }, [params?.id]);

  useEffect(() => { load(); }, [load]);

  const analytics = data?.analytics;
  const progress = analytics?.capacity ? Math.min(100, Math.round((analytics.ticketsSold / analytics.capacity) * 100)) : 0;

  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <main className="min-h-screen bg-ink text-ivory">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 pb-16">
          <NavBar />
          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link href="/dashboard/artist" className="text-sm text-muted hover:text-ivory">← Back to events</Link>
              <h1 className="font-display text-3xl uppercase tracking-wide mt-3">{data?.event?.title || "Event dashboard"}</h1>
              {data?.event && <p className="text-muted mt-1">{data.event.venue} · {new Date(data.event.date).toLocaleString()}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => load(true)} disabled={refreshing || loading} className="border border-white/10 rounded-full px-4 py-2.5 text-sm font-semibold disabled:opacity-50">{refreshing ? "Refreshing…" : "Refresh"}</button>
              {data?.event && <Link href={`/dashboard/artist/scan?eventId=${data.event._id}`} className="bg-marigold text-marigold-dark rounded-full px-5 py-2.5 text-sm font-extrabold">Validate tickets</Link>}
            </div>
          </div>

          {loading && <p className="text-muted mt-10">Loading event analytics...</p>}
          {error && <div className="mt-8 rounded-card border border-hibiscus/30 bg-hibiscus/10 p-4 text-hibiscus">{error}<button onClick={() => load()} className="ml-3 underline">Retry</button></div>}

          {data && analytics && <>
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <Stat label="Revenue" value={money(analytics.revenue)} detail="Paid & admitted tickets" />
              <Stat label="Tickets sold" value={analytics.ticketsSold} detail={`${progress}% of capacity`} />
              <Stat label="Remaining" value={analytics.ticketsRemaining} detail={`of ${analytics.capacity} capacity`} />
              <Stat label="Check-ins" value={analytics.checkIns} detail="Guests admitted" />
            </section>

            <section className="bg-surface border border-white/10 rounded-card p-5 mt-4">
              <div className="flex justify-between text-sm mb-2"><span>Ticket sales</span><span>{analytics.ticketsSold} / {analytics.capacity}</span></div>
              <div className="h-3 rounded-full bg-ink overflow-hidden"><div className="h-full bg-marigold transition-all" style={{ width: `${progress}%` }} /></div>
            </section>

            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <Stat label="Paid" value={analytics.paidTickets} />
              <Stat label="Pending" value={analytics.pendingTickets} />
              <Stat label="Cancelled" value={analytics.cancelledTickets} />
              <Stat label="Used" value={analytics.checkIns} />
            </section>

            <section className="mt-8 bg-surface border border-white/10 rounded-card overflow-hidden">
              <div className="p-5 border-b border-white/10"><h2 className="font-display text-xl uppercase">Recent transactions</h2><p className="text-xs text-muted mt-1">Latest ticket activity for this event</p></div>
              {data.recentTransactions?.length === 0 ? <p className="p-6 text-muted">No ticket transactions yet.</p> : <div className="divide-y divide-white/10">
                {data.recentTransactions?.map((ticket) => <div key={ticket._id} className="p-5 flex flex-wrap items-center justify-between gap-3">
                  <div><p className="font-semibold">{ticket.user?.name || "Guest"}</p><p className="text-xs text-muted">{ticket.user?.email || ""} · {new Date(ticket.createdAt).toLocaleString()}</p></div>
                  <div className="text-right"><p className="font-semibold">{ticket.quantity} ticket{ticket.quantity === 1 ? "" : "s"} · {money(ticket.totalAmount)}</p><p className="text-xs text-muted uppercase">{ticket.status} · {ticket.paymentMethod}</p></div>
                </div>)}
              </div>}
            </section>
          </>}
        </div>
      </main>
    </ProtectedRoute>
  );
}
