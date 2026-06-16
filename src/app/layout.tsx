import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://where2eat-blr.vercel.app"),
  title: "Where2Eat — Find Bangalore's Best Food Spots & Cafes",
  description:
    "Discover hand-picked local food spots, unique cafes, and popular restaurants nearby in Bangalore. Still undecided? Let our wheel pick for you!",
  authors: [{ name: "Where2Eat" }],
  keywords: [
    "Bangalore restaurants",
    "Bangalore cafes",
    "best food spots Bangalore",
    "where to eat Bangalore",
    "nearby restaurants",
    "food spots Bangalore",
    "random food picker",
    "Koramangala cafes",
    "Indiranagar restaurants",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Where2Eat — Find Bangalore's Best Food Spots & Cafes",
    description:
      "Discover hand-picked local food spots, unique cafes, and popular restaurants nearby in Bangalore.",
    type: "website",
    siteName: "Where2Eat",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Where2Eat — Find Bangalore's Best Food Spots & Cafes",
    description:
      "Discover hand-picked local food spots, unique cafes, and popular restaurants nearby in Bangalore.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ea580c'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E" />
        <meta name="theme-color" content="#1a1424" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
