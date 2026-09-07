"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import EventCard from "@/components/EventCard";
import { api } from "@/lib/api";

export default function DiscoverEventPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getPublicEvents();
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message || "Could not load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const filteredEvents = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return events;
    return events.filter((event) => [event.title, event.venue, event.description, event.artist?.name]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(value)));
  }, [events, query]);

  return (
    <main className="min-h-screen bg-ink text-ivory">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 pb-16">
        <NavBar />

        <section className="pt-10 sm:pt-14 pb-8">
          <p className="text-marigold text-xs font-mono font-bold uppercase tracking-[0.18em]">TUB / Discover</p>
          <div className="mt-3 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wide leading-none">Find your next vibe</h1>
              <p className="text-muted mt-3 max-w-2xl">Fresh events from artists and creators across the 254. Find it, book it, show up.</p>
            </div>
            <div className="w-full lg:w-80">
              <label htmlFor="event-search" className="sr-only">Search events</label>
              <input id="event-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events or venues" className="w-full rounded-full border border-white/10 bg-surface px-5 py-3 text-sm text-ivory outline-none placeholder:text-muted focus:border-marigold" />
            </div>
          </div>
        </section>

        {loading && <p className="text-muted py-10">Loading events...</p>}
        {error && <div className="rounded-card border border-hibiscus/30 bg-hibiscus/10 p-4 text-hibiscus">{error}<button onClick={loadEvents} className="ml-3 underline">Retry</button></div>}

        {!loading && !error && filteredEvents.length === 0 && (
          <div className="bg-surface border border-white/10 rounded-card p-10 text-center">
            <p className="font-display text-xl uppercase">{query ? "No matching events" : "No events published yet"}</p>
            <p className="text-muted text-sm mt-2">{query ? "Try another search term." : "Check back soon for the next TUB experience."}</p>
            {query && <button onClick={() => setQuery("")} className="mt-4 text-marigold text-sm font-semibold">Clear search</button>}
          </div>
        )}

        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((event) => (
              <Link key={event._id} href={`/events/${event._id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-marigold rounded-card">
                <EventCard event={event} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
