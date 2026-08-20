"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";


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
      // Logged in, but wrong role — bounce to their own dashboard rather than a dead end
      router.replace(user.role === "artist" ? "/dashboard/artist" : "/dashboard/fan");
    }
  }, [user, loading, allowedRoles, router]);

  if (loading || !user) {
    return <p style={{ padding: 40 }}>Loading...</p>;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null; // redirect is in flight
  }

  return children;
}
