import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://where2eat-blr.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/nrvr-admin",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
