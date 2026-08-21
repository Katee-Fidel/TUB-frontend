"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";

export default function FanDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["fan"]}>
      <main className="min-h-screen bg-ink text-ivory">
        <div className="max-w-5xl mx-auto px-8">
          <NavBar />
          <div className="mt-10">
            <h1 className="font-display text-3xl uppercase tracking-wide mb-2">Welcome, {user?.name}</h1>
            <p className="text-muted">Event discovery and your wallet land here don't worry Andre :).</p>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}