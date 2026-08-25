// `wallet` shape: { balance, savingGoals: [{ event: { title, date, bannerUrl }, targetAmount, savedAmount }] }

export default function WalletCard({ wallet }) {
  const goals = wallet.savingGoals || [];

  return (
    <div className="bg-surface border border-white/10 rounded-card overflow-hidden">
      <div className="p-6">
        <p className="text-muted text-xs uppercase tracking-wide mb-1">Wallet balance</p>
        <p className="font-mono text-3xl font-bold text-marigold">
          KES {(wallet.balance ?? 0).toLocaleString()}
        </p>
      </div>

      <div className="relative border-t-2 border-dashed border-white/10 mx-4">
        <div className="absolute rounded-full bg-ink" style={{ width: 18, height: 18, top: -10, left: -22 }} />
        <div className="absolute rounded-full bg-ink" style={{ width: 18, height: 18, top: -10, right: -22 }} />
      </div>

      <div className="p-6 pt-5">
        <p className="text-muted text-xs uppercase tracking-wide mb-3">Savings goals</p>

        {goals.length === 0 && (
          <p className="text-muted text-sm">
            No savings goals yet. Start saving toward a ticket from any event page.
          </p>
        )}

        <div className="space-y-4">
          {goals.map((goal, i) => {
            const target = goal.targetAmount || 0;
            const saved = goal.savedAmount || 0;
            const pct = target > 0 ? Math.min(Math.round((saved / target) * 100), 100) : 0;

            return (
              <div key={goal._id || i}>
                <div className="flex items-center justify-between mb-1.5 gap-3">
                  <p className="text-sm font-semibold text-ivory truncate">
                    {goal.event?.title || "Untitled event"}
                  </p>
                  <p className="text-muted text-xs font-mono whitespace-nowrap">
                    KES {saved.toLocaleString()} / {target.toLocaleString()}
                  </p>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-marigold rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}