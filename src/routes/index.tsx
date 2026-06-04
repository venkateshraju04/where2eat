import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { RestaurantCard, RestaurantSkeleton } from "@/components/RestaurantCard";
import { FilterPanel } from "@/components/MoodFilters";
import { RandomPicker } from "@/components/RandomPicker";
import { PRICE_MIN, PRICE_MAX, type Mood, type Area, type Restaurant } from "@/data/restaurants";
import { getRestaurants } from "@/api/restaurants";
import { useLocation, getDistance, getRealDistances } from "@/hooks/use-location";

export const Route = createFileRoute("/")({
  loader: () => getRestaurants(),
  head: () => ({
    meta: [
      { title: "SpinBite — Can't decide where to eat?" },
      { name: "description", content: "Spin and discover your next food spot in Bangalore." },
      { property: "og:title", content: "SpinBite — Can't decide where to eat?" },
      {
        property: "og:description",
        content: "Spin and discover your next food spot in Bangalore.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const initialRestaurants = Route.useLoaderData();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const { lat, lng, loading: locLoading, error: locError, requestLocation } = useLocation();
  const [realDistances, setRealDistances] = useState<Record<string, number>>({});

  useEffect(() => {
    if (lat !== null && lng !== null && initialRestaurants.length > 0) {
      getRealDistances(lat, lng, initialRestaurants).then(setRealDistances);
    }
  }, [lat, lng, initialRestaurants]);

  const toggleMood = (m: Mood) =>
    setMoods((s) => (s.includes(m) ? s.filter((x) => x !== m) : [...s, m]));

  const toggleArea = (a: Area) =>
    setAreas((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]));

  const clearFilters = () => {
    setMoods([]);
    setAreas([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
  };

  const isPriceChanged = priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX;
  const activeFilterCount = moods.length + areas.length + (isPriceChanged ? 1 : 0);

  const filteredAndSorted = useMemo(() => {
    let results = initialRestaurants;

    if (areas.length) {
      results = results.filter((r) => areas.includes(r.area));
    }

    if (moods.length) {
      results = results.filter((r) => moods.every((m) => r.moods.includes(m as any)));
    }

    results = results.filter((r) => r.price >= priceRange[0] && r.price <= priceRange[1]);

    // Calculate distance and sort if location is available
    if (lat !== null && lng !== null) {
      return results
        .map((r) => {
          // Use real driving distance if available, fallback to Haversine straight-line
          const dist =
            realDistances[r.id] !== undefined
              ? realDistances[r.id]
              : getDistance(lat, lng, r.lat, r.lng);
          return { ...r, calculatedDistance: dist };
        })
        .sort((a, b) => a.calculatedDistance - b.calculatedDistance);
    }

    return results;
  }, [initialRestaurants, moods, areas, priceRange, lat, lng, realDistances]);

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
            Can't decide
            <br />
            <span className="gradient-text">where to eat?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-5 max-w-lg text-base text-muted-foreground sm:text-lg"
          >
            Spin and discover your next food spot in Bangalore.
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
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Bangalore spots</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredAndSorted.length} {filteredAndSorted.length === 1 ? "place" : "places"}{" "}
              matching filters
            </p>
          </div>
          {lat === null && (
            <div className="flex flex-col items-start sm:items-end gap-1">
              <button
                onClick={requestLocation}
                disabled={locLoading}
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-smooth disabled:opacity-50"
              >
                {locLoading ? "Locating..." : "📍 Sort by distance"}
              </button>
              {locError && <span className="text-xs text-destructive">{locError}</span>}
            </div>
          )}
        </div>

        <div className="mb-8">
          <FilterPanel
            activeMoods={moods}
            onToggleMood={toggleMood}
            activeAreas={areas}
            onToggleArea={toggleArea}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            onClear={clearFilters}
            activeCount={activeFilterCount}
          />
        </div>

        {filteredAndSorted.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/40 p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <Sparkles className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No spots match those filters</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your filters or let us pick for you.
            </p>
            <button
              onClick={clearFilters}
              className="mt-5 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSorted.map((r, i) => (
              <RestaurantCard
                key={r.id}
                r={r as Restaurant}
                distance={(r as any).calculatedDistance}
                index={i}
              />
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
        pool={filteredAndSorted.length ? (filteredAndSorted as Restaurant[]) : initialRestaurants}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}
