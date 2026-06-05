import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function verifyAdmin(data: any) {
  const envUser = process.env.ADMIN_USER || "admin";
  const envPass = process.env.ADMIN_PASSWORD || "spinbite2026";

  if (data.adminUser !== envUser || data.adminPass !== envPass) {
    throw new Error("Unauthorized");
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, ...data } = body;

  try {
    verifyAdmin(data);

    switch (action) {
      case "getPending": {
        const { data: suggestions, error } = await supabase
          .from("suggestions")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) throw new Error("Failed to fetch suggestions: " + error.message);
        return NextResponse.json(suggestions);
      }

      case "reject": {
        const { error } = await supabase
          .from("suggestions")
          .update({ status: "rejected" })
          .eq("id", data.id);

        if (error) throw new Error("Failed to reject: " + error.message);
        return NextResponse.json({ success: true });
      }

      case "approve": {
        // 1. Fetch the suggestion
        const { data: suggestion, error: fetchErr } = await supabase
          .from("suggestions")
          .select("*")
          .eq("id", data.id)
          .single();

        if (fetchErr || !suggestion) throw new Error("Suggestion not found");

        // 2. Insert into restaurants
        const { error: insertErr } = await supabase.from("restaurants").insert([
          {
            name: suggestion.name,
            cuisine: suggestion.cuisine || "Unknown",
            area: suggestion.area || "Unknown",
            address: null,
            image_url:
              data.imageUrl ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1500&auto=format&fit=crop",
            lat: parseFloat(data.lat),
            lng: parseFloat(data.lng),
            rating: null,
            price: suggestion.price || 500,
            description: suggestion.description || "A community suggested spot.",
            google_maps_url: null,
            vibes: data.vibes
              ? data.vibes
                  .split(",")
                  .map((v: string) => v.trim())
                  .filter(Boolean)
              : [],
            moods: suggestion.suggested_moods || [],
            is_active: true,
          },
        ]);

        if (insertErr)
          throw new Error("Failed to insert restaurant: " + insertErr.message);

        // 3. Mark as approved
        await supabase
          .from("suggestions")
          .update({ status: "approved" })
          .eq("id", data.id);

        return NextResponse.json({ success: true });
      }

      case "getAnalytics": {
        const { data: locations, error } = await supabase
          .from("analytics")
          .select("id, lat, lng, created_at, ip_address")
          .not("lat", "is", null)
          .not("lng", "is", null);

        if (error) throw new Error("Failed to fetch analytics: " + error.message);
        return NextResponse.json(locations);
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err: any) {
    const status = err.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
