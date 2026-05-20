import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        void: "#141210",
        navy: {
          DEFAULT: "#141210",
          card: "#221E1A",
          raised: "#2E2822",
        },
        surface: {
          DEFAULT: "#221E1A",
          raised: "#2E2822",
        },
        gold: {
          DEFAULT: "#F0C040",
          light: "#F5D060",
          dark: "#C49A20",
        },
        luxe: {
          black: "#0F0E0C",
          charcoal: "#1A1815",
          smoke: "#252219",
          offwhite: "#F0EBE3",
        },
        urgency: "#E8402A",
        safe: "#2ECC71",
        info: "#4A9EFF",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(90deg, #C49A20 0%, #F0C040 50%, #F5D060 100%)",
        "feed-image-fade":
          "linear-gradient(to top, rgba(15, 14, 12, 0.88) 0%, transparent 55%)",
      },
      boxShadow: {
        "gold-glow": "0 0 12px rgba(240, 192, 64, 0.4)",
        "gold-glow-lg":
          "0 0 0 1px rgba(240, 192, 64, 0.35), 0 0 20px rgba(240, 192, 64, 0.35), 0 20px 50px -12px rgba(240, 192, 64, 0.2)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.65" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "100%": { transform: "scale(1.12) translate(-1.5%, -1%)" },
        },
        "ken-burns-slow": {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "100%": { transform: "scale(1.14) translate(-2.2%, -1.3%)" },
        },
        "light-sweep": {
          "0%": { transform: "translateX(-100%) skewX(-12deg)", opacity: "0" },
          "15%": { opacity: "0.4" },
          "50%": { transform: "translateX(200%) skewX(-12deg)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        "glow-breathe": {
          "0%, 100%": {
            boxShadow:
              "0 0 12px rgba(240, 192, 64, 0.35), 0 0 24px rgba(240, 192, 64, 0.12)",
          },
          "50%": {
            boxShadow:
              "0 0 16px rgba(240, 192, 64, 0.55), 0 0 32px rgba(240, 192, 64, 0.2)",
          },
        },
        "live-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(0.92)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "shake-soft": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-3px)" },
          "80%": { transform: "translateX(3px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "pulse-urgent": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.72" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "ken-burns": "ken-burns 22s ease-in-out infinite alternate",
        "ken-burns-slow": "ken-burns-slow 36s ease-in-out infinite alternate",
        "light-sweep": "light-sweep 7s ease-in-out infinite",
        "glow-breathe": "glow-breathe 3.5s ease-in-out infinite",
        marquee: "marquee 38s linear infinite",
        "shake-soft": "shake-soft 0.5s ease-in-out",
        "spin-slow": "spin-slow 2.8s linear infinite",
        "pulse-urgent": "pulse-urgent 1.2s ease-in-out infinite",
        "live-pulse": "live-pulse 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
