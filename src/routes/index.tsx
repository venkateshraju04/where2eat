import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { RestaurantCard, RestaurantSkeleton } from "@/components/RestaurantCard";
import { FilterPanel } from "@/components/MoodFilters";
import { RandomPicker } from "@/components/RandomPicker";
import { RESTAURANTS, PRICE_MIN, PRICE_MAX, type Mood } from "@/data/restaurants";

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      { title: "SpinBite — Can't decide where to eat?" },
      { name: "description", content: "Spin and discover your next food spot. A playful random picker for nearby restaurants and cafes." },
      { property: "og:title", content: "SpinBite — Can't decide where to eat?" },
      { property: "og:description", content: "Spin and discover your next food spot." },
    ],
  }),
  component: Home,
});

function Home() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading] = useState(false);

  const toggleMood = (m: Mood) =>
    setMoods((s) => (s.includes(m) ? s.filter((x) => x !== m) : [...s, m]));

  const clearFilters = () => {
    setMoods([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
  };

  const isPriceChanged = priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX;
  const activeFilterCount = moods.length + (isPriceChanged ? 1 : 0);

  const filtered = useMemo(() => {
    let results = RESTAURANTS;
    if (moods.length) {
      results = results.filter((r) => moods.every((m) => r.moods.includes(m)));
    }
    results = results.filter((r) => r.price >= priceRange[0] && r.price <= priceRange[1]);
    return results;
  }, [moods, priceRange]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar onPick={() => setPickerOpen(true)} />

      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl"
          >
            Can't decide<br />
            <span className="gradient-text">where to eat?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-5 max-w-lg text-base text-muted-foreground sm:text-lg"
          >
            Spin and discover your next food spot.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <button
              onClick={() => setPickerOpen(true)}
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-105 animate-pulse-glow"
            >
              Pick For Me
            </button>
            <a
              href="#explore"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-6 py-4 text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
            >
              Browse spots <ArrowDown className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Explore */}
      <section id="explore" className="mx-auto max-w-6xl px-5 pb-32">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Nearby spots</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "place" : "places"} around you
            </p>
          </div>
        </div>

        <div className="mb-8">
          <FilterPanel
            activeMoods={moods}
            onToggleMood={toggleMood}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            onClear={clearFilters}
            activeCount={activeFilterCount}
          />
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <RestaurantSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <Sparkles className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No spots match those filters</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or let us pick for you.</p>
            <button
              onClick={clearFilters}
              className="mt-5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r, i) => (
              <RestaurantCard key={r.id} r={r} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Mobile sticky pick button */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center p-5 sm:hidden">
        <button
          onClick={() => setPickerOpen(true)}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow animate-pulse-glow"
        >
          Pick For Me
        </button>
      </div>

      <RandomPicker
        open={pickerOpen}
        pool={filtered.length ? filtered : RESTAURANTS}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}
