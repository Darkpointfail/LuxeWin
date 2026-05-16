"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, Clapperboard } from "lucide-react";
import { LOTS, categorieLabel } from "@/lib/data";
import { searchLots } from "@/lib/search-lots";
import { useFeedStore } from "@/stores/feed-store";
import type { Lot } from "@/lib/types";
import { formatUsd } from "@/lib/format-display";
import { BRAND } from "@/lib/brand";

const SUGGESTIONS = [
  "Vegas",
  "Cruise",
  "Sea",
  "iPhone",
  "Circuit",
  "Supercar",
];

type Props = { open: boolean; onClose: () => void };

function lotIndex(lot: Lot) {
  return LOTS.findIndex((l) => l.id === lot.id);
}

export function LuxewinSearchOverlay({ open, onClose }: Props) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const requestScrollToSlide = useFeedStore((s) => s.requestScrollToSlide);

  const results = useMemo(() => searchLots(LOTS, q), [q]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const goToClip = (lot: Lot) => {
    const i = lotIndex(lot);
    if (i >= 0) requestScrollToSlide(i);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal
          aria-labelledby="search-gaviom-title"
          className="fixed inset-0 z-[100] flex flex-col bg-void/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="flex min-h-0 flex-1 flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(4.5rem,env(safe-area-inset-top)+0.75rem)]"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex w-full max-w-lg flex-col min-h-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-1.5 font-display text-[10px] font-medium uppercase tracking-[0.26em] text-gold">
                    <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
                    {BRAND.name}
                  </p>
                  <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
                    {BRAND.tagline}
                  </p>
                  <h2
                    id="search-gaviom-title"
                    className="mt-2 font-serif text-2xl font-normal italic tracking-tight text-[var(--white)] sm:text-[1.75rem]"
                  >
                    Search experiences
                  </h2>
                  <p className="mt-1.5 max-w-sm font-display text-xs leading-relaxed text-[var(--muted)] sm:text-[13px]">
                    Brands, cities, moods, jump to the full-screen clip or open the full detail sheet.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="touch-manipulation shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface)] p-2.5 text-[var(--muted)] transition-colors duration-100 hover:border-gold/35 hover:text-[var(--white)] active:opacity-80"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="relative mt-5">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/75"
                  aria-hidden
                />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Monte-Carlo, Michelin dinner, 911 GT3…"
                  autoComplete="off"
                  className="w-full touch-manipulation rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-3.5 pl-11 pr-4 font-display text-sm text-[var(--white)] placeholder:text-[var(--muted)]/75 outline-none transition-[border-color,box-shadow] duration-150 focus:border-gold/50 focus:shadow-[0_0_0_1px_rgba(200,169,81,0.22)]"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQ(s)}
                    className="touch-manipulation rounded-full border border-[var(--border)] bg-[var(--surface-raised)]/55 px-3 py-1.5 font-display text-[11px] font-medium text-[var(--muted)] transition-all duration-100 hover:border-gold/40 hover:text-gold active:scale-[0.98]"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <Link
                href="/categories"
                onClick={onClose}
                className="mt-3 self-start font-display text-xs font-medium text-gold/90 underline-offset-4 transition-opacity hover:underline hover:opacity-100"
              >
                Browse by category →
              </Link>

              <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/55">
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
                  {!q.trim() && (
                    <p className="px-5 py-8 text-center font-display text-sm leading-relaxed text-[var(--muted)]">
                      Type a keyword or tap a suggestion, live drops appear instantly.
                    </p>
                  )}
                  {q.trim() && results.length === 0 && (
                    <p className="px-5 py-8 text-center font-display text-sm leading-relaxed text-[var(--muted)]">
                      No matches yet. Try another keyword or open{" "}
                      <Link
                        href="/categories"
                        className="text-gold underline underline-offset-2"
                        onClick={onClose}
                      >
                        categories
                      </Link>
                      .
                    </p>
                  )}
                  <ul className="divide-y divide-[var(--border)]/70">
                    {results.map((lot) => (
                      <li key={lot.id} className="flex gap-3 p-4">
                        <div className="relative h-[5.25rem] w-16 shrink-0 overflow-hidden rounded-xl border border-[var(--border)]/50 bg-luxe-smoke sm:h-24 sm:w-[4.75rem]">
                          <Image
                            src={lot.media.posterUrl}
                            alt=""
                            fill
                            className="object-cover object-[center_25%] sm:object-center"
                            sizes="(max-width:640px) 64px, 76px"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                            {categorieLabel(lot.categorie)}
                            {lot.membres_only ? " · Gaviom Club" : ""}
                          </span>
                          <p className="mt-0.5 font-serif text-[1.05rem] font-normal italic leading-snug text-[var(--white)] sm:text-lg">
                            {lot.titre}
                          </p>
                          <p className="mt-0.5 line-clamp-2 font-display text-[11px] text-[var(--muted)] sm:text-xs">
                            {lot.tagline}
                          </p>
                          <p className="mt-1 font-mono text-xs text-gold">
                            from {formatUsd(lot.ticketPrice)}
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => goToClip(lot)}
                              className="inline-flex touch-manipulation items-center gap-1.5 rounded-full border border-gold/40 bg-gold/12 px-3.5 py-2 font-display text-[11px] font-medium text-gold transition-[background-color,transform] duration-100 hover:bg-gold/20 active:scale-[0.98]"
                            >
                              <Clapperboard className="h-3.5 w-3.5" aria-hidden />
                              Watch clip
                            </button>
                            <Link
                              href={`/concours/${lot.id}`}
                              onClick={onClose}
                              className="inline-flex touch-manipulation items-center rounded-full border border-[var(--border)] px-3.5 py-2 font-display text-[11px] font-medium text-[var(--white)] transition-[border-color,opacity] duration-100 hover:border-gold/35 active:opacity-80"
                            >
                              Full details
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
