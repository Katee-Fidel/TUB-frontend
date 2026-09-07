// Shared event card for discovery and artist event management.
// `actions` is optional — artist dashboards can inject management controls.

export default function EventCard({ event, actions }) {
  const date = new Date(event.date);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const remaining = event.ticketsRemaining ?? Math.max((event.totalTickets ?? 0) - (event.ticketsSold ?? 0), 0);
  const soldOut = remaining <= 0;

  return (
    <div className="group w-full bg-surface border border-white/10 rounded-card overflow-hidden shadow-card-lift transition duration-200 hover:-translate-y-1 hover:border-marigold/30">
      <div className="relative h-44 bg-gradient-to-br from-surface-2 to-surface overflow-hidden">
        {event.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 flex items-end p-5 bg-gradient-to-br from-surface-2 to-ink">
            <span className="font-display text-4xl text-white/10 uppercase">TUB</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 bg-marigold text-marigold-dark rounded-lg px-2.5 py-1.5 text-center font-mono shadow-lg">
          <span className="block text-xl font-bold leading-none">{day}</span>
          <span className="text-[10px] font-bold tracking-wide">{month}</span>
        </div>
        {event.status === "draft" && (
          <span className="absolute top-3 right-3 bg-ink/85 text-muted text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full border border-white/10">
            Draft
          </span>
        )}
        {soldOut && event.status !== "draft" && (
          <span className="absolute bottom-3 right-3 bg-hibiscus text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
            Sold out
          </span>
        )}
      </div>

      <div className="relative border-t border-dashed border-white/10 mx-4">
        <div className="absolute rounded-full bg-ink" style={{ width: 16, height: 16, top: -9, left: -24 }} />
        <div className="absolute rounded-full bg-ink" style={{ width: 16, height: 16, top: -9, right: -24 }} />
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl uppercase tracking-wide leading-tight mb-1 line-clamp-2">{event.title}</h3>
        <p className="text-muted text-sm truncate">{event.venue || "Venue TBA"}</p>
        <p className="text-muted text-xs mt-1">{date.toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric" })}</p>

        <div className="flex items-end justify-between gap-3 mt-5">
          <div>
            <p className="font-mono text-base font-bold text-ivory">KES {Number(event.ticketPrice || 0).toLocaleString()}</p>
            <p className="text-muted text-[11px] uppercase tracking-wide">Entry ticket</p>
          </div>
          <p className={`text-xs font-semibold ${soldOut ? "text-hibiscus" : "text-muted"}`}>
            {soldOut ? "No tickets left" : `${remaining.toLocaleString()} left`}
          </p>
        </div>

        {actions && <div className="flex gap-2 pt-4 mt-4 border-t border-white/10">{actions}</div>}
      </div>
    </div>
  );
}
