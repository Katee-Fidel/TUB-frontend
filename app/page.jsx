import NavBar from "@/components/NavBar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink text-ivory">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <NavBar />

        <section className="grid min-h-[calc(100vh-88px)] items-center gap-10 py-14 lg:grid-cols-12 lg:gap-6 lg:py-20">
          <div className="lg:col-span-8">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-marigold">Tamasha Hub / Live culture / Kenya</p>
            <h1 className="max-w-5xl font-display text-6xl uppercase leading-[0.86] tracking-tight sm:text-7xl md:text-8xl lg:text-[7.5rem]">
              Nairobi&apos;s<br />
              <span className="text-marigold">stage</span><br />
              is yours.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-muted sm:text-lg">
              Discover the events shaping the city. Save toward the ones you love. Buy tickets directly from the artists and creators putting Kenya on stage.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/events" className="bg-marigold px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.08em] text-marigold-dark hover:opacity-90">Explore events</Link>
              <Link href="/register" className="border border-white/40 px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.08em] text-ivory hover:bg-ivory hover:text-ink">Create an account</Link>
            </div>
          </div>

          <div className="border-l border-white/20 pl-6 lg:col-span-4 lg:pl-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">01 / Discover</p>
            <p className="mt-4 font-display text-3xl uppercase leading-tight sm:text-4xl">Find the room where it happens.</p>
            <div className="mt-8 border-t border-white/20 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">02 / Show up</p>
              <p className="mt-3 text-sm leading-6 text-muted">Secure your ticket, keep it in your dashboard, and arrive ready to check in.</p>
            </div>
            <div className="mt-6 border-t border-white/20 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">03 / Create</p>
              <p className="mt-3 text-sm leading-6 text-muted">Artists get the tools to publish events, sell tickets, and track the crowd.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
