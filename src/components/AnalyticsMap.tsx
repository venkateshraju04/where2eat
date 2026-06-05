import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const defaultIcon = typeof window !== "undefined" ? L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
}) : null;

interface AnalyticsMapProps {
  adminUser: string;
  adminPass: string;
}

export function AnalyticsMap({ adminUser, adminPass }: AnalyticsMapProps) {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    let mounted = true;
    
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
          setLocations(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
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
            {locations.map((loc) => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={defaultIcon || undefined}>
                <Popup>
                  <div className="text-sm">
                    <strong>IP:</strong> {loc.ip_address || "Unknown"}
                    <br />
                    <strong>Time:</strong> {new Date(loc.created_at).toLocaleString()}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
