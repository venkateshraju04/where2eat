import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpinBite — Can't decide where to eat?",
  description:
    "Spin and discover your next food spot. A playful random picker for nearby restaurants and cafes.",
  authors: [{ name: "SpinBite" }],
  openGraph: {
    title: "SpinBite — Can't decide where to eat?",
    description: "Spin and discover your next food spot.",
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
