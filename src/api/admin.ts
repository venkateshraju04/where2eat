import { createServerFn } from "@tanstack/react-start";
import { supabase } from "../lib/supabase";

// Admin credentials check
function verifyAdmin(data: any) {
  const envUser = process.env.ADMIN_USER || "admin";
  const envPass = process.env.ADMIN_PASSWORD || "spinbite2026";
  
  if (data.adminUser !== envUser || data.adminPass !== envPass) {
    throw new Error("Unauthorized");
  }
}

export const getPendingSuggestions = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    verifyAdmin(data);

    const { data: suggestions, error } = await supabase
      .from("suggestions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw new Error("Failed to fetch suggestions: " + error.message);
    return suggestions;
  });

export const rejectSuggestion = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    verifyAdmin(data);

    const { error } = await supabase
      .from("suggestions")
      .update({ status: "rejected" })
      .eq("id", data.id);

    if (error) throw new Error("Failed to reject: " + error.message);
    return { success: true };
  });

export const approveSuggestion = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    verifyAdmin(data);

    // 1. Fetch the suggestion
    const { data: suggestion, error: fetchErr } = await supabase
      .from("suggestions")
      .select("*")
      .eq("id", data.id)
      .single();

    if (fetchErr || !suggestion) throw new Error("Suggestion not found");

    // 2. Insert into restaurants
    const { error: insertErr } = await supabase.from("restaurants").insert([{
      name: suggestion.name,
      cuisine: suggestion.cuisine || "Unknown",
      area: suggestion.area || "Unknown",
      address: null,
      image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1500&auto=format&fit=crop", // placeholder restaurant image
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
      rating: null,
      price: suggestion.price || 500,
      description: suggestion.description || "A community suggested spot.",
      google_maps_url: null,
      vibes: data.vibes ? data.vibes.split(",").map((v: string) => v.trim()).filter(Boolean) : [],
      moods: suggestion.suggested_moods || [],
      is_active: true
    }]);

    if (insertErr) throw new Error("Failed to insert restaurant: " + insertErr.message);

    // 3. Mark as approved
    await supabase
      .from("suggestions")
      .update({ status: "approved" })
      .eq("id", data.id);

    return { success: true };
  });
