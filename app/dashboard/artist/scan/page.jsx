"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { api } from "@/lib/api";

function classifyError(message = "") {
  const text = message.toLowerCase();
  if (text.includes("already") || text.includes("used") || text.includes("redeemed")) return "used";
  if (text.includes("event")) return "event";
  return "invalid";
}

export default function TicketValidationPage() {
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const validatingRef = useRef(false);

  function stopCamera() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setScanning(false);
  }

  useEffect(() => () => stopCamera(), []);

  async function validateScannedToken(value) {
    const scannedToken = value?.trim();
    if (!scannedToken || validatingRef.current) return;
    validatingRef.current = true;
    stopCamera();
    setToken("");
    setSubmitting(true);
    setResult({ type: "checking", message: "Checking ticket…" });

    try {
      const data = await api.validateTicket(scannedToken);
      setResult({ type: "success", message: data.message || "Ticket valid — guest admitted.", ticket: data.ticket });
    } catch (error) {
      setResult({ type: classifyError(error.message), message: error.message || "This ticket could not be validated." });
    } finally {
      setSubmitting(false);
      validatingRef.current = false;
    }
  }

  async function startCamera() {
    setCameraError("");
    setResult(null);

    if (typeof window === "undefined" || !("BarcodeDetector" in window)) {
      setCameraError("Camera QR scanning is not supported by this browser. Use the manual token field below, or open this page in a supported Chrome-based mobile browser.");
      return;
    }

    try {
      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      setScanning(true);

      const scanFrame = async () => {
        if (!videoRef.current || !streamRef.current) return;
        try {
          if (videoRef.current.readyState >= 2) {
            const barcodes = await detector.detect(videoRef.current);
            const value = barcodes.find((barcode) => barcode.rawValue)?.rawValue;
            if (value) {
              await validateScannedToken(value);
              return;
            }
          }
        } catch (error) {
          console.error("QR detection error:", error);
        }
        frameRef.current = requestAnimationFrame(scanFrame);
      };

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      frameRef.current = requestAnimationFrame(scanFrame);
    } catch (error) {
      stopCamera();
      setCameraError(error?.name === "NotAllowedError"
        ? "Camera permission was denied. Allow camera access in your browser settings and try again."
        : "Could not start the camera. Check that this device has a camera and that the page is using HTTPS.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await validateScannedToken(token);
  }

  const resultCopy = {
    success: { title: "VALID TICKET", action: "Guest admitted" },
    used: { title: "ALREADY USED", action: "Do not admit guest" },
    event: { title: "WRONG EVENT", action: "Do not admit guest" },
    invalid: { title: "INVALID TICKET", action: "Do not admit guest" },
    checking: { title: "CHECKING…", action: "Verifying ticket" },
  };
  const currentResult = result && resultCopy[result.type];

  return (
    <ProtectedRoute allowedRoles={["artist"]}>
      <main className="min-h-screen bg-ink text-ivory">
        <div className="max-w-xl mx-auto px-5 sm:px-8">
          <NavBar />

          <div className="mt-8 sm:mt-10 mb-8">
            <Link href="/dashboard/artist" className="text-muted text-sm hover:text-ivory">← Your events</Link>
            <h1 className="font-display text-3xl uppercase tracking-wide mt-4">Validate ticket</h1>
            <p className="text-muted mt-2">Scan the guest&apos;s QR code to validate and admit them.</p>
          </div>

          <section className="bg-surface border border-white/10 rounded-card p-4 sm:p-6">
            <div className="relative overflow-hidden rounded-2xl bg-black aspect-square sm:aspect-[4/3]">
              <video ref={videoRef} muted playsInline className={`w-full h-full object-cover ${scanning ? "block" : "hidden"}`} />
              {scanning && <div className="absolute inset-0 pointer-events-none flex items-center justify-center"><div className="w-3/4 aspect-square max-w-[280px] border-2 border-marigold rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" /></div>}
              {!scanning && <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"><p className="text-muted text-sm">Camera scanner</p><p className="mt-2 text-xs text-muted">Use the rear camera and hold the QR inside the frame.</p></div>}
            </div>

            <div className="flex gap-3 mt-4">
              {!scanning ? <button type="button" onClick={startCamera} disabled={submitting} className="flex-1 bg-marigold text-marigold-dark rounded-full px-5 py-3 font-extrabold hover:opacity-90 disabled:opacity-50 transition">Scan with camera</button> : <button type="button" onClick={stopCamera} className="flex-1 border border-white/10 text-ivory rounded-full px-5 py-3 font-semibold hover:bg-white/5 transition">Stop camera</button>}
            </div>

            {cameraError && <p className="mt-3 text-hibiscus text-sm">{cameraError}</p>}

            <div className="flex items-center gap-3 my-6 text-xs text-muted uppercase tracking-[0.18em]"><span className="h-px bg-white/10 flex-1" /><span>or enter token</span><span className="h-px bg-white/10 flex-1" /></div>

            <form onSubmit={handleSubmit}>
              <label className="field-label" htmlFor="ticket-token">Ticket QR token</label>
              <textarea id="ticket-token" value={token} onChange={(event) => setToken(event.target.value)} required rows={4} placeholder="Paste scanner output here" className="w-full rounded-lg bg-ink border border-white/10 p-3 text-sm text-ivory focus:outline-none focus:border-marigold" />
              <button type="submit" disabled={submitting || !token.trim()} className="w-full mt-4 border border-white/10 text-ivory rounded-full px-6 py-3 font-semibold hover:bg-white/5 disabled:opacity-50 transition">{submitting ? "Checking ticket..." : "Admit guest"}</button>
            </form>
          </section>

          {result && currentResult && (
            <section aria-live="assertive" className={`mt-5 rounded-card border p-6 text-center ${result.type === "success" ? "border-marigold/50 bg-marigold/10" : result.type === "checking" ? "border-white/10 bg-surface" : "border-hibiscus/50 bg-hibiscus/10"}`}>
              <p className={`text-xs font-bold tracking-[0.2em] ${result.type === "success" ? "text-marigold" : result.type === "checking" ? "text-muted" : "text-hibiscus"}`}>{currentResult.action}</p>
              <h2 className={`font-display text-3xl mt-2 ${result.type === "success" ? "text-marigold" : result.type === "checking" ? "text-ivory" : "text-hibiscus"}`}>{currentResult.title}</h2>
              <p className="mt-3 text-sm text-ivory/90">{result.message}</p>
              {result.ticket && <p className="text-muted text-sm mt-3">{result.ticket.user?.name || "Guest"} · {result.ticket.event?.title || "Event"} · {result.ticket.quantity} ticket(s)</p>}
              {result.type !== "checking" && <button type="button" onClick={() => { setResult(null); setCameraError(""); }} className="mt-5 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold hover:bg-white/5 transition">Scan next ticket</button>}
            </section>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
