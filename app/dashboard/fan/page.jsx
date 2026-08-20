"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function FanDashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["fan"]}>
      <main style={{ maxWidth: 600, margin: "40px auto" }}>
        <h1>Fan Dashboard</h1>
        <p>Welcome, {user?.name}. Event discovery and wallet UI land here on Day 3.</p>
        <button onClick={logout}>Log out</button>
      </main>
    </ProtectedRoute>
  );
}
