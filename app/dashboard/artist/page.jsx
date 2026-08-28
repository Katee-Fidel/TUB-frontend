"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import EventCard from "@/components/EventCard";
import { api } from "@/lib/api";

const money = (value) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(Number(value) || 0);

function Stat({ label, value, detail }) {
  return <div className="bg-surface border border-white/10 rounded-card p-5"><p className="text-muted text-xs uppercase tracking-wide">{label}</p><p className="font-display text-2xl mt-2">{value}</p>{detail && <p className="text-muted text-xs mt-1">{detail}</p>}</div>;
}

export default function ArtistDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    setError("");
    try { setDashboard(await api.getArtistDashboard()); }
    catch (err) { setError(err.message || "Could not load artist dashboard"); }
    finally { silent ? setRefreshing(false) : setLoading(false); }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  async function handleDelete(id) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      await api.deleteEvent(id);
      await loadDashboard(true);
    } catch (err) { alert(err.message); }
  }

  const summary = dashboard?.summary;
  const events = dashboard?.events || [];
  const sales = dashboard?.recentSales || [];
  const progress = summary?.capacity ? Math.min(100, Math.round((summary.ticketsSold / summary.capacity) * 100)) : 0;

  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <main className="min-h-screen bg-ink text-ivory">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 pb-16">
          <NavBar />

          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-muted text-sm">Artist workspace</p>
              <h1 className="font-display text-3xl uppercase tracking-wide mt-1">Dashboard</h1>
              <p className="text-muted mt-1">Manage events, track sales, and validate guests.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => loadDashboard(true)} disabled={refreshing || loading} className="border border-white/10 rounded-full px-4 py-2.5 text-sm font-semibold disabled:opacity-50">{refreshing ? "Refreshing…" : "Refresh"}</button>
              <Link href="/dashboard/artist/scan" className="border border-white/10 text-ivory rounded-full px-5 py-2.5 text-sm font-extrabold hover:bg-white/5 transition">Validate ticket</Link>
              <Link href="/dashboard/artist/events/new" className="bg-marigold text-marigold-dark rounded-full px-5 py-2.5 text-sm font-extrabold hover:opacity-90 transition">+ Create event</Link>
            </div>
          </div>

          {loading && <p className="text-muted mt-10">Loading your dashboard...</p>}
          {error && <div className="mt-8 rounded-card border border-hibiscus/30 bg-hibiscus/10 p-4 text-hibiscus">{error}<button onClick={() => loadDashboard()} className="ml-3 underline">Retry</button></div>}

          {summary && <>
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <Stat label="Revenue" value={money(summary.revenue)} detail="Paid & used tickets" />
              <Stat label="Tickets sold" value={summary.ticketsSold} detail={`${progress}% of capacity`} />
              <Stat label="Events" value={summary.totalEvents} detail={`${summary.publishedEvents} published · ${summary.draftEvents} drafts`} />
              <Stat label="Check-ins" value={summary.checkIns} detail={`${summary.ticketsRemaining} tickets remaining`} />
            </section>

            <section className="bg-surface border border-white/10 rounded-card p-5 mt-4">
              <div className="flex justify-between text-sm mb-2"><span>Overall ticket sales</span><span>{summary.ticketsSold} / {summary.capacity}</span></div>
              <div className="h-3 rounded-full bg-ink overflow-hidden"><div className="h-full bg-marigold transition-all" style={{ width: `${progress}%` }} /></div>
            </section>

            <section className="mt-8">
              <div className="flex items-center justify-between mb-5"><div><h2 className="font-display text-xl uppercase">Your events</h2><p className="text-muted text-sm mt-1">Open an event dashboard for detailed sales.</p></div></div>
              {!events.length ? <div className="bg-surface border border-white/10 rounded-card p-10 text-center"><p className="text-muted">You haven&apos;t created any events yet.</p><Link href="/dashboard/artist/events/new" className="inline-block mt-4 bg-marigold text-marigold-dark rounded-full px-5 py-2.5 text-sm font-extrabold">Create your first event</Link></div> :
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {events.map((event) => <EventCard key={event._id} event={event} actions={<>
                    <Link href={`/dashboard/artist/events/${event._id}`} className="flex-1"><button className="w-full bg-marigold text-marigold-dark rounded-full py-2 text-xs font-semibold hover:opacity-90 transition">Dashboard</button></Link>
                    <Link href={`/dashboard/artist/events/edit/${event._id}`} className="flex-1"><button className="w-full border border-white/10 text-ivory rounded-full py-2 text-xs font-semibold hover:bg-white/5 transition">Edit</button></Link>
                    <button onClick={() => handleDelete(event._id)} className="flex-1 border border-hibiscus/30 text-hibiscus rounded-full py-2 text-xs font-semibold hover:bg-hibiscus/10 transition">Delete</button>
                  </>} />)}
                </div>}
            </section>

            <section className="mt-8 bg-surface border border-white/10 rounded-card overflow-hidden">
              <div className="p-5 border-b border-white/10"><h2 className="font-display text-xl uppercase">Recent sales</h2><p className="text-xs text-muted mt-1">Latest paid and used ticket activity across your events.</p></div>
              {!sales.length ? <p className="p-6 text-muted">No ticket sales yet.</p> : <div className="divide-y divide-white/10">{sales.map((ticket) => <div key={ticket._id} className="p-5 flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{ticket.user?.name || "Guest"}</p><p className="text-xs text-muted">{ticket.event?.title || "Event"} · {ticket.user?.email || ""}</p></div><div className="text-right"><p className="font-semibold">{ticket.quantity} ticket{ticket.quantity === 1 ? "" : "s"} · {money(ticket.totalAmount)}</p><p className="text-xs text-muted uppercase">{ticket.status} · {ticket.paymentMethod}</p></div></div>)}</div>}
            </section>
          </>}
        </div>
      </main>
    </ProtectedRoute>
  );
}
