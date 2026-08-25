"use client";

import {useEffect, useState} from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavBar from "@/components/NavBar";
import WalletCard from "@/components/WalletCard";
import {useAuth} from "@/context/AuthContext";
import {api} from "@/lib/api";

export default function FanDashboard() {
  const {user} = useAuth();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  api.getWallet()
  .then((data) => setWallet(data.wallet))
  .catch((err) => setError(err.message))
  .finally(() => setLoading(false));
}, []);

return (
  <ProtectedRoute allowedRoles={["fan"]}>
    <main className="min-h-screen bg-ink text-ivory">
      <div className="max-w-5xl mx-auto px-8">
        <NavBar />

        <div className="mt-10 mb-8">
          <h1 className="font-display text-3xl uppercase tracking-wide mb-2">Welcome, {user?.name}</h1>
          <p className="text-muted">Your wallet and savings goals, all in one place.</p>
        </div>

        <div className="max-w-md pb-16">
          {loading && <p className="text-muted">Loading your wallet....</p>}
          {error && <p className="text-hibiscus">{error}</p>}
          {wallet && <WalletCard wallet={wallet}/>}

        </div>
      </div>
    </main>
  </ProtectedRoute>
)

}
