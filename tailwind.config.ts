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
        void: "#050507",
        surface: {
          DEFAULT: "#111111",
          raised: "#1A1A1A",
        },
        gold: {
          DEFAULT: "#C8A951",
          light: "#F0D080",
          dark: "#8B6914",
        },
        luxe: {
          black: "#080808",
          charcoal: "#111111",
          smoke: "#1A1A1A",
          offwhite: "#F5F3EE",
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
          "linear-gradient(90deg, #8B6914 0%, #C9A84C 45%, #F0D080 100%)",
      },
      boxShadow: {
        "gold-glow":
          "0 0 0 1px rgba(201, 168, 76, 0.35), 0 20px 50px -12px rgba(201, 168, 76, 0.25)",
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
              "0 0 20px rgba(201, 168, 76, 0.25), 0 0 40px rgba(201, 168, 76, 0.08)",
          },
          "50%": {
            boxShadow:
              "0 0 28px rgba(201, 168, 76, 0.45), 0 0 60px rgba(201, 168, 76, 0.15)",
          },
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
      },
    },
  },
  plugins: [],
};
export default config;
