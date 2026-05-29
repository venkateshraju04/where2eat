import { useState, useEffect } from 'react';
import type { Restaurant } from '@/data/restaurants';

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
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setState((s) => ({ ...s, loading: false, error: 'Geolocation not supported' }));
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
          error: error.message || 'Permission denied',
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      }
    );
  }, []);

  return state;
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

// Fetch real driving distances using OSRM Table API
export async function getRealDistances(originLat: number, originLng: number, restaurants: Restaurant[]): Promise<Record<string, number>> {
  try {
    if (!restaurants.length) return {};
    
    // OSRM expects: {lng},{lat}
    const coords = [`${originLng},${originLat}`];
    restaurants.forEach(r => coords.push(`${r.lng},${r.lat}`));
    
    // Construct URL with sources=0 (only compute from origin to destinations)
    // and annotations=distance (we want distance in meters, not duration)
    const url = `https://router.project-osrm.org/table/v1/driving/${coords.join(';')}?sources=0&annotations=distance`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('OSRM API failed');
    
    const data = await res.json();
    if (!data.distances || !data.distances[0]) throw new Error('Invalid OSRM response');
    
    const distanceMap: Record<string, number> = {};
    const distances = data.distances[0]; // array of distances from source to each coord (including self)
    
    // distances[0] is source to source (0)
    // distances[1] is source to r1
    restaurants.forEach((r, i) => {
      const distMeters = distances[i + 1];
      if (typeof distMeters === 'number') {
        distanceMap[r.id] = distMeters / 1000; // Convert to km
      }
    });
    
    return distanceMap;
  } catch (err) {
    console.error("Failed to fetch real distances, falling back to Haversine", err);
    return {};
  }
}
