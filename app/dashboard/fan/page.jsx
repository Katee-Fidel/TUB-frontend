"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import WalletCard from "@/components/WalletCard";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const money = (value) => Number(value || 0).toLocaleString("en-KE");

export default function FanDashboard() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      const [walletData, ticketData] = await Promise.all([api.getWallet(), api.getMyTickets()]);
      setWallet(walletData.wallet || null);
      setTickets(ticketData.tickets || []);
    } catch (err) {
      setError(err.message || "Could not load your dashboard");
    } finally {
      silent ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const activeTickets = tickets.filter((ticket) => ["paid", "pending"].includes(String(ticket.status).toLowerCase()));
  const usedTickets = tickets.filter((ticket) => String(ticket.status).toLowerCase() === "used");

  return (
    <ProtectedRoute allowedRoles={["fan"]}>
      <main className="min-h-screen bg-ink text-ivory">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 pb-16">
          <NavBar />

          <section className="pt-9 sm:pt-12 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-marigold text-xs font-mono font-bold uppercase tracking-[0.18em]">TUB / Fan space</p>
              <h1 className="font-display text-4xl uppercase tracking-wide mt-2">Welcome, {user?.name}</h1>
              <p className="text-muted mt-2">Your wallet, tickets and upcoming experiences in one place.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => loadDashboard(true)} disabled={loading || refreshing} className="border border-white/10 rounded-full px-4 py-2.5 text-sm font-semibold hover:bg-white/5 disabled:opacity-50">{refreshing ? "Refreshing…" : "Refresh"}</button>
              <Link href="/events" className="bg-marigold text-marigold-dark rounded-full px-5 py-2.5 text-sm font-extrabold">Discover events</Link>
            </div>
          </section>

          {loading && <p className="text-muted mt-10">Loading your space...</p>}
          {error && <div className="mt-8 rounded-card border border-hibiscus/30 bg-hibiscus/10 p-4 text-hibiscus">{error}<button onClick={() => loadDashboard()} className="ml-3 underline">Retry</button></div>}

          {!loading && !error && (
            <>
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <div className="bg-surface border border-white/10 rounded-card p-5"><p className="text-muted text-xs uppercase tracking-wide">Wallet</p><p className="font-display text-2xl mt-2 text-marigold">KES {money(wallet?.balance)}</p></div>
                <div className="bg-surface border border-white/10 rounded-card p-5"><p className="text-muted text-xs uppercase tracking-wide">Active tickets</p><p className="font-display text-2xl mt-2">{activeTickets.length}</p></div>
                <div className="bg-surface border border-white/10 rounded-card p-5"><p className="text-muted text-xs uppercase tracking-wide">Used tickets</p><p className="font-display text-2xl mt-2">{usedTickets.length}</p></div>
                <div className="bg-surface border border-white/10 rounded-card p-5"><p className="text-muted text-xs uppercase tracking-wide">Savings goals</p><p className="font-display text-2xl mt-2">{wallet?.savingGoals?.length || 0}</p></div>
              </section>

              <section className="grid lg:grid-cols-[1.15fr_.85fr] gap-5 mt-6">
                <div className="bg-surface border border-white/10 rounded-card p-5">
                  <div className="flex items-center justify-between gap-3 mb-5"><div><h2 className="font-display text-xl uppercase">Your wallet</h2><p className="text-muted text-xs mt-1">Ready when your next event calls.</p></div><Link href="/wallet" className="text-marigold text-xs font-semibold">Manage wallet →</Link></div>
                  {wallet ? <WalletCard wallet={wallet} /> : <p className="text-muted text-sm">Wallet information is unavailable.</p>}
                </div>

                <div className="bg-surface border border-white/10 rounded-card p-5">
                  <div className="flex items-center justify-between mb-5"><div><h2 className="font-display text-xl uppercase">My tickets</h2><p className="text-muted text-xs mt-1">Your latest entry passes.</p></div><Link href="/dashboard/fan/tickets" className="text-marigold text-xs font-semibold">View all →</Link></div>
                  {!tickets.length ? <p className="text-muted text-sm">No tickets yet. Find an event and get your next pass.</p> : <div className="space-y-3">{tickets.slice(0, 3).map((ticket) => <div key={ticket._id} className="border border-white/10 rounded-lg p-3"><div className="flex justify-between gap-3"><p className="font-semibold text-sm truncate">{ticket.event?.title || "Event"}</p><span className="text-[10px] uppercase font-bold text-marigold">{ticket.status}</span></div><p className="text-muted text-xs mt-1">Qty {ticket.quantity} · KES {money(ticket.totalAmount)}</p></div>)}</div>}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
