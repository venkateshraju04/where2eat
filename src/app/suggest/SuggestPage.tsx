"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MOODS, AREAS, type Mood, type Area } from "@/data/restaurants";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SuggestPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    area: "" as Area | "",
    price: "",
    description: "",
    google_maps_url: "",
    submitter_name: "",
  });
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);

  const toggleMood = (m: Mood) =>
    setSelectedMoods((s) => (s.includes(m) ? s.filter((x) => x !== m) : [...s, m]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price) || null,
          suggested_moods: selectedMoods,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-2xl px-5 py-12">
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-border bg-card p-12 text-center shadow-card"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Thanks for the suggestion!</h2>
            <p className="mt-2 text-muted-foreground">
              We&apos;ll review it and add it to Where2Eat soon.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  name: "",
                  cuisine: "",
                  area: "",
                  price: "",
                  description: "",
                  google_maps_url: "",
                  submitter_name: "",
                });
                setSelectedMoods([]);
              }}
              className="mt-8 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium transition-smooth hover:border-primary"
            >
              Submit another
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Suggest a Spot</h1>
              <p className="mt-2 text-muted-foreground">
                Know a hidden gem in Bangalore? Help us grow the list!
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-card"
            >
              {error && (
                <div className="rounded-xl bg-destructive/15 p-4 text-sm text-destructive-foreground">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Restaurant Name *
                </label>
                <input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. Truffles"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="cuisine" className="text-sm font-medium">
                    Cuisine
                  </label>
                  <input
                    id="cuisine"
                    value={formData.cuisine}
                    onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Burgers, Italian"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="area" className="text-sm font-medium">
                    Area *
                  </label>
                  <select
                    id="area"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value as Area })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="" disabled>
                      Select an area
                    </option>
                    {AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Approx Price for Two (₹)
                </label>
                <input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="e.g. 500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Why do you recommend it?
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Best pesto pasta in town..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Vibe &amp; Mood Tags</label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => {
                    const isActive = selectedMoods.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleMood(m)}
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-smooth ${
                          isActive
                            ? "border-transparent bg-gradient-primary text-primary-foreground shadow-soft"
                            : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="gmaps" className="text-sm font-medium">
                  Google Maps Link
                </label>
                <input
                  id="gmaps"
                  type="url"
                  value={formData.google_maps_url}
                  onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="https://maps.app.goo.gl/..."
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <label htmlFor="submitter" className="text-sm font-medium">
                  Your Name / Instagram (Optional)
                </label>
                <input
                  id="submitter"
                  value={formData.submitter_name}
                  onChange={(e) => setFormData({ ...formData, submitter_name: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="So we can credit you!"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Submit Suggestion
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
