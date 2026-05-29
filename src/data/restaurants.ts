import ramen from "@/assets/food-ramen.jpg";
import burger from "@/assets/food-burger.jpg";
import cafe from "@/assets/food-cafe.jpg";
import tacos from "@/assets/food-tacos.jpg";
import sushi from "@/assets/food-sushi.jpg";
import dessert from "@/assets/food-dessert.jpg";
import chicken from "@/assets/food-chicken.jpg";
import pizza from "@/assets/food-pizza.jpg";

export type Mood = "Cheap" | "Cafe" | "Dessert" | "Spicy" | "Street Food" | "Aesthetic" | "Late Night";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  distance: string;
  description: string;
  vibes: string[];
  moods: Mood[];
}

export const MOODS: Mood[] = ["Cheap", "Cafe", "Dessert", "Spicy", "Street Food", "Aesthetic", "Late Night"];

export const RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "Akira Ramen Bar",
    cuisine: "Japanese",
    image: ramen,
    rating: 4.8,
    distance: "0.4 km",
    description: "Steaming bowls of tonkotsu broth in a moody neon-lit room.",
    vibes: ["Cozy", "Neon", "Slurpy"],
    moods: ["Spicy", "Late Night", "Aesthetic"],
  },
  {
    id: "2",
    name: "Smash & Co.",
    cuisine: "Burgers",
    image: burger,
    rating: 4.6,
    distance: "0.7 km",
    description: "Crispy-edge smash patties, melty cheese, brioche buns.",
    vibes: ["Casual", "Comfort", "Crunchy"],
    moods: ["Cheap", "Late Night"],
  },
  {
    id: "3",
    name: "Lumière Café",
    cuisine: "Coffee & Brunch",
    image: cafe,
    rating: 4.7,
    distance: "0.3 km",
    description: "Latte art, warm lights, the perfect laptop afternoon.",
    vibes: ["Quiet", "Warm", "Slow"],
    moods: ["Cafe", "Aesthetic"],
  },
  {
    id: "4",
    name: "Calle Neon",
    cuisine: "Mexican Street",
    image: tacos,
    rating: 4.9,
    distance: "1.1 km",
    description: "Late-night tacos al pastor under a glowing neon sign.",
    vibes: ["Loud", "Lively", "Spicy"],
    moods: ["Street Food", "Late Night", "Cheap", "Spicy"],
  },
  {
    id: "5",
    name: "Kuro Sushi",
    cuisine: "Sushi",
    image: sushi,
    rating: 4.9,
    distance: "1.4 km",
    description: "Minimalist omakase counter with hand-cut nigiri.",
    vibes: ["Elegant", "Quiet", "Premium"],
    moods: ["Aesthetic"],
  },
  {
    id: "6",
    name: "Velvet Spoon",
    cuisine: "Desserts",
    image: dessert,
    rating: 4.7,
    distance: "0.8 km",
    description: "Molten chocolate lava cakes & artisan ice cream.",
    vibes: ["Sweet", "Decadent", "Romantic"],
    moods: ["Dessert", "Aesthetic"],
  },
  {
    id: "7",
    name: "Seoul Fire",
    cuisine: "Korean",
    image: chicken,
    rating: 4.8,
    distance: "0.9 km",
    description: "Double-fried wings glazed in fiery gochujang.",
    vibes: ["Spicy", "Sticky", "Crispy"],
    moods: ["Spicy", "Late Night"],
  },
  {
    id: "8",
    name: "Forno Vero",
    cuisine: "Italian Pizza",
    image: pizza,
    rating: 4.6,
    distance: "1.6 km",
    description: "Wood-fired margherita with charred leopard crust.",
    vibes: ["Classic", "Hearty", "Family"],
    moods: ["Cheap"],
  },
];
