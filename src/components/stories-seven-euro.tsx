"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { STORIES_7_EURO } from "@/lib/emotional-content";

export function StoriesSevenEuro() {
  return (
    <section className="noise-overlay border-t border-white/5 bg-luxe-black py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-[10px] uppercase tracking-[0.35em] text-gold/80">Proof, not hype</p>
        <h2 className="mt-4 text-center font-display text-[clamp(1.75rem,4vw,3rem)] font-bold italic text-white text-balance">
          What a few dollars rewired for them.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-luxe-offwhite/55">
          Real profiles, real routines, not a curated “luxury influencer” cast. People who look like your group chat.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {STORIES_7_EURO.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: i * 0.1,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-luxe-charcoal/50 backdrop-blur-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={s.photo}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxe-black via-transparent to-transparent" />
              </div>
              <div className="space-y-3 p-5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-gold/90">{s.name}</p>
                <p className="text-sm italic text-luxe-offwhite/55">“{s.before}”</p>
                <p className="text-sm font-medium leading-relaxed text-luxe-offwhite">“{s.after}”</p>
                <p className="border-t border-white/10 pt-3 text-xs text-luxe-offwhite/45">{s.detail}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
