"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import EventCard from "@/components/EventCard";
import {api} from "@/lib/api";

export default function DiscoverEventPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api 
            .getPublicEvents()
            .then((data) => setEvents(data.events))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-ink text-ivory">
            <div className="max-w-5xl mx-auto px-8">
                <NavBar/>
                <div className="mt-10 mb-6">
                    <h1 className="font-display text-3xl uppercase tracking-wide">Come ucheki Events</h1>
                    <p className="text-muted mt-1">Fresh from artists & creators across the 254 </p>
                </div>
                {loading && <p className="text-muted">Loading events...</p>}
                {error && <p className="text-hibiscus">{error}</p>}

                {!loading && !error && events.length === 0 && (
                    <div className="bg-surface border border-white/10 rounded-card p-10 text-center">
                        <p className="text-muted">No events published yet. Check back soon.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
                    {events.map((event) => (
                        <link key={event._id} href={`/events/${event._id}`}>
                            <EventCard event={event}/>
                        </link>
                    ))}
                </div>
            </div>
        </main>
    );
}