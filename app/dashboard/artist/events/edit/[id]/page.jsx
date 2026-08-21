"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import EventForm from "@/components/EventForm";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    api
      .getEvent(id)
      .then((data) => setEvent(data.event))
      .catch((err) => setLoadError(err.message));
  }, [id]);

  async function handleUpdate(fields, bannerFile) {
    await api.updateEvent(id, fields, bannerFile);
    router.push("/dashboard/artist");
  }

  const isOwner = event && (event.artist?._id === user?._id || event.artist === user?._id);

  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <main className="min-h-screen bg-ink text-ivory">
        <div className="max-w-5xl mx-auto px-8">
          <NavBar />
          <div className="max-w-lg mx-auto py-10">
            <Link href="/dashboard/artist" className="text-muted text-sm hover:text-ivory transition">
              ← Back to your events
            </Link>
            <h1 className="font-display text-2xl uppercase tracking-wide mt-4 mb-6">Edit event</h1>

            {loadError && <p className="text-hibiscus text-sm mb-4">{loadError}</p>}

            {event && !isOwner && (
              <p className="text-hibiscus text-sm mb-4">
                You don&apos;t own this event, so saving changes will be rejected by the server.
              </p>
            )}

            {event ? (
              <div className="bg-surface border border-white/10 rounded-card p-8">
                <EventForm
                  initialValues={{
                    title: event.title,
                    description: event.description,
                    venue: event.venue,
                    date: event.date?.slice(0, 16),
                    ticketPrice: event.ticketPrice,
                    totalTickets: event.totalTickets,
                    status: event.status,
                    bannerUrl: event.bannerUrl,
                  }}
                  onSubmit={handleUpdate}
                  submitLabel="Save changes"
                />
              </div>
            ) : (
              !loadError && <p className="text-muted">Loading event...</p>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}