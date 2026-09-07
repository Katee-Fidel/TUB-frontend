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
    <nav className="relative z-50 flex items-center justify-between py-4 sm:py-5">
      <Link href="/" onClick={closeMenu} className="font-display text-2xl tracking-wide text-champagne transition hover:text-ivory">TUB</Link>

      <div className="hidden sm:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.025] p-1 backdrop-blur-md">
        <Link href="/events" className="rounded-full px-4 py-2 text-muted text-sm font-semibold hover:bg-white/5 hover:text-ivory transition">Discover</Link>
        <Link href="/community" className="rounded-full px-4 py-2 text-muted text-sm font-semibold hover:bg-white/5 hover:text-ivory transition">Feed</Link>
        {user ? (
          <>
            {isArtist && <Link href="/dashboard/artist" className="rounded-full px-4 py-2 text-muted text-sm font-semibold hover:bg-white/5 hover:text-ivory transition">Dashboard</Link>}
            <Link href="/profile" className="rounded-full px-4 py-2 text-muted text-sm font-semibold hover:bg-white/5 hover:text-ivory transition">Profile</Link>
            <span className="hidden lg:inline px-3 text-muted text-xs">Hi, {user.name}</span>
            <button onClick={logout} className="tub-button-secondary min-h-9 px-4 py-2 text-xs">Log out</button>
          </>
        ) : (
          <>
            <Link href="/login" className="tub-button-secondary min-h-9 px-4 py-2 text-xs">Log in</Link>
            <Link href="/register" className="tub-button-primary min-h-9 px-4 py-2 text-xs">Sign up free</Link>
          </>
        )}
      </div>

      <button type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)} className="sm:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-ivory backdrop-blur-md hover:bg-white/5 transition">
        <span className="sr-only">Menu</span>
        <span className="flex flex-col gap-1.5"><span className="block h-0.5 w-5 bg-current" /><span className="block h-0.5 w-5 bg-current" /><span className="block h-0.5 w-5 bg-current" /></span>
      </button>

      {open && (
        <div className="sm:hidden absolute left-0 right-0 top-full z-50 mt-2 rounded-panel border border-white/10 bg-surface/95 p-3 shadow-card-lift backdrop-blur-xl">
          <div className="flex flex-col gap-1">
            <Link onClick={closeMenu} href="/events" className="rounded-lg px-4 py-3 text-sm font-semibold text-muted hover:bg-white/5 hover:text-ivory">Discover</Link>
            <Link onClick={closeMenu} href="/community" className="rounded-lg px-4 py-3 text-sm font-semibold text-muted hover:bg-white/5 hover:text-ivory">Feed</Link>
            {user ? (
              <>
                {isArtist && <Link onClick={closeMenu} href="/dashboard/artist" className="rounded-lg px-4 py-3 text-sm font-semibold text-muted hover:bg-white/5 hover:text-ivory">Dashboard</Link>}
                <Link onClick={closeMenu} href="/profile" className="rounded-lg px-4 py-3 text-sm font-semibold text-muted hover:bg-white/5 hover:text-ivory">Profile</Link>
                <button onClick={() => { closeMenu(); logout(); }} className="tub-button-secondary mt-1 w-full justify-start text-sm">Log out</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link onClick={closeMenu} href="/login" className="tub-button-secondary">Log in</Link>
                <Link onClick={closeMenu} href="/register" className="tub-button-primary">Sign up free</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
