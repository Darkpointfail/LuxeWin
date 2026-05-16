"use client";

import { motion } from "framer-motion";
import { Gift, Sparkles, Crown } from "lucide-react";

const items = [
  {
    icon: Sparkles,
    title: "Golden hour wheel",
    desc: "A members-only ritual for active Gaviom Club holders.",
  },
  {
    icon: Gift,
    title: "Bonus entries",
    desc: "Quiet loyalty perks, never loud, never cheap.",
  },
  {
    icon: Crown,
    title: "House-list status",
    desc: "Early access to the rarest drops before the feed catches fire.",
  },
];

export function GamificationTeaser() {
  return (
    <section className="border-t border-white/5 bg-gradient-to-b from-luxe-black to-luxe-charcoal py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-[10px] uppercase tracking-[0.35em] text-luxe-offwhite/40">
          Gaviom Club membership layer
        </p>
        <h2 className="mt-3 text-center font-display text-2xl font-bold italic text-white md:text-3xl">
          Small rewards. Luxury-level standards.
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-xs text-luxe-offwhite/50">
          No “too good to be true” gimmicks, only clear mechanics that feel expensive, intentional, and worth coming back
          for.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-colors hover:border-gold/25"
            >
              <item.icon className="h-8 w-8 text-gold/90" strokeWidth={1.25} />
              <h3 className="mt-4 font-display text-lg font-semibold italic text-luxe-offwhite">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-luxe-offwhite/55">{item.desc}</p>
              <p className="mt-4 text-[10px] uppercase tracking-widest text-luxe-offwhite/35">
                Coming to your member hub
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
