// Ticket-stub styled event card. `actions` is optional — the artist
// dashboard passes Edit/Delete buttons; the public discovery grid omits it.

export default function EventCard({ event, actions }) {
  const date = new Date(event.date);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();

  return (
    <div className="flex-none w-64 bg-surface border border-white/10 rounded-card overflow-hidden">
      <div className="relative h-36 bg-gradient-to-br from-surface-2 to-surface">
        {event.bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute top-3 left-3 bg-marigold text-marigold-dark rounded-lg px-2.5 py-1.5 text-center font-mono">
          <span className="block text-xl font-bold leading-none">{day}</span>
          <span className="text-[10px] font-bold tracking-wide">{month}</span>
        </div>
        {event.status === "draft" && (
          <span className="absolute top-3 right-3 bg-ink/80 text-muted text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded">
            Draft
          </span>
        )}
      </div>

      <div className="relative border-t-2 border-dashed border-white/10 mx-3.5">
        <div className="absolute rounded-full bg-ink" style={{ width: 18, height: 18, top: -10, left: -24 }} />
        <div className="absolute rounded-full bg-ink" style={{ width: 18, height: 18, top: -10, right: -24 }} />
      </div>

      <div className="p-4 pt-4">
        <h3 className="font-display text-lg uppercase tracking-wide mb-2 leading-tight">
          {event.title}
        </h3>
        <p className="text-muted text-sm mb-3">{event.venue}</p>
        <div className="flex items-center justify-between mb-3">
          <p className="font-mono text-sm font-bold text-ivory">
            KES {event.ticketPrice} <span className="text-muted font-normal text-[11px]">/ from</span>
          </p>
          <span className="text-muted text-xs">
            {event.ticketsSold ?? 0}/{event.totalTickets} sold
          </span>
        </div>
        {actions && <div className="flex gap-2 pt-2 border-t border-white/10">{actions}</div>}
      </div>
    </div>
  );
}