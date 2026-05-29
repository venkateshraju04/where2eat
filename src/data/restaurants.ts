export type Mood = "Cheap" | "Cafe" | "Dessert" | "Spicy" | "Street Food" | "Aesthetic" | "Late Night";
export type Area = "Koramangala" | "Indiranagar" | "HSR Layout" | "MG Road" | "Jayanagar" | "Whitefield" | "JP Nagar";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  area: Area;
  address?: string;
  image_url: string;
  lat: number;
  lng: number;
  rating: number;
  price: number;
  description: string;
  google_maps_url?: string;
  vibes: string[];
  moods: Mood[];
}

export const MOODS: Mood[] = ["Cheap", "Cafe", "Dessert", "Spicy", "Street Food", "Aesthetic", "Late Night"];
export const AREAS: Area[] = ["Koramangala", "Indiranagar", "HSR Layout", "MG Road", "Jayanagar", "Whitefield", "JP Nagar"];

export const PRICE_MIN = 100;
export const PRICE_MAX = 2000;

// Seed data for Bangalore
export const SEED_RESTAURANTS: Omit<Restaurant, 'id'>[] = [
  {
    name: "Truffles",
    cuisine: "Burgers & Cafe",
    area: "Koramangala",
    address: "93/A, 4th B Cross, 5th Block, Koramangala",
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1500&auto=format&fit=crop",
    lat: 12.9344,
    lng: 77.6192,
    rating: 4.5,
    price: 400,
    description: "Legendary burgers, pastas, and thick shakes. A Bangalore institution that's always buzzing.",
    google_maps_url: "https://maps.app.goo.gl/truffles_koramangala",
    vibes: ["Bustling", "Casual", "College Crowd"],
    moods: ["Cafe", "Cheap"],
  },
  {
    name: "Toit Brewpub",
    cuisine: "Pub & Continental",
    area: "Indiranagar",
    address: "298, 100 Feet Rd, Near KFC Junction, Indiranagar",
    image_url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1500&auto=format&fit=crop",
    lat: 12.9791,
    lng: 77.6406,
    rating: 4.7,
    price: 1200,
    description: "One of Bangalore's most iconic microbreweries with fantastic wood-fired pizzas.",
    google_maps_url: "https://maps.app.goo.gl/toit_indiranagar",
    vibes: ["Loud", "Lively", "Classic"],
    moods: ["Late Night"],
  },
  {
    name: "Rameshwaram Cafe",
    cuisine: "South Indian",
    area: "Indiranagar",
    address: "Ground Floor, No 2984, 12th Main Rd, HAL 2nd Stage, Indiranagar",
    image_url: "https://images.unsplash.com/photo-1610192244261-3f33de715810?q=80&w=1500&auto=format&fit=crop",
    lat: 12.9702,
    lng: 77.6453,
    rating: 4.6,
    price: 200,
    description: "Premium QSR serving ghee-drenched podi idlis and crispy dosas till late night.",
    google_maps_url: "https://maps.app.goo.gl/rameshwaram_indiranagar",
    vibes: ["Crowded", "Fast-paced", "Street"],
    moods: ["Cheap", "Street Food", "Late Night", "Spicy"],
  },
  {
    name: "Brik Oven",
    cuisine: "Italian Pizza",
    area: "Indiranagar",
    address: "872/a, HAL 2nd Stage, 100 Feet Rd, Indiranagar",
    image_url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1500&auto=format&fit=crop",
    lat: 12.9698,
    lng: 77.6385,
    rating: 4.4,
    price: 800,
    description: "Authentic Neapolitan pizzas baked in a wood-fired oven. Great shakes too.",
    google_maps_url: "https://maps.app.goo.gl/brik_oven",
    vibes: ["Cozy", "Date Night", "Casual"],
    moods: ["Aesthetic", "Cafe"],
  },
  {
    name: "Corner House Ice Cream",
    cuisine: "Desserts",
    area: "Koramangala",
    address: "No 1, 1st Cross, 5th Block, Koramangala",
    image_url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1500&auto=format&fit=crop",
    lat: 12.9348,
    lng: 77.6231,
    rating: 4.8,
    price: 250,
    description: "The legendary Death By Chocolate (DBC). Bangalore's favorite old-school ice cream parlor.",
    google_maps_url: "https://maps.app.goo.gl/cornerhouse",
    vibes: ["Nostalgic", "Family", "Sweet"],
    moods: ["Dessert", "Cheap"],
  },
  {
    name: "Meghana Foods",
    cuisine: "Biryani & Andhra",
    area: "Koramangala",
    address: "124, 1st Cross Rd, 5th Block, Koramangala",
    image_url: "https://images.unsplash.com/photo-1631515243349-e0cb4c1133c6?q=80&w=1500&auto=format&fit=crop",
    lat: 12.9366,
    lng: 77.6256,
    rating: 4.5,
    price: 600,
    description: "Famous for their spicy, flavorful Boneless Chicken Biryani. Always packed.",
    google_maps_url: "https://maps.app.goo.gl/meghana_koramangala",
    vibes: ["Bustling", "Spicy", "Hearty"],
    moods: ["Spicy"],
  },
  {
    name: "Third Wave Coffee",
    cuisine: "Cafe & Roastery",
    area: "HSR Layout",
    address: "984, 11th Main Rd, Sector 1, HSR Layout",
    image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1500&auto=format&fit=crop",
    lat: 12.9116,
    lng: 77.6389,
    rating: 4.3,
    price: 400,
    description: "Premium coffee, good WiFi, and perfect environment for remote working or casual meets.",
    google_maps_url: "https://maps.app.goo.gl/thirdwave_hsr",
    vibes: ["Work", "Chill", "Modern"],
    moods: ["Cafe", "Aesthetic"],
  },
  {
    name: "Asha Tiffins",
    cuisine: "South Indian",
    area: "HSR Layout",
    address: "Sector 4, HSR Layout",
    image_url: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?q=80&w=1500&auto=format&fit=crop",
    lat: 12.9121,
    lng: 77.6445,
    rating: 4.7,
    price: 150,
    description: "Crowd-favorite for cheap, delicious dosas and filter coffee. Breakfast staple.",
    google_maps_url: "https://maps.app.goo.gl/asha_tiffins",
    vibes: ["Morning Rush", "Local", "Quick"],
    moods: ["Cheap", "Street Food"],
  },
  {
    name: "Windmills Craftworks",
    cuisine: "Microbrewery & Fine Dining",
    area: "Whitefield",
    address: "331, 5B Road, EPIP Zone, Whitefield",
    image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1500&auto=format&fit=crop",
    lat: 12.9822,
    lng: 77.7289,
    rating: 4.6,
    price: 1800,
    description: "Jazz theater, microbrewery, and exceptional food. A premium experience.",
    google_maps_url: "https://maps.app.goo.gl/windmills",
    vibes: ["Upscale", "Jazz", "Premium"],
    moods: ["Aesthetic", "Late Night"],
  },
  {
    name: "Nagarjuna",
    cuisine: "Andhra Meals",
    area: "MG Road",
    address: "44/1, Residency Road, MG Road",
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1500&auto=format&fit=crop",
    lat: 12.9734,
    lng: 77.6094,
    rating: 4.5,
    price: 700,
    description: "Iconic traditional Andhra meals served on banana leaves. Extremely spicy and satisfying.",
    google_maps_url: "https://maps.app.goo.gl/nagarjuna",
    vibes: ["Traditional", "Spicy", "Family"],
    moods: ["Spicy"],
  },
  {
    name: "Milano Ice Cream",
    cuisine: "Gelato",
    area: "Indiranagar",
    address: "460, 2nd Cross Rd, Indiranagar",
    image_url: "https://images.unsplash.com/photo-1573385750831-2953258c381c?q=80&w=1500&auto=format&fit=crop",
    lat: 12.9750,
    lng: 77.6410,
    rating: 4.7,
    price: 300,
    description: "Authentic Italian gelato with incredible textures and flavors.",
    google_maps_url: "https://maps.app.goo.gl/milano",
    vibes: ["Sweet", "Chill", "Walk-in"],
    moods: ["Dessert", "Aesthetic"],
  }
];


