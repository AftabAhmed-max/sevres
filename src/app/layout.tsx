// src/app/layout.tsx
// Root layout — wraps every page
// Sets metadata, fonts, and global providers

import type { Metadata } from "next";
import "./globals.css";
import { SALON } from "@/lib/constants";
import NavigationProgressWrapper from "@/components/ui/NavigationProgressWrapper";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600", "700"],
  style:    ["normal", "italic"],
  variable: "--font-cormorant",
  display:  "swap",
});

const dmSans = DM_Sans({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600"],
  style:    ["normal", "italic"],
  variable: "--font-dm-sans",
  display:  "swap",
});

// ─────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: `${SALON.name} — ${SALON.tagline}`,
    template: `%s | ${SALON.name}`,
  },
  description:
    "Sèvres & Co. is Mumbai's premier luxury salon and spa, offering bespoke hair, skin, nail, and massage treatments in the heart of Bandra West.",
  keywords: [
    "luxury salon Mumbai",
    "spa Bandra",
    "hair salon Mumbai",
    "facial Mumbai",
    "nail art Mumbai",
    "massage Bandra West",
    "Sèvres",
    "premium salon",
  ],
  authors: [{ name: "Sèvres & Co." }],
  creator: "Sèvres & Co.",
  openGraph: {
    type:        "website",
    locale:      "en_IN",
    url:         process.env.NEXT_PUBLIC_APP_URL,
    siteName:    SALON.name,
    title:       `${SALON.name} — ${SALON.tagline}`,
    description:
      "Bespoke luxury salon and spa treatments in Bandra West, Mumbai. Book your ritual today.",
  },
  twitter: {
    card:        "summary_large_image",
    title:       `${SALON.name} — ${SALON.tagline}`,
    description: "Bespoke luxury salon and spa treatments in Bandra West, Mumbai.",
  },
  robots: {
    index:  true,
    follow: true,
  },
  icons: {
    icon:  { url: "/favicon.svg",           type: "image/svg+xml" },
    apple: { url: "/apple-touch-icon.svg",  type: "image/svg+xml", sizes: "180x180" },
  },
};

// ─────────────────────────────────────────────
// ROOT LAYOUT
// ─────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Google Fonts are already loaded via @import
          in globals.css — no <link> tag needed here.
          Adding both would cause a double request.
        */}
      </head>
      <body className={`bg-ivory text-espresso antialiased ${cormorant.variable} ${dmSans.variable}`}>
        <NavigationProgressWrapper />
        {children}
      </body>
    </html>
  );
}