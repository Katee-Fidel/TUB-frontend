import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink text-ivory">
      <div className="max-w-5xl mx-auto px-8">
        <NavBar />

        <section className="py-20">
          <h1 className="font-display text-5xl sm:text-6xl uppercase leading-[0.95] tracking-wide max-w-xl">
            Nairobi's <span className="text-marigold">stage</span>
            <br />
            is yours.
          </h1>
          <p className="text-muted text-lg mt-5 max-w-md">
            Fans discover and save toward the events they love. Artists sell tickets
            directly to the people who show up for them.
          </p>
          <div className="flex gap-3 mt-8">
            <a href="/register">
              <button className="bg-marigold text-marigold-dark rounded-full px-6 py-3 font-extrabold hover:opacity-90 transition">
                Get started
              </button>
            </a>
            <a href="/login">
              <button className="border border-white/10 text-ivory rounded-full px-6 py-3 font-semibold hover:bg-white/5 transition">
                Log in
              </button>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}