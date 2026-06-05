import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = typeof window !== "undefined" ? L.divIcon({
  html: `
    <div class="relative flex h-6 w-6 items-center justify-center">
      <div class="absolute h-6 w-6 animate-ping rounded-full bg-primary opacity-60" style="animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; background-color: oklch(0.72 0.19 45);"></div>
      <div class="relative h-3 w-3 rounded-full bg-primary border-2 border-white shadow-glow" style="background-color: oklch(0.72 0.19 45); box-shadow: 0 0 8px oklch(0.72 0.19 45);"></div>
    </div>
  `,
  className: "custom-div-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
}) : null;

interface AnalyticsMapProps {
  adminUser: string;
  adminPass: string;
}

// Helper component to adjust map bounds dynamically to fit all active markers
function ChangeView({ markers }: { markers: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const validPoints = markers
        .map((m) => {
          const lat = typeof m.lat === "string" ? parseFloat(m.lat) : m.lat;
          const lng = typeof m.lng === "string" ? parseFloat(m.lng) : m.lng;
          return { lat, lng };
        })
        .filter((p) => !isNaN(p.lat) && !isNaN(p.lng) && p.lat !== null && p.lng !== null);

      if (validPoints.length > 0) {
        console.log("Fitting map bounds to points:", validPoints);
        const bounds = L.latLngBounds(validPoints.map((p) => [p.lat, p.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [markers, map]);
  return null;
}

export function AnalyticsMap({ adminUser, adminPass }: AnalyticsMapProps) {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    console.log("Fetching map analytics...");
    
    fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getAnalytics",
        adminUser,
        adminPass,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.error || "Failed to load analytics");
          });
        }
        return res.json();
      })
      .then((data) => {
        if (mounted) {
          console.log("Analytics locations successfully fetched:", data);
          setLocations(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error("Error loading analytics locations:", err);
          setError(err.message || "Failed to load analytics");
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [adminUser, adminPass]);

  if (loading) {
    return <div className="text-center py-20 text-muted-foreground animate-pulse">Loading map...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-500/10 text-red-500 rounded-xl mb-6">{error}</div>;
  }

  // Default center to Bangalore since that's where the app focuses
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5 shadow-card">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Total Requests Tracked
          </h3>
          <p className="text-3xl font-bold gradient-text">{locations.length}</p>
        </div>
        <div className="glass rounded-2xl p-5 shadow-card">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Unique IPs
          </h3>
          <p className="text-3xl font-bold gradient-text">
            {new Set(locations.map((l) => l.ip_address).filter(Boolean)).size}
          </p>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden shadow-card border border-border h-[500px]">
        {/* Only render map if window is defined to avoid SSR issues if any */}
        {typeof window !== "undefined" && (
          <MapContainer center={defaultCenter} zoom={11} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeView markers={locations} />
            {locations.map((loc) => {
              const latVal = typeof loc.lat === "string" ? parseFloat(loc.lat) : loc.lat;
              const lngVal = typeof loc.lng === "string" ? parseFloat(loc.lng) : loc.lng;
              if (isNaN(latVal) || isNaN(lngVal) || latVal === null || lngVal === null) return null;
              
              return (
                <Marker key={loc.id} position={[latVal, lngVal]} icon={customIcon || undefined}>
                  <Popup>
                    <div className="text-sm text-foreground">
                      <strong>IP:</strong> {loc.ip_address || "Unknown"}
                      <br />
                      <strong>Time:</strong> {new Date(loc.created_at).toLocaleString()}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
