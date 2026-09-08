"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import TicketPurchase from "@/components/TicketPurchase";
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

        <div className="max-w-2xl mx-auto py-10">
          <Link href="/events" className="text-muted text-xs uppercase tracking-wider hover:text-ivory transition">
            ← Back to discover
          </Link>

          {error && <p className="text-hibiscus mt-6">{error}</p>}
          {!event && !error && <p className="text-muted mt-6 uppercase text-xs tracking-wider">Loading event...</p>}

          {event && (
            <article className="bg-surface border border-white/10 overflow-hidden mt-4">
              <div className="h-64 bg-gradient-to-br from-surface-2 to-surface">
                {event.bannerUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
                )}
              </div>

              <div className="border-t-2 border-dashed border-white/10" />

              <div className="p-6 sm:p-8">
                <p className="text-marigold text-xs font-bold uppercase tracking-[0.15em] mb-3">Event / Live</p>
                <h1 className="font-display text-4xl sm:text-5xl uppercase leading-none mb-3">{event.title}</h1>
                <p className="text-muted mb-6">By {event.artist?.name}</p>

                <div className="grid sm:grid-cols-2 gap-0 border-y border-white/10 mb-6">
                  <div className="py-4 sm:pr-4 sm:border-r border-white/10">
                    <p className="text-muted text-[11px] uppercase tracking-wider mb-1">Venue</p>
                    <p className="text-ivory">{event.venue}</p>
                  </div>
                  <div className="py-4 sm:pl-4">
                    <p className="text-muted text-[11px] uppercase tracking-wider mb-1">Date & time</p>
                    <p className="text-ivory">{new Date(event.date).toLocaleString()}</p>
                  </div>
                </div>

                <p className="text-ivory/90 mb-7 leading-relaxed">{event.description}</p>
                <TicketPurchase event={event} />
              </div>
            </article>
          )}
        </div>
      </div>
    </main>
  );
}
