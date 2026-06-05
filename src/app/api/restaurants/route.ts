import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { SEED_RESTAURANTS, type Restaurant } from "@/data/restaurants";

export async function GET() {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("is_active", true);

  if (error || !data || data.length === 0) {
    console.warn(
      "Falling back to SEED_RESTAURANTS (Supabase error or empty DB)",
      error
    );
    const fallback = SEED_RESTAURANTS.map((r, i) => ({
      ...r,
      id: `seed-${i + 1}`,
    }));
    return NextResponse.json(fallback);
  }

  return NextResponse.json(data as Restaurant[]);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { error } = await supabase.from("suggestions").insert([
    {
      name: body.name,
      cuisine: body.cuisine,
      area: body.area,
      price: body.price,
      description: body.description,
      google_maps_url: body.google_maps_url,
      suggested_moods: body.suggested_moods || [],
      submitter_name: body.submitter_name,
      status: "pending",
    },
  ]);

  if (error) {
    console.error("Failed to submit suggestion:", error);
    return NextResponse.json(
      { error: "Failed to submit suggestion" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
