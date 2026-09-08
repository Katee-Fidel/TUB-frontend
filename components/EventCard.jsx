// Editorial event card. `actions` is optional for artist management views.

export default function EventCard({ event, actions }) {
  const date = new Date(event.date);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();

  return (
    <div className="group flex h-full w-full flex-col overflow-hidden border border-white/30 bg-surface transition hover:border-white">
      <div className="relative h-44 bg-surface-2">
        {event.bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.bannerUrl} alt={event.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full items-end p-4 font-display text-3xl uppercase text-muted">TUB / LIVE</div>
        )}
        <div className="absolute left-0 top-0 bg-marigold px-3 py-2 text-center font-bold text-marigold-dark">
          <span className="block text-2xl leading-none">{day}</span>
          <span className="text-[10px] font-bold tracking-[0.12em]">{month}</span>
        </div>
        {event.status === "draft" && (
          <span className="absolute right-0 top-0 bg-ink px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Draft</span>
        )}
      </div>

      <div className="border-t border-dashed border-white/30" />

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl uppercase leading-tight tracking-wide text-ivory">{event.title}</h3>
        <p className="mt-2 text-sm text-muted">{event.venue}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <p className="font-body text-sm font-bold text-ivory">KES {event.ticketPrice}<span className="ml-1 font-normal text-[11px] text-muted">/ from</span></p>
          <span className="text-right text-xs uppercase tracking-wide text-muted">{event.ticketsSold ?? 0}/{event.totalTickets} sold</span>
        </div>
        {actions && <div className="mt-4 flex gap-2 border-t border-white/10 pt-3">{actions}</div>}
      </div>
    </div>
  );
}
