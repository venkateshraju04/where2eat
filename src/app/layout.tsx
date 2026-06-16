import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Where2Eat BLR — Hidden Food Gems Nearby",
  description:
    "Discover Bangalore's best hand-picked local food spots and hidden gems. Still undecided? Let our wheel pick for you!",
  authors: [{ name: "Where2Eat BLR" }],
  openGraph: {
    title: "Where2Eat BLR — Hidden Food Gems Nearby",
    description: "Discover Bangalore's best hand-picked local food spots and hidden gems.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
        <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
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
