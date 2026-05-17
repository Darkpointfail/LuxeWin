import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import type { ReactNode } from "react";

const confirmationSerif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-corpo-serif",
  weight: ["300", "500"],
  display: "swap",
});

const confirmationSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-corpo-sans",
  weight: ["400", "500"],
  display: "swap",
});

export default function EntryConfirmationLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${confirmationSerif.variable} ${confirmationSans.variable} min-h-screen bg-void text-[#FAFAF8] antialiased`}
      style={{ fontFamily: "var(--font-corpo-sans), system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
}
