import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Navbar({ onPick }: { onPick: () => void }) {
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">SpinBite</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href="#explore"
            className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-smooth hover:text-foreground sm:px-4"
          >
            Explore
          </a>
          <button
            onClick={onPick}
            className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth hover:scale-105 hover:shadow-glow sm:px-5"
          >
            Random Pick
          </button>
        </nav>
      </div>
    </header>
  );
}
