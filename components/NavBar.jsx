"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const isArtist = user?.role === "artist";

  const closeMenu = () => setOpen(false);

  return (
    <nav className="relative flex items-center justify-between py-4 sm:py-5 border-b border-white/10">
      <Link href="/" onClick={closeMenu} className="font-display text-2xl tracking-wide text-marigold">
        TUB
      </Link>

      <div className="hidden sm:flex items-center gap-3">
        <Link href="/events" className="text-muted text-sm font-semibold hover:text-ivory transition">Discover</Link>
        <Link href="/community" className="text-muted text-sm font-semibold hover:text-ivory transition">Feed</Link>
        {user ? (
          <>
            {isArtist && <Link href="/dashboard/artist" className="text-muted text-sm font-semibold hover:text-ivory transition">Dashboard</Link>}
            <Link href="/profile" className="text-muted text-sm font-semibold hover:text-ivory transition">Profile</Link>
            <span className="text-muted text-sm hidden md:inline">Hi, {user.name}</span>
            <button onClick={logout} className="border border-white/10 text-ivory rounded-full px-4 py-2 text-sm font-semibold hover:bg-white/5 transition">Log out</button>
          </>
        ) : (
          <>
            <Link href="/login"><button className="border border-white/10 text-ivory rounded-full px-4 py-2 text-sm font-semibold hover:bg-white/5 transition">Log in</button></Link>
            <Link href="/register"><button className="bg-marigold text-marigold-dark rounded-full px-4 py-2 text-sm font-extrabold hover:opacity-90 transition">Sign up free</button></Link>
          </>
        )}
      </div>

      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="sm:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ivory hover:bg-white/5 transition"
      >
        <span className="sr-only">Menu</span>
        <span className="flex flex-col gap-1.5">
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
          <span className="block h-0.5 w-5 bg-current" />
        </span>
      </button>

      {open && (
        <div className="sm:hidden absolute left-0 right-0 top-full z-50 mt-2 rounded-card border border-white/10 bg-surface p-3 shadow-xl">
          <div className="flex flex-col gap-1">
            <Link onClick={closeMenu} href="/events" className="rounded-lg px-4 py-3 text-sm font-semibold text-muted hover:bg-white/5 hover:text-ivory">Discover</Link>
            <Link onClick={closeMenu} href="/community" className="rounded-lg px-4 py-3 text-sm font-semibold text-muted hover:bg-white/5 hover:text-ivory">Feed</Link>
            {user ? (
              <>
                {isArtist && <Link onClick={closeMenu} href="/dashboard/artist" className="rounded-lg px-4 py-3 text-sm font-semibold text-muted hover:bg-white/5 hover:text-ivory">Dashboard</Link>}
                <Link onClick={closeMenu} href="/profile" className="rounded-lg px-4 py-3 text-sm font-semibold text-muted hover:bg-white/5 hover:text-ivory">Profile</Link>
                <button onClick={() => { closeMenu(); logout(); }} className="mt-1 w-full rounded-full border border-white/10 px-4 py-3 text-left text-sm font-semibold text-ivory hover:bg-white/5">Log out</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link onClick={closeMenu} href="/login" className="rounded-full border border-white/10 px-4 py-3 text-center text-sm font-semibold text-ivory">Log in</Link>
                <Link onClick={closeMenu} href="/register" className="rounded-full bg-marigold px-4 py-3 text-center text-sm font-extrabold text-marigold-dark">Sign up free</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
