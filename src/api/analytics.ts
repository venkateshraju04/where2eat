import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { supabase } from "../lib/supabase";

export const logLocationAnalytics = createServerFn({ method: "POST" })
  .validator((d: { lat: number; lng: number }) => d)
  .handler(async ({ data }) => {
    // getRequestIP uses the underlying Nitro/h3 event to extract the IP securely
    const ip = getRequestIP({ xForwardedFor: true });
    
    const { error } = await supabase.from("analytics").insert([
      {
        ip_address: ip || "unknown",
        lat: data.lat,
        lng: data.lng,
      },
    ]);

    if (error) {
      console.error("Failed to log location analytics:", error);
    }
    
    return { success: true };
  });
