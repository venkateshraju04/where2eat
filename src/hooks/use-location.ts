import { useState, useEffect } from "react";
import type { Restaurant } from "@/data/restaurants";

interface LocationState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    lat: null,
    lng: null,
    loading: false,
    error: null,
  });

  const requestLocation = () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    if (!("geolocation" in navigator)) {
      setState((s) => ({ ...s, loading: false, error: "Geolocation not supported" }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState((s) => ({
          ...s,
          loading: false,
          error: error.message || "Permission denied",
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  };

  return { ...state, requestLocation };
}

// Keep Haversine as an instant fallback
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Cache distances to avoid recalculating when navigating back and forth
let distanceCache: { origin: string; distances: Record<string, number>; timestamp: number } | null =
  null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Fetch real driving distances using OSRM Table API
export async function getRealDistances(
  originLat: number,
  originLng: number,
  restaurants: Restaurant[],
): Promise<Record<string, number>> {
  try {
    if (!restaurants.length) return {};

    // Check cache first based on origin and TTL
    const originKey = `${originLat.toFixed(3)},${originLng.toFixed(3)}`; // rough location (~100m precision)
    if (
      distanceCache &&
      distanceCache.origin === originKey &&
      Date.now() - distanceCache.timestamp < CACHE_TTL_MS
    ) {
      return distanceCache.distances;
    }

    // 1. Calculate Haversine distance for ALL restaurants as default fallback
    const haversineList = restaurants.map((r) => ({
      id: r.id,
      lat: r.lat,
      lng: r.lng,
      havDist: getDistance(originLat, originLng, r.lat, r.lng),
    }));

    // Create a base map with all Haversine distances
    const distanceMap: Record<string, number> = {};
    haversineList.forEach((item) => {
      distanceMap[item.id] = item.havDist;
    });

    // 2. Sort by Haversine distance and slice the top 20
    const sortedHavList = [...haversineList].sort((a, b) => a.havDist - b.havDist);
    const top20 = sortedHavList.slice(0, 20);

    // 3. Query OSRM ONLY for the top 20 closest to prevent coordinate/payload size failures
    if (top20.length > 0) {
      // OSRM expects: {lng},{lat}
      const coords = [`${originLng},${originLat}`];
      top20.forEach((item) => coords.push(`${item.lng},${item.lat}`));

      // Construct URL with sources=0 (only compute from origin to destinations)
      // and annotations=distance (we want distance in meters, not duration)
      const url = `https://router.project-osrm.org/table/v1/driving/${coords.join(";")}?sources=0&annotations=distance`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.distances && data.distances[0]) {
          const distances = data.distances[0]; // array of distances from source to each coord (including self)
          top20.forEach((item, i) => {
            const distMeters = distances[i + 1];
            if (typeof distMeters === "number") {
              distanceMap[item.id] = distMeters / 1000; // Overwrite with real driving distance (km)
            }
          });
        }
      } else {
        console.warn("OSRM Table API failed, using Haversine distances as fallback");
      }
    }

    // Save to cache
    distanceCache = {
      origin: originKey,
      distances: distanceMap,
      timestamp: Date.now(),
    };

    return distanceMap;
  } catch (err) {
    console.error("Failed to fetch real distances, falling back entirely to Haversine", err);
    // Ultimate fallback
    const fallbackMap: Record<string, number> = {};
    restaurants.forEach((r) => {
      fallbackMap[r.id] = getDistance(originLat, originLng, r.lat, r.lng);
    });
    return fallbackMap;
  }
}
