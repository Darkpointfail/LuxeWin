"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export function WinningCallSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-luxe-charcoal to-luxe-black py-20 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.12),transparent_65%)]" />

      <div className="relative z-[1] mx-auto max-w-6xl px-6">
        <p className="text-center text-[10px] uppercase tracking-[0.35em] text-gold/80">
          Projection
        </p>
        <h2 className="mt-4 text-center font-display text-[clamp(1.75rem,4vw,3rem)] font-bold italic leading-tight text-white text-balance">
          Picture getting this call.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-luxe-offwhite/60">
          Not spam. Not a sketchy robocall. A verified number, a calm voice, and that one sentence: “You won.” Thousands of
          everyday members have already lived it.
        </p>

        <div className="mx-auto mt-14 flex max-w-md justify-center">
          <motion.div
            className="relative rounded-[2rem] border border-white/10 bg-luxe-black/70 p-8 shadow-[0_0_80px_rgba(201,168,76,0.08)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-0 rounded-[2rem] ring-2 ring-gold/0"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(201, 168, 76, 0)",
                  "0 0 0 12px rgba(201, 168, 76, 0.12)",
                  "0 0 0 0 rgba(201, 168, 76, 0)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            />
            <div className="flex items-start gap-4">
              <motion.div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <Phone className="h-7 w-7" aria-hidden />
              </motion.div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-widest text-luxe-offwhite/45">Incoming call</p>
                <p className="mt-1 font-display text-lg font-semibold italic text-white">
                  Gaviom, Winner services
                </p>
                <p className="mt-3 text-sm leading-relaxed text-luxe-offwhite/70">
                  “Hi, this is the verified draw team. We’re thrilled to let you know you’ve won the experience you
                  entered…”
                </p>
                <p className="mt-4 text-[11px] text-gold/90">That moment lands for someone. Why not you.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
