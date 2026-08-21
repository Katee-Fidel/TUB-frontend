"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

/**
 * Wraps a page and enforces auth + role checks client-side.
 *
 * Why client-side and not Next.js middleware.js:
 * Our backend (Render) and frontend (Vercel) are on different domains, so the
 * httpOnly JWT cookies set by Express are only ever sent on requests TO the
 * Render API — the browser will not attach them to requests for the Next.js
 * pages themselves. That means edge middleware on Vercel has no cookie to
 * read. Instead, we rely on AuthContext's /auth/me call (which DOES send the
 * cookie, since it's a request to the API) to know who's logged in.
 *
 * Usage:
 *   <ProtectedRoute allowedRoles={["artist"]}>
 *     <ArtistDashboard />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.replace(user.role === "artist" ? "/dashboard/artist" : "/dashboard/fan");
    }
  }, [user, loading, allowedRoles, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="text-muted text-sm">Loading...</p>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
}