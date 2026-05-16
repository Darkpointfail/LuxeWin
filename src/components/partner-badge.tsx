"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import type { LotPartner } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  partenaire: LotPartner;
  className?: string;
};

export function PartnerBadge({ partenaire, className }: Props) {
  const [open, setOpen] = useState(false);
  const initial = partenaire.nom
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn("relative inline-flex items-center gap-2", className)}>
      <button
        type="button"
        className="flex touch-manipulation items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-left transition-[border-color,opacity,transform] duration-100 ease-out hover:border-gold/30 active:scale-[0.99]"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        {partenaire.logo ? (
          <Image
            src={partenaire.logo}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/15 font-mono text-xs font-medium text-gold">
            {initial}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-display text-xs font-medium text-[var(--white)]">
            {partenaire.nom}
          </p>
          <p className="flex items-center gap-0.5 text-[10px] text-[var(--muted)]">
            Official partner
            <Check className="h-3 w-3 text-gold" aria-hidden />
          </p>
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 max-w-[240px] rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2 text-[11px] leading-snug text-[var(--muted)] shadow-xl"
            role="tooltip"
          >
            {partenaire.description}
            <span className="mt-1 block font-mono text-[10px] text-gold/80">
              {partenaire.note.toFixed(2)} / 5
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
