"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="relative py-5 border-b border-white/10">
      <div className="flex items-center justify-between">
        <Link href="/" onClick={closeMenu} className="font-display text-2xl tracking-wide text-marigold">TUB</Link>

        <div className="hidden sm:flex items-center gap-3">
          <Link href="/events" className="text-muted text-sm font-semibold hover:text-ivory transition">Discover</Link>
          <Link href="/community" className="text-muted text-sm font-semibold hover:text-ivory transition">Feed</Link>
          {user ? (
            <>
              <Link href="/profile" className="text-muted text-sm font-semibold hover:text-ivory transition">Profile</Link>
              <span className="text-muted text-sm">Hi, {user.name}</span>
              <button onClick={logout} className="border border-white/10 text-ivory rounded-full px-4 py-2 text-sm font-semibold hover:bg-white/5 transition">Log out</button>
            </>
          ) : (
            <>
              <Link href="/login"><button className="border border-white/10 text-ivory rounded-full px-4 py-2 text-sm font-semibold hover:bg-white/5 transition">Log in</button></Link>
              <Link href="/register"><button className="bg-marigold text-marigold-dark rounded-full px-4 py-2 text-sm font-extrabold hover:opacity-90 transition">Sign up free</button></Link>
            </>
          )}
        </div>

        <button type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-ivory hover:bg-white/5 transition">
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-5 bg-current transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-white/10 bg-surface p-3 shadow-2xl">
          <div className="flex flex-col gap-1">
            <Link href="/events" onClick={closeMenu} className="rounded-xl px-4 py-3 text-muted text-sm font-semibold hover:bg-white/5 hover:text-ivory transition">Discover</Link>
            <Link href="/community" onClick={closeMenu} className="rounded-xl px-4 py-3 text-muted text-sm font-semibold hover:bg-white/5 hover:text-ivory transition">Feed</Link>
            {user ? (
              <>
                <Link href="/profile" onClick={closeMenu} className="rounded-xl px-4 py-3 text-muted text-sm font-semibold hover:bg-white/5 hover:text-ivory transition">Profile</Link>
                <div className="px-4 py-3 text-muted text-sm border-t border-white/10 mt-1">Hi, {user.name}</div>
                <button onClick={() => { closeMenu(); logout(); }} className="w-full rounded-xl border border-white/10 px-4 py-3 text-left text-ivory text-sm font-semibold hover:bg-white/5 transition">Log out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu} className="rounded-xl px-4 py-3 text-ivory text-sm font-semibold hover:bg-white/5 transition">Log in</Link>
                <Link href="/register" onClick={closeMenu} className="rounded-xl bg-marigold px-4 py-3 text-marigold-dark text-sm font-extrabold hover:opacity-90 transition">Sign up free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
