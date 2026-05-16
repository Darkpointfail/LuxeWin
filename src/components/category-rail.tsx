"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CONTEST_CATEGORY_PILLS } from "@/lib/emotional-content";
import { cn } from "@/lib/utils";

export function CategoryRail() {
  return (
    <div className="border-b border-white/5 bg-luxe-black/80 py-4 backdrop-blur-sm">
      <p className="mb-3 px-4 text-center text-[10px] uppercase tracking-[0.35em] text-luxe-offwhite/40 md:px-6">
        Always another drop to explore
      </p>
      <div className="flex gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:justify-center md:overflow-visible md:px-6 [&::-webkit-scrollbar]:hidden">
        {CONTEST_CATEGORY_PILLS.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.4 }}
          >
            <Link
              href="/#concours"
              className={cn(
                "inline-flex shrink-0 rounded-full border border-white/10 bg-luxe-charcoal/60 px-4 py-2 text-xs text-luxe-offwhite/85",
                "transition-all duration-300 hover:border-gold/40 hover:bg-gold/10 hover:text-gold"
              )}
            >
              {c.label}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
