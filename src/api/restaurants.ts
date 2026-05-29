import { createServerFn } from "@tanstack/react-start";
import { supabase } from "../lib/supabase";
import { SEED_RESTAURANTS, type Restaurant } from "../data/restaurants";

export const getRestaurants = createServerFn({ method: "GET" }).handler(
  async (): Promise<Restaurant[]> => {
    // Attempt to fetch from Supabase
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("is_active", true);

    if (error || !data || data.length === 0) {
      console.warn("Falling back to SEED_RESTAURANTS (Supabase error or empty DB)", error);
      // Fallback to seed data with generated IDs
      return SEED_RESTAURANTS.map((r, i) => ({
        ...r,
        id: `seed-${i + 1}`,
      }));
    }

    return data as Restaurant[];
  },
);

export const submitSuggestion = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const { error } = await supabase.from("suggestions").insert([
      {
        name: data.name,
        cuisine: data.cuisine,
        area: data.area,
        price: data.price,
        description: data.description,
        google_maps_url: data.google_maps_url,
        suggested_moods: data.suggested_moods || [],
        submitter_name: data.submitter_name,
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Failed to submit suggestion:", error);
      throw new Error("Failed to submit suggestion");
    }

    return { success: true };
  });
