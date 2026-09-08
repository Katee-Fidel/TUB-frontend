"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function TicketPurchase({ event }) {
  const { user } = useAuth();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [method, setMethod] = useState("wallet");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState(null);

  const remaining = event.ticketsRemaining ?? (event.totalTickets - (event.ticketsSold ?? 0));
  const total = (event.ticketPrice || 0) * quantity;

  async function pollTicket(ticketId) {
    setStatus("polling");
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const data = await api.getTicketStatus(ticketId);
        if (data.status === "paid") { setTicket(data.ticket); setStatus("done"); return; }
        if (data.status === "cancelled") { setError("Payment was cancelled or failed."); setStatus("error"); return; }
        if (data.status === "failed") { setError("Payment failed or was cancelled."); setStatus("error"); return; }
      } catch (err) {
        setError(err.message); setStatus("error"); return;
      }
    }
    setError("Still waiting on confirmation — check 'My tickets' shortly.");
    setStatus("error");
  }

  async function handlePurchase(e) {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    setError("");
    setStatus("submitting");
    try {
      if (method === "wallet") {
        const data = await api.purchaseTicket(event._id, { quantity, paymentMethod: "wallet" });
        setTicket(data.ticket);
        setStatus("done");
      } else {
        const data = await api.purchaseTicket(event._id, { quantity, paymentMethod: "mpesa", phone });
        await pollTicket(data.ticketId);
      }
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "done" && ticket) {
    return (
      <div className="border-t border-white/10 pt-6 text-center">
        <p className="text-marigold font-semibold mb-3 uppercase tracking-wider">Ticket confirmed</p>
        {ticket.qrImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ticket.qrImageUrl} alt="Ticket QR code" className="mx-auto w-40 h-40 bg-white p-2" />
        )}
        <p className="text-muted text-xs mt-3">Show this at the gate. Also saved under "My tickets."</p>
      </div>
    );
  }

  return (
    <form onSubmit={handlePurchase} className="border-t border-white/10 pt-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-mono text-xl font-bold">KES {event.ticketPrice}</p>
          <p className="text-muted text-xs uppercase tracking-wide">{remaining} tickets remaining</p>
        </div>
        <div className="flex items-center border border-white/10">
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 border-r border-white/10 text-ivory hover:bg-surface-2" aria-label="Decrease quantity">−</button>
          <span className="w-9 text-center text-sm font-bold">{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => Math.min(remaining, q + 1))} className="w-9 h-9 border-l border-white/10 text-ivory hover:bg-surface-2" aria-label="Increase quantity">+</button>
        </div>
      </div>

      <div className="grid grid-cols-2 border border-white/10 mb-5">
        <label className={`text-center py-3 text-xs font-bold uppercase tracking-wider cursor-pointer border-r border-white/10 transition ${method === "wallet" ? "bg-marigold text-marigold-dark" : "text-muted hover:bg-surface-2"}`}>
          <input type="radio" name="method" value="wallet" checked={method === "wallet"} onChange={() => setMethod("wallet")} className="sr-only" />
          Wallet
        </label>
        <label className={`text-center py-3 text-xs font-bold uppercase tracking-wider cursor-pointer transition ${method === "mpesa" ? "bg-marigold text-marigold-dark" : "text-muted hover:bg-surface-2"}`}>
          <input type="radio" name="method" value="mpesa" checked={method === "mpesa"} onChange={() => setMethod("mpesa")} className="sr-only" />
          M-Pesa
        </label>
      </div>

      {method === "mpesa" && (
        <div className="field">
          <label className="field-label">M-Pesa phone</label>
          <input type="tel" placeholder="2547XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
      )}

      {error && <p className="text-hibiscus text-sm mb-3" role="alert">{error}</p>}

      <div className="flex items-end justify-between mb-4 border-t border-white/10 pt-4">
        <span className="text-muted text-xs uppercase tracking-wide">Order total</span>
        <span className="font-mono text-lg font-bold">KES {total}</span>
      </div>

      <button
        type="submit"
        disabled={status === "submitting" || status === "polling" || remaining < 1}
        className="w-full bg-marigold text-marigold-dark border border-marigold px-6 py-3 font-extrabold uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition"
      >
        {status === "submitting" && "Starting..."}
        {status === "polling" && "Waiting for M-Pesa..."}
        {(status === "idle" || status === "error") && (remaining < 1 ? "Sold out" : `Pay KES ${total}`)}
      </button>
    </form>
  );
}
