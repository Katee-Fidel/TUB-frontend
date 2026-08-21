"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import EventCard from "@/components/EventCard";
import { api } from "@/lib/api";

export default function ArtistDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  function loadEvents() {
    setLoading(true);
    api
      .getMyEvents()
      .then((data) => setEvents(data.events))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  async function handleDelete(id) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      await api.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <main className="min-h-screen bg-ink text-ivory">
        <div className="max-w-5xl mx-auto px-8">
          <NavBar />

          <div className="flex items-center justify-between mt-10 mb-6">
            <h1 className="font-display text-3xl uppercase tracking-wide">Your events</h1>
            <Link href="/dashboard/artist/events/new">
              <button className="bg-marigold text-marigold-dark rounded-full px-5 py-2.5 text-sm font-extrabold hover:opacity-90 transition">
                + Create event
              </button>
            </Link>
          </div>

          {loading && <p className="text-muted">Loading your events...</p>}
          {error && <p className="text-hibiscus">{error}</p>}

          {!loading && events.length === 0 && (
            <div className="bg-surface border border-white/10 rounded-card p-10 text-center">
              <p className="text-muted">You haven&apos;t created any events yet.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                actions={
                  <>
                    <Link href={`/dashboard/artist/events/edit/${event._id}`} className="flex-1">
                      <button className="w-full border border-white/10 text-ivory rounded-full py-2 text-xs font-semibold hover:bg-white/5 transition">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="flex-1 border border-hibiscus/30 text-hibiscus rounded-full py-2 text-xs font-semibold hover:bg-hibiscus/10 transition"
                    >
                      Delete
                    </button>
                  </>
                }
              />
            ))}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}