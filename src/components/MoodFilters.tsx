import { MOODS, PRICE_MIN, PRICE_MAX, type Mood } from "@/data/restaurants";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";

interface FilterPanelProps {
  activeMoods: Mood[];
  onToggleMood: (m: Mood) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  onClear: () => void;
  activeCount: number;
}

export function FilterPanel({
  activeMoods,
  onToggleMood,
  priceRange,
  onPriceChange,
  onClear,
  activeCount,
}: FilterPanelProps) {
  const isPriceChanged = priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="group relative inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-smooth hover:border-primary/40 hover:text-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-primary px-1.5 text-xs font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-80 rounded-2xl border-border bg-card p-0 shadow-glow"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold">Filters</h3>
          {activeCount > 0 && (
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1 text-xs text-primary transition-smooth hover:text-primary/80"
            >
              <X className="h-3 w-3" />
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-5 p-5">
          {/* Categories */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Categories
            </p>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => {
                const isActive = activeMoods.includes(m);
                return (
                  <motion.button
                    key={m}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => onToggleMood(m)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-smooth ${
                      isActive
                        ? "border-transparent bg-gradient-primary text-primary-foreground shadow-soft"
                        : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {m}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Price Range
              </p>
              {isPriceChanged && (
                <button
                  onClick={() => onPriceChange([PRICE_MIN, PRICE_MAX])}
                  className="text-xs text-primary transition-smooth hover:text-primary/80"
                >
                  Reset
                </button>
              )}
            </div>
            <Slider
              value={priceRange}
              onValueChange={(v) => onPriceChange(v as [number, number])}
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={50}
              className="mb-3"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="rounded-lg bg-secondary/50 px-2.5 py-1 font-medium">
                ₹{priceRange[0]}
              </span>
              <span className="text-border">—</span>
              <span className="rounded-lg bg-secondary/50 px-2.5 py-1 font-medium">
                ₹{priceRange[1]}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
