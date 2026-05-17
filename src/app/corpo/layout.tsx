import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import type { ReactNode } from "react";

const corpoSerif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-corpo-serif",
  weight: ["300", "500"],
  display: "swap",
});

const corpoSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-corpo-sans",
  weight: ["400", "500"],
  display: "swap",
});

export default function CorpoLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${corpoSerif.variable} ${corpoSans.variable} min-h-screen bg-void text-[#FAFAF8] antialiased`}
      style={{ fontFamily: "var(--font-corpo-sans), system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
}
