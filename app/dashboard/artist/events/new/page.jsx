"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import EventForm from "@/components/EventForm";
import { api } from "@/lib/api";

export default function NewEventPage() {
  const router = useRouter();

  async function handleCreate(fields, bannerFile) {
    await api.createEvent(fields, bannerFile);
    router.push("/dashboard/artist");
  }

  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <main className="min-h-screen bg-ink text-ivory">
        <div className="max-w-5xl mx-auto px-8">
          <NavBar />
          <div className="max-w-lg mx-auto py-10">
            <Link href="/dashboard/artist" className="text-muted text-sm hover:text-ivory transition">
              ← Back to your events
            </Link>
            <h1 className="font-display text-2xl uppercase tracking-wide mt-4 mb-6">Create event</h1>
            <div className="bg-surface border border-white/10 rounded-card p-8">
              <EventForm onSubmit={handleCreate} submitLabel="Create event" />
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}