import { Link } from "@tanstack/react-router";

export function Navbar({ onPick }: { onPick?: () => void }) {
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">SpinBite</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/suggest"
            className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-smooth hover:text-foreground sm:px-4"
          >
            Suggest a Spot
          </Link>
          <Link
            to="/#explore"
            className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-smooth hover:text-foreground sm:px-4 hidden sm:inline-flex"
          >
            Explore
          </Link>
          {onPick && (
            <button
              onClick={onPick}
              className="rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth hover:scale-105 hover:shadow-glow sm:px-5"
            >
              Random Pick
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

