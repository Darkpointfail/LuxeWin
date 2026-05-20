"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { Lot } from "@/lib/types";
import { FEED_WHISPER_LINES } from "@/lib/data";
import { entriesTodayCount, prizeValueHook } from "@/lib/conversion";
import { getLotCarouselItems } from "@/lib/prize-carousel-media";
import { formatNumberEn, formatUsd } from "@/lib/format-display";
import { FEED_CTA_ENTER, FEED_RULES_LINK, FEED_TRUST_STRIP } from "@/lib/site-copy";
import { PrizeMediaCarousel } from "@/components/prize-media-carousel";
import { CountdownTimerFeed } from "@/components/countdown-timer-feed";
import { cn } from "@/lib/utils";

type Props = {
  lot: Lot;
  slideIndex: number;
  isActive: boolean;
  onExpand?: () => void;
};

export function ConcourSlide({ lot, slideIndex, isActive }: Props) {
  const carouselItems = useMemo(() => getLotCarouselItems(lot), [lot]);
  const [captionIndex, setCaptionIndex] = useState(0);
  const enteredToday = entriesTodayCount(lot);
  const valueHook = prizeValueHook(lot);
  const defaultWhisper = FEED_WHISPER_LINES[slideIndex % FEED_WHISPER_LINES.length]!;
  const activeCaption =
    carouselItems[captionIndex]?.caption ?? lot.tagline ?? defaultWhisper;
  const checkoutHref = `/concours/${lot.id}/checkout?qty=1`;

  return (
    <motion.div
      className="relative h-[100dvh] w-full shrink-0 snap-start snap-always overflow-hidden bg-void"
      initial={false}
      animate={{ opacity: isActive ? 1 : 0.55, scale: isActive ? 1 : 0.985 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <PrizeMediaCarousel
        items={carouselItems}
        isActive={isActive}
        priority={slideIndex === 0 || isActive}
        onIndexChange={setCaptionIndex}
      />

      {/* Social proof + urgency */}
      <div className="pointer-events-none absolute left-[max(1rem,calc(env(safe-area-inset-left,0px)+4px))] right-[max(1rem,calc(env(safe-area-inset-right,0px)+4px))] top-[max(6.5rem,calc(env(safe-area-inset-top)+5.85rem))] z-10 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-safe/40 bg-safe/15 px-3 py-1.5 font-display text-[11px] font-semibold text-safe">
          <span className="h-2 w-2 shrink-0 rounded-full bg-safe animate-live-pulse" aria-hidden />
          {formatNumberEn(enteredToday)} entered today
        </span>
        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 font-mono text-[11px] font-medium tabular-nums text-white backdrop-blur-md">
          <CountdownTimerFeed endDate={lot.endDate} compact className="!text-[11px]" />
        </span>
      </div>

      {/* Conversion stack */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-[max(7rem,calc(5.5rem+env(safe-area-inset-bottom,0px)))] pt-24 sm:px-6">
        <div className="mx-auto max-w-xl pointer-events-auto">
          <p className="font-display text-[clamp(2.35rem,9vw,3.5rem)] font-bold leading-[1.02] tracking-tight text-white drop-shadow-lg">
            {valueHook}
          </p>
          <p className="mt-2 font-serif text-[clamp(1.25rem,4.5vw,1.65rem)] font-normal italic leading-snug text-white/90">
            {lot.titre}
          </p>
          <p className="mt-2 font-display text-[14px] font-light leading-snug text-white/75">
            {activeCaption}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/80">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
              <ShieldCheck className="h-3.5 w-3.5 text-safe" aria-hidden />
              Legit draw
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1">
              Prize {formatUsd(lot.valeur)}
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1">
              {formatNumberEn(Math.max(0, lot.ticketsTotal - lot.ticketsSold))} tickets left
            </span>
          </div>

          <Link
            href={checkoutHref}
            className="relative z-20 mt-6 flex min-h-[3.5rem] w-full touch-manipulation items-center justify-center rounded-2xl bg-gold px-6 font-display text-[15px] font-extrabold uppercase tracking-[0.1em] text-void shadow-[0_0_24px_rgba(240,192,64,0.45)] transition-[transform,filter] duration-150 hover:brightness-105 active:scale-[0.98]"
          >
            {FEED_CTA_ENTER(formatUsd(lot.ticketPrice))}
          </Link>

          <p className="mt-3 text-center font-display text-[11px] leading-relaxed text-white/55">
            {FEED_TRUST_STRIP}
          </p>

          <div className="mt-3 flex items-center justify-center gap-4 text-[11px]">
            <Link
              href={`/concours/${lot.id}`}
              className="font-medium text-white/50 underline-offset-2 hover:text-gold hover:underline"
            >
              Prize details
            </Link>
            <Link
              href={`/rules/${lot.id}`}
              className="font-medium text-white/50 underline-offset-2 hover:text-gold hover:underline"
            >
              {FEED_RULES_LINK}
            </Link>
          </div>

          <p className="mt-4 text-center font-display text-[12px] font-medium text-gold/95">
            {defaultWhisper}
          </p>

          {carouselItems.length > 1 ? (
            <div
              className="mt-3 flex justify-center gap-1.5"
              aria-label="Photo gallery progress"
              role="tablist"
            >
              {carouselItems.map((_, i) => (
                <span
                  key={i}
                  role="tab"
                  aria-selected={i === captionIndex}
                  className={cn(
                    "block h-1 rounded-full transition-all duration-300",
                    i === captionIndex ? "w-6 bg-gold shadow-gold-glow" : "w-1.5 bg-white/30"
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
