"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const linkClass = "text-muted text-sm font-semibold uppercase tracking-wide hover:text-ivory transition";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const isArtist = user?.role === "artist";
  const closeMenu = () => setOpen(false);

  return (
    <nav className="relative flex items-center justify-between py-4 sm:py-5 border-b border-white/10">
      <Link href="/" onClick={closeMenu} className="font-display text-2xl tracking-wide text-marigold uppercase">TUB</Link>

      <div className="hidden sm:flex items-center gap-5">
        <Link href="/events" className={linkClass}>Discover</Link>
        <Link href="/community" className={linkClass}>Feed</Link>
        {user ? (
          <>
            {isArtist && <Link href="/dashboard/artist" className={linkClass}>Dashboard</Link>}
            <Link href="/profile" className={linkClass}>Profile</Link>
            <span className="text-muted text-xs uppercase tracking-wide hidden md:inline">Hi, {user.name}</span>
            <button onClick={logout} className="border border-white/30 text-ivory px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-ivory hover:text-ink transition">Log out</button>
          </>
        ) : (
          <>
            <Link href="/login" className="border border-white/30 text-ivory px-4 py-2 text-xs font-bold uppercase tracking-wide hover:bg-ivory hover:text-ink transition">Log in</Link>
            <Link href="/register" className="bg-marigold text-marigold-dark px-4 py-2 text-xs font-bold uppercase tracking-wide hover:opacity-90 transition">Sign up free</Link>
          </>
        )}
      </div>

      <button type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="sm:hidden flex h-10 w-10 items-center justify-center border border-white/30 text-ivory hover:bg-white hover:text-ink transition">
        <span className="sr-only">Menu</span>
        <span className="flex flex-col gap-1.5"><span className="block h-0.5 w-5 bg-current" /><span className="block h-0.5 w-5 bg-current" /><span className="block h-0.5 w-5 bg-current" /></span>
      </button>

      {open && (
        <div className="sm:hidden absolute left-0 right-0 top-full z-50 mt-0 border border-white/20 bg-surface p-3">
          <div className="flex flex-col gap-1">
            <Link onClick={closeMenu} href="/events" className="px-4 py-3 text-sm font-semibold uppercase tracking-wide text-muted hover:bg-surface-2 hover:text-ivory">Discover</Link>
            <Link onClick={closeMenu} href="/community" className="px-4 py-3 text-sm font-semibold uppercase tracking-wide text-muted hover:bg-surface-2 hover:text-ivory">Feed</Link>
            {user ? (
              <>
                {isArtist && <Link onClick={closeMenu} href="/dashboard/artist" className="px-4 py-3 text-sm font-semibold uppercase tracking-wide text-muted hover:bg-surface-2 hover:text-ivory">Dashboard</Link>}
                <Link onClick={closeMenu} href="/profile" className="px-4 py-3 text-sm font-semibold uppercase tracking-wide text-muted hover:bg-surface-2 hover:text-ivory">Profile</Link>
                <button onClick={() => { closeMenu(); logout(); }} className="mt-1 w-full border border-white/30 px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-ivory hover:bg-ivory hover:text-ink">Log out</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link onClick={closeMenu} href="/login" className="border border-white/30 px-4 py-3 text-center text-sm font-semibold uppercase tracking-wide text-ivory">Log in</Link>
                <Link onClick={closeMenu} href="/register" className="bg-marigold px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wide text-marigold-dark">Sign up free</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
