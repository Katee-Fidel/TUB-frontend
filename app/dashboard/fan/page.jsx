"use client";

import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import WalletCard from "@/components/WalletCard";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const money = (value) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(Number(value) || 0);

export default function FanDashboard() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [error, setError] = useState("");
  const [transactionError, setTransactionError] = useState("");

  const loadTransactions = useCallback(async () => {
    setLoadingTransactions(true);
    setTransactionError("");
    try {
      const data = await api.getWalletTransactions();
      setTransactions(data.transactions || []);
    } catch (err) {
      setTransactionError(err.message || "Could not load transaction history");
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  useEffect(() => {
    api.getWallet()
      .then((data) => setWallet(data.wallet))
      .catch((err) => setError(err.message || "Could not load wallet"))
      .finally(() => setLoading(false));
    loadTransactions();
  }, [loadTransactions]);

  return (
    <ProtectedRoute allowedRoles={["fan"]}>
      <main className="min-h-screen bg-ink text-ivory">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 pb-16">
          <NavBar />
          <div className="mt-10 mb-8">
            <h1 className="font-display text-3xl uppercase tracking-wide mb-2">Welcome, {user?.name}</h1>
            <p className="text-muted">Your wallet and savings goals, all in one place.</p>
          </div>

          {loading && <p className="text-muted">Loading your wallet...</p>}
          {error && <p className="text-hibiscus">{error}</p>}
          {wallet && <div className="max-w-md"><WalletCard wallet={wallet} /></div>}

          <section className="mt-8 bg-surface border border-white/10 rounded-card overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl uppercase">Transaction history</h2>
                <p className="text-xs text-muted mt-1">Wallet top-ups and ticket payments.</p>
              </div>
              <button onClick={loadTransactions} disabled={loadingTransactions} className="border border-white/10 rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-50">
                {loadingTransactions ? "Loading..." : "Refresh"}
              </button>
            </div>
            {transactionError && <div className="p-5 text-hibiscus text-sm">{transactionError}</div>}
            {!loadingTransactions && !transactionError && !transactions.length && <p className="p-6 text-muted">No transactions yet.</p>}
            {!loadingTransactions && !transactionError && transactions.length > 0 && (
              <div className="divide-y divide-white/10">
                {transactions.map((transaction) => {
                  const credit = transaction.direction === "credit";
                  const label = transaction.type === "wallet_topup" ? "Wallet top-up" : transaction.type === "ticket_purchase" ? "Ticket purchase" : transaction.type === "refund" ? "Refund" : "Wallet adjustment";
                  return (
                    <div key={transaction._id} className="p-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{label}</p>
                        <p className="text-xs text-muted mt-1">{transaction.event?.title || "Wallet"} · {new Date(transaction.createdAt).toLocaleString()}</p>
                        {transaction.ticket && <p className="text-xs text-muted mt-1">{transaction.ticket.quantity} ticket{transaction.ticket.quantity === 1 ? "" : "s"}</p>}
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${credit ? "text-emerald-400" : "text-hibiscus"}`}>{credit ? "+" : "-"}{money(transaction.amount)}</p>
                        <p className="text-xs text-muted uppercase mt-1">{transaction.status}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
