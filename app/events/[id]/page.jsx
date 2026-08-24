"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { api } from "@/lib/api";

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getEvent(id)
      .then((data) => setEvent(data.event))
      .catch((err) => setError(err.message));
  }, [id]);

  return (
    <main className="min-h-screen bg-ink text-ivory">
      <div className="max-w-5xl mx-auto px-8">
        <NavBar />

        <div className="max-w-lg mx-auto py-10">
          <Link href="/events" className="text-muted text-sm hover:text-ivory transition">
            ← Back to discover
          </Link>

          {error && <p className="text-hibiscus mt-6">{error}</p>}
          {!event && !error && <p className="text-muted mt-6">Loading...</p>}

          {event && (
            <div className="bg-surface border border-white/10 rounded-card overflow-hidden mt-4">
              <div className="h-56 bg-gradient-to-br from-surface-2 to-surface">
                {event.bannerUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
                )}
              </div>

              <div className="relative border-t-2 border-dashed border-white/10 mx-4">
                <div className="absolute rounded-full bg-ink" style={{ width: 18, height: 18, top: -10, left: -22 }} />
                <div className="absolute rounded-full bg-ink" style={{ width: 18, height: 18, top: -10, right: -22 }} />
              </div>

              <div className="p-8">
                <h1 className="font-display text-3xl uppercase tracking-wide mb-2">{event.title}</h1>
                <p className="text-muted mb-4">By {event.artist?.name}</p>
                <p className="text-ivory mb-1">{event.venue}</p>
                <p className="text-muted text-sm mb-6">{new Date(event.date).toLocaleString()}</p>
                <p className="text-ivory/90 mb-6 leading-relaxed">{event.description}</p>

                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <div>
                    <p className="font-mono text-xl font-bold">KES {event.ticketPrice}</p>
                    <p className="text-muted text-xs">{event.ticketsRemaining} tickets remaining</p>
                  </div>
                  <button
                    disabled
                    className="bg-marigold/40 text-marigold-dark rounded-full px-6 py-3 font-extrabold cursor-not-allowed"
                  >
                    Buy ticket (Day 5)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}