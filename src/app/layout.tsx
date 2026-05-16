import type { Metadata, Viewport } from "next";
import { Outfit, Instrument_Serif, DM_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppChrome } from "@/components/app-chrome";
import { BRAND } from "@/lib/brand";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400"],
  style: ["italic", "normal"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: `${BRAND.name} | ${BRAND.tagline}`,
  description: `Premium experience drops on ${BRAND.name}. Verified winners, limited entries, members-only access. ${BRAND.tagline}`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080808",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${instrumentSerif.variable} ${dmMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://upload.wikimedia.org" />
        <link rel="preconnect" href="https://videos.pexels.com" />
        <link rel="preconnect" href="https://assets.mixkit.co" />
      </head>
      <body className="min-h-[100dvh] overflow-x-hidden bg-void font-sans font-light text-luxe-offwhite antialiased">
        <Providers>
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}
