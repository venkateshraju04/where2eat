import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import type { Restaurant } from "@/data/restaurants";

export function RestaurantCard({ r, index = 0 }: { r: Restaurant; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-3xl bg-gradient-card shadow-card transition-smooth hover:shadow-glow"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={r.image}
          alt={r.name}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition-smooth group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs font-semibold">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {r.rating}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full glass px-2.5 py-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {r.distance}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-lg font-bold leading-tight">{r.name}</h3>
          <p className="text-xs uppercase tracking-wider text-primary">{r.cuisine}</p>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {r.vibes.map((v) => (
            <span key={v} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
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
    <div className="overflow-hidden rounded-3xl bg-gradient-card shadow-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-muted" />
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-muted" />
        <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
        <div className="flex gap-2">
          <div className="h-6 w-14 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-14 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
