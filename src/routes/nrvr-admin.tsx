import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Shield, RefreshCw } from "lucide-react";
import { getPendingSuggestions, approveSuggestion, rejectSuggestion } from "@/api/admin";

export const Route = createFileRoute("/nrvr-admin")({
  head: () => ({
    meta: [
      { title: "Curator Deck" },
      { name: "robots", content: "noindex, nofollow" }, // Prevents search engines from indexing this secret route
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [approveModal, setApproveModal] = useState<any>(null);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [vibes, setVibes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Check session storage on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem("adminUser");
    const savedPass = sessionStorage.getItem("adminPass");
    if (savedUser && savedPass) {
      setAdminUser(savedUser);
      setAdminPass(savedPass);
      setIsLoggedIn(true);
    }
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPendingSuggestions({ data: { adminUser, adminPass } });
      setSuggestions(data);
    } catch (err: any) {
      setError(err.message || "Failed to load");
      if (err.message === "Unauthorized") {
        setIsLoggedIn(false);
        sessionStorage.clear();
        setAdminUser("");
        setAdminPass("");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchSuggestions();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser || !adminPass) return;
    sessionStorage.setItem("adminUser", adminUser);
    sessionStorage.setItem("adminPass", adminPass);
    setIsLoggedIn(true);
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this suggestion?")) return;
    setActionLoading(true);
    try {
      await rejectSuggestion({ data: { adminUser, adminPass, id } });
      setSuggestions((s) => s.filter((x) => x.id !== id));
    } catch (err: any) {
      alert("Failed to reject: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lat || !lng) return alert("Latitude and Longitude are required.");

    setActionLoading(true);
    try {
      await approveSuggestion({
        data: {
          adminUser,
          adminPass,
          id: approveModal.id,
          lat,
          lng,
          vibes,
          imageUrl,
        },
      });
      setSuggestions((s) => s.filter((x) => x.id !== approveModal.id));
      setApproveModal(null);
      setLat("");
      setLng("");
      setVibes("");
      setImageUrl("");
    } catch (err: any) {
      alert("Failed to approve: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-5">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleLogin}
          className="w-full max-w-sm glass rounded-3xl p-8 space-y-6 shadow-card"
        >
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Curator Access</h1>
            <p className="text-sm text-muted-foreground mt-1">Authorized personnel only</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Admin ID</label>
              <input
                type="text"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                className="w-full rounded-xl bg-background/50 border border-border px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-smooth"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Passcode</label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full rounded-xl bg-background/50 border border-border px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-smooth"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-primary text-primary-foreground py-3 font-semibold shadow-glow hover:scale-[1.02] transition-smooth"
          >
            Enter
          </button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="glass sticky top-0 z-30 border-b border-border/50">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Shield className="w-5 h-5" /> Curator Deck
          </div>
          <button
            onClick={() => {
              sessionStorage.clear();
              setIsLoggedIn(false);
              setAdminUser("");
              setAdminPass("");
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
          >
            Lock
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 pt-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold">Pending Suggestions</h1>
            <p className="text-muted-foreground mt-1">Review community submissions</p>
          </div>
          <button
            onClick={fetchSuggestions}
            className="p-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-smooth"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-xl mb-6">{error}</div>}

        {loading && !suggestions.length ? (
          <div className="text-center py-20 text-muted-foreground animate-pulse">Loading...</div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl border border-dashed border-border">
            <Check className="w-10 h-10 text-primary mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm text-muted-foreground mt-1">No pending suggestions.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {suggestions.map((s) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl p-5 shadow-card flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold">{s.name}</h3>
                    <p className="text-primary text-sm font-medium">
                      {s.cuisine} • {s.area}
                    </p>
                  </div>
                  <div className="bg-secondary px-2 py-1 rounded-md text-xs font-semibold">
                    ₹{s.price}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex-1 mb-4">{s.description}</p>
                <div className="text-xs text-muted-foreground mb-4">
                  <strong>Suggested by:</strong> {s.submitter_name || "Anonymous"}
                  <br />
                  <strong>Moods:</strong> {s.suggested_moods?.join(", ") || "None"}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button
                    onClick={() => handleReject(s.id)}
                    disabled={actionLoading}
                    className="flex justify-center items-center gap-1.5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-red-500/10 hover:text-red-500 transition-smooth"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                  <button
                    onClick={() => setApproveModal(s)}
                    disabled={actionLoading}
                    className="flex justify-center items-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:scale-[1.02] shadow-glow transition-smooth"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Approve Modal */}
      <AnimatePresence>
        {approveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setApproveModal(null)}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-secondary transition-smooth"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              <h2 className="text-2xl font-bold mb-1">Finalize Data</h2>
              <p className="text-sm text-muted-foreground mb-6">
                You are approving <strong>{approveModal.name}</strong>.
              </p>

              <form onSubmit={handleApproveSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      placeholder="e.g. 12.9716"
                      className="w-full rounded-xl bg-secondary/50 border border-border px-3 py-2 text-sm outline-none focus:border-primary transition-smooth"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      placeholder="e.g. 77.5946"
                      className="w-full rounded-xl bg-secondary/50 border border-border px-3 py-2 text-sm outline-none focus:border-primary transition-smooth"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground -mt-2">
                  Grab these from Google Maps URL.
                </p>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    Vibes (Optional)
                  </label>
                  <input
                    type="text"
                    value={vibes}
                    onChange={(e) => setVibes(e.target.value)}
                    placeholder="e.g. Cozy, Date Night, Loud"
                    className="w-full rounded-xl bg-secondary/50 border border-border px-3 py-2 text-sm outline-none focus:border-primary transition-smooth"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Comma separated visual tags.</p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="e.g. https://..."
                    className="w-full rounded-xl bg-secondary/50 border border-border px-3 py-2 text-sm outline-none focus:border-primary transition-smooth"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Right-click a photo on Google Maps &gt; "Copy Image Address".
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full rounded-xl bg-gradient-primary text-primary-foreground py-3 font-semibold shadow-glow hover:scale-[1.02] transition-smooth disabled:opacity-50"
                  >
                    {actionLoading ? "Publishing..." : "Publish to Live"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
