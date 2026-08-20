"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function ArtistDashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <main style={{ maxWidth: 600, margin: "40px auto" }}>
        <h1>Artist Dashboard</h1>
        <p>Welcome, {user?.name}. Event creation UI lands here on Day 2.</p>
        <button onClick={logout}>Log out</button>
      </main>
    </ProtectedRoute>
  );
}
