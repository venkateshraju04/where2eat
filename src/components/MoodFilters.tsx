import { MOODS, type Mood } from "@/data/restaurants";
import { motion } from "framer-motion";

export function MoodFilters({
  active,
  onToggle,
}: {
  active: Mood[];
  onToggle: (m: Mood) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
      {MOODS.map((m) => {
        const isActive = active.includes(m);
        return (
          <motion.button
            key={m}
            whileTap={{ scale: 0.94 }}
            onClick={() => onToggle(m)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-smooth ${
              isActive
                ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {m}
          </motion.button>
        );
      })}
    </div>
  );
}
