"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between py-5 border-b border-white/10">
      <Link href="/" className="font-display text-2xl tracking-wide text-marigold">
        TUB
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-muted text-sm hidden sm:inline">Hi, {user.name}</span>
            <button
              onClick={logout}
              className="border border-white/10 text-ivory rounded-full px-4 py-2 text-sm font-semibold hover:bg-white/5 transition"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="border border-white/10 text-ivory rounded-full px-4 py-2 text-sm font-semibold hover:bg-white/5 transition">
                Log in
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-marigold text-marigold-dark rounded-full px-4 py-2 text-sm font-extrabold hover:opacity-90 transition">
                Sign up free
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}