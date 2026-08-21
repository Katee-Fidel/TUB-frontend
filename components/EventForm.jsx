"use client";

import { useState } from "react";

const EMPTY_EVENT = {
  title: "",
  description: "",
  venue: "",
  date: "",
  ticketPrice: "",
  totalTickets: "",
  status: "draft",
};

export default function EventForm({ initialValues, onSubmit, submitLabel = "Save event" }) {
  const [form, setForm] = useState({ ...EMPTY_EVENT, ...initialValues });
  const [bannerFile, setBannerFile] = useState(null);
  const [preview, setPreview] = useState(initialValues?.bannerUrl || null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.venue || !form.date || form.ticketPrice === "" || form.totalTickets === "") {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(form, bannerFile);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label className="field-label">Title</label>
        <input name="title" placeholder="" value={form.title} onChange={handleChange} required  className="!text-black"/>
      </div>

      <div className="field">
        <label className="field-label">Description</label>
        <textarea name="description" placeholder="What should fans expect?" value={form.description} onChange={handleChange} rows={4} required />
      </div>

      <div className="field">
        <label className="field-label">Venue</label>
        <input name="venue" placeholder="" value={form.venue} onChange={handleChange} required className="!text-black"/>
      </div>

      <div className="field">
        <label className="field-label">Date & time</label>
        <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="field">
          <label className="field-label">Ticket price (KES)</label>
          <input type="number" name="ticketPrice" min="0" placeholder="1500" value={form.ticketPrice} onChange={handleChange} required />
        </div>
        <div className="field">
          <label className="field-label">Total tickets</label>
          <input type="number" name="totalTickets" min="1" placeholder="200" value={form.totalTickets} onChange={handleChange} required />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Status</label>
        <div className="flex gap-2">
          <label
            className={`flex-1 text-center py-2.5 rounded-full text-sm font-semibold cursor-pointer border transition ${
              form.status === "draft" ? "bg-marigold text-marigold-dark border-marigold" : "border-white/10 text-muted"
            }`}
          >
            <input type="radio" name="status" value="draft" checked={form.status === "draft"} onChange={handleChange} className="hidden" />
            Draft
          </label>
          <label
            className={`flex-1 text-center py-2.5 rounded-full text-sm font-semibold cursor-pointer border transition ${
              form.status === "published" ? "bg-marigold text-marigold-dark border-marigold" : "border-white/10 text-muted"
            }`}
          >
            <input type="radio" name="status" value="published" checked={form.status === "published"} onChange={handleChange} className="hidden" />
            Published
          </label>
        </div>
        <p className="text-muted text-xs mt-2">
          {form.status === "draft" ? "Only visible to you until you publish." : "Visible to fans in event discovery."}
        </p>
      </div>

      <div className="field">
        <label className="field-label">Event banner</label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/5 file:text-ivory file:font-semibold file:text-sm hover:file:bg-white/10"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Banner preview" className="mt-3 w-full max-w-xs rounded-lg border border-white/10" />
        )}
      </div>

      {error && <p className="text-hibiscus text-sm mb-4">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-marigold text-marigold-dark rounded-full py-3 font-extrabold hover:opacity-90 disabled:opacity-50 transition"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}