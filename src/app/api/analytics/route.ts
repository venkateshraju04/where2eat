import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();

  // Extract IP from headers (works on Vercel)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  const { error } = await supabase.from("analytics").insert([
    {
      ip_address: ip,
      lat: body.lat,
      lng: body.lng,
    },
  ]);

  if (error) {
    console.error("Failed to log location analytics:", error);
  }

  return NextResponse.json({ success: true });
}
