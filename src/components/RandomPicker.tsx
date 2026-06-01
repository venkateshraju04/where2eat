import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, Star, RotateCcw, Navigation } from "lucide-react";
import type { Restaurant } from "@/data/restaurants";
import { useLocation, getDistance } from "@/hooks/use-location";

export function RandomPicker({
  open,
  pool,
  onClose,
}: {
  open: boolean;
  pool: Restaurant[];
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"spin" | "reveal">("spin");
  const [current, setCurrent] = useState<Restaurant | null>(null);
  const [picked, setPicked] = useState<Restaurant | null>(null);
  const { lat, lng } = useLocation();

  const spin = () => {
    if (!pool.length) return;
    setPhase("spin");
    setPicked(null);
    let i = 0;
    const total = 28;
    const tick = () => {
      i++;
      setCurrent(pool[Math.floor(Math.random() * pool.length)]);
      // Easing: start fast, slow down
      const delay = 60 + Math.pow(i / total, 2.4) * 320;
      if (i < total) {
        setTimeout(tick, delay);
      } else {
        const final = pool[Math.floor(Math.random() * pool.length)];
        setCurrent(final);
        setPicked(final);
        setPhase("reveal");
      }
    };
    tick();
  };

  useEffect(() => {
    if (open) spin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  
  const getDistStr = (r: Restaurant & { calculatedDistance?: number }) => {
    if (r.calculatedDistance !== undefined) {
      return `${r.calculatedDistance.toFixed(1)} km`;
    }
    if (lat && lng) {
      return `${getDistance(lat, lng, r.lat, r.lng).toFixed(1)} km`;
    }
    return r.area;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-xl"
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full glass p-2.5 transition-smooth hover:scale-110"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {phase === "spin" && current && (
                <motion.div
                  key={"spin-" + current.id}
                  initial={{ opacity: 0, scale: 0.92, rotateX: -12 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4 text-center"
                >
                  <p className="text-sm uppercase tracking-[0.3em] text-primary animate-pulse-glow inline-block rounded-full px-4 py-2">
                    Spinning…
                  </p>
                  <div className="relative overflow-hidden rounded-3xl shadow-glow">
                    <img
                      src={current.image_url}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="aspect-[4/3] w-full object-cover blur-[2px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-left">
                      <h3 className="text-2xl font-bold">{current.name}</h3>
                      <p className="text-sm text-primary">{current.cuisine}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {phase === "reveal" && picked && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  className="space-y-5"
                >
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-center text-sm uppercase tracking-[0.3em] gradient-text font-bold"
                  >
                    Tonight you eat at…
                  </motion.p>
                  <motion.div
                    initial={{ rotateY: 90 }}
                    animate={{ rotateY: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden rounded-3xl bg-gradient-card shadow-glow"
                  >
                    <div className="relative aspect-[4/3]">
                      <img src={picked.image_url} alt={picked.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full glass px-3 py-1.5 text-sm font-semibold">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        {picked.rating || "New"}
                      </div>
                    </div>
                    <div className="space-y-4 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-3xl font-bold leading-tight">{picked.name}</h2>
                          <p className="mt-1 text-sm uppercase tracking-wider text-primary">{picked.cuisine}</p>
                        </div>
                        <div className="text-xs font-medium bg-secondary/50 px-2 py-1 rounded-md shrink-0">
                          ₹{picked.price}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{picked.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {picked.vibes.map((v) => (
                          <span key={v} className="rounded-full bg-secondary px-3 py-1 text-xs">
                            {v}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {getDistStr(picked)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={picked.google_maps_url || `https://www.google.com/maps/search/${encodeURIComponent(picked.name + " " + picked.area)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth hover:shadow-glow"
                        >
                          <Navigation className="h-4 w-4" /> Directions
                        </a>
                        <button
                          onClick={spin}
                          className="flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold transition-smooth hover:border-primary hover:text-primary"
                        >
                          <RotateCcw className="h-4 w-4" /> Spin Again
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

