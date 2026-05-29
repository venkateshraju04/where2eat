import { motion } from "framer-motion";
import { Star, MapPin, Navigation } from "lucide-react";
import type { Restaurant } from "@/data/restaurants";

export function RestaurantCard({ r, distance, index = 0 }: { r: Restaurant; distance?: number; index?: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ layout: { type: "spring", stiffness: 300, damping: 30 }, duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-3xl bg-gradient-card shadow-card transition-smooth hover:shadow-glow flex flex-col relative"
    >
      <a 
        href={r.google_maps_url || `https://www.google.com/maps/search/${encodeURIComponent(r.name + " " + r.area)}`} 
        target="_blank" 
        rel="noreferrer"
        className="absolute inset-0 z-10"
        aria-label={`Open ${r.name} in Google Maps`}
      />
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={r.image_url}
          alt={r.name}
          loading="lazy"
          className="h-full w-full object-cover transition-smooth group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs font-semibold z-20">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {r.rating || "New"}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs text-muted-foreground z-20">
          <MapPin className="h-3 w-3" />
          {distance !== undefined ? `${distance.toFixed(1)} km` : r.area}
        </div>
        <div className="absolute bottom-3 right-3 flex items-center justify-center rounded-full glass p-1.5 text-primary opacity-0 transition-opacity group-hover:opacity-100 z-20">
          <Navigation className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="space-y-3 p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="text-lg font-bold leading-tight">{r.name}</h3>
            <p className="text-xs uppercase tracking-wider text-primary">{r.cuisine}</p>
          </div>
          <div className="text-xs font-medium bg-secondary/50 px-2 py-1 rounded-md shrink-0">
            ₹{r.price} for two
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground flex-1">{r.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {r.vibes.slice(0, 3).map((v) => (
            <span key={v} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground z-20">
              {v}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function RestaurantSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-card shadow-card flex flex-col h-full">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-5 flex-1 flex flex-col">
        <div className="flex justify-between">
          <div className="h-5 w-1/2 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-1/4 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-muted" />
        <div className="space-y-2 mt-2">
          <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="flex gap-2 mt-auto pt-4">
          <div className="h-6 w-14 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-14 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
