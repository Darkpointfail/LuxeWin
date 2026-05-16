"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ConcourClient } from "@/lib/data";
import { CountdownTimer } from "@/components/countdown-timer";
import { TicketProgress } from "@/components/ticket-progress";
import { GoldButton } from "@/components/gold-button";
import { cn } from "@/lib/utils";
import { formatNumberEn, formatUsd } from "@/lib/format-display";

type Props = {
  concours: ConcourClient[];
  sales: Record<string, number>;
  onSlideChange?: (index: number) => void;
};

export function HeroConcoursCarousel({
  concours,
  sales,
  onSlideChange,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);
  const looped = useMemo(() => [...concours, ...concours], [concours]);

  const updateIndexFromScroll = useCallback(() => {
    const root = scrollerRef.current;
    if (!root || concours.length === 0) return;
    const slides = Array.from(
      root.querySelectorAll<HTMLElement>("[data-hero-slide]")
    );
    if (slides.length === 0) return;
    const rootRect = root.getBoundingClientRect();
    const rootCenter = rootRect.left + rootRect.width / 2;
    let best = 0;
    let bestDist = Infinity;
    slides.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - rootCenter);
      const logical = i % concours.length;
      if (d < bestDist) {
        bestDist = d;
        best = logical;
      }
    });
    setIndex(best);
    onSlideChange?.(best);
  }, [concours.length, onSlideChange]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    updateIndexFromScroll();
    root.addEventListener("scroll", updateIndexFromScroll, { passive: true });
    window.addEventListener("resize", updateIndexFromScroll);
    return () => {
      root.removeEventListener("scroll", updateIndexFromScroll);
      window.removeEventListener("resize", updateIndexFromScroll);
    };
  }, [updateIndexFromScroll, looped.length]);

  /* Défilement continu type bande Netflix, pause au drag (pointer) */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || concours.length === 0) return;

    const onDown = () => {
      pausedRef.current = true;
    };
    const onUp = () => {
      pausedRef.current = false;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onUp);

    let raf = 0;
    const speed = 0.38;
    const tick = () => {
      if (!pausedRef.current && el) {
        el.scrollLeft += speed;
        const half = el.scrollWidth / 2;
        if (half > 10 && el.scrollLeft >= half - 1) {
          el.scrollLeft -= half;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onUp);
    };
  }, [concours.length, looped.length]);

  const go = (dir: -1 | 1) => {
    const next = Math.min(concours.length - 1, Math.max(0, index + dir));
    const root = scrollerRef.current;
    const slide = root?.querySelectorAll<HTMLElement>("[data-hero-slide]")[
      next
    ];
    slide?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <motion.div
      className="relative mt-8 w-full md:mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="mb-3 text-center text-[10px] uppercase tracking-[0.3em] text-gold/75">
        Live now, stay in the dream
      </p>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-luxe-black to-transparent md:w-14" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-luxe-black to-transparent md:w-14" />

      <div
        ref={scrollerRef}
        className={cn(
          "flex max-w-full gap-4 overflow-x-auto overflow-y-visible pb-4 pt-1 [-ms-overflow-style:none] [scrollbar-width:none]",
          "scroll-smooth px-3 sm:px-5",
          "[&::-webkit-scrollbar]:hidden"
        )}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {looped.map((c, loopIdx) => {
          const sold = sales[c.id] ?? c.ticketsSold;
          const end = new Date(c.endDate);
          const remaining = Math.max(0, c.ticketsTotal - sold);
          const ratio = sold / c.ticketsTotal;
          const msLeft = end.getTime() - Date.now();
          const lastHours = msLeft < 24 * 60 * 60 * 1000 && msLeft > 0;
          const popular = ratio > 0.65;
          const almost = remaining / c.ticketsTotal < 0.2;

          return (
            <article
              key={`${c.id}-${loopIdx}`}
              data-hero-slide
              className={cn(
                "w-[min(28rem,calc(100vw-2.5rem))] min-w-0 max-w-full shrink-0 overflow-hidden rounded-2xl border border-white/15",
                "bg-white/[0.06] p-5 text-left shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:w-[28rem] sm:p-6",
                "transition-[transform,box-shadow] duration-500 hover:border-gold/30 hover:shadow-[0_0_60px_rgba(201,168,76,0.12)]"
              )}
            >
              <div className="flex flex-wrap gap-2">
                {lastHours && (
                  <span className="rounded-full bg-urgency/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-urgence ring-1 ring-urgency/35">
                    Final hours
                  </span>
                )}
                {almost && (
                  <span className="rounded-full bg-urgency/15 px-2.5 py-0.5 text-[10px] font-medium text-urgence ring-1 ring-urgency/30">
                    Almost sold out
                  </span>
                )}
                {popular && (
                  <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold">
                    Trending today
                  </span>
                )}
                <span className="rounded-full border border-white/10 bg-luxe-black/40 px-2.5 py-0.5 text-[10px] text-luxe-offwhite/65">
                  High activity
                </span>
              </div>

              <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.28em] text-gold/90">
                {c.categorie} · Live
              </p>
              <p className="mt-2 font-display text-xl font-bold italic leading-snug text-white md:text-2xl">
                {c.titre}
              </p>
              <p className="mt-1 text-sm text-luxe-offwhite/50">
                Est. value {formatUsd(c.valeur)}
              </p>
              <p className="mt-2 text-xs text-luxe-offwhite/45">
                <span className="tabular-nums text-luxe-offwhite/80">
                  {formatNumberEn(remaining)}
                </span>{" "}
                entries left
              </p>

              <div className="mt-4">
                <TicketProgress sold={sold} total={c.ticketsTotal} />
              </div>

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 max-w-full flex-1 overflow-hidden">
                  <CountdownTimer
                    endDate={end}
                    label="Closes in"
                    size="compact"
                  />
                  <p className="mt-3 font-display text-3xl font-bold text-white">
                    {formatUsd(c.ticketPrice)}{" "}
                    <span className="font-sans text-base font-light text-luxe-offwhite/70">
                      per entry
                    </span>
                  </p>
                </div>
                <GoldButton asChild className="w-full shrink-0 sm:w-auto">
                  <Link href={`/concours/${c.id}`}>Unlock the experience</Link>
                </GoldButton>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index <= 0}
          className="rounded-full border border-white/15 p-2 text-luxe-offwhite transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-30"
          aria-label="Previous drop"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {concours.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                scrollerRef.current
                  ?.querySelectorAll<HTMLElement>("[data-hero-slide]")
                  [i]?.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest",
                  });
              }}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index
                  ? "w-8 bg-gold"
                  : "w-2 bg-luxe-offwhite/25 hover:bg-luxe-offwhite/45"
              )}
              aria-label={`Go to drop ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index >= concours.length - 1}
          className="rounded-full border border-white/15 p-2 text-luxe-offwhite transition-colors hover:border-gold/50 hover:text-gold disabled:opacity-30"
          aria-label="Next drop"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}
