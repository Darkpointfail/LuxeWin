"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import type { Lot } from "@/lib/types";
import { feedMoodForLot, FEED_WHISPER_LINES } from "@/lib/data";
import { formatNumberEn, formatUsd } from "@/lib/format-display";
import { FEED_CTA_TICKETS, FEED_EYEBROW, FEED_SECONDARY_CTA } from "@/lib/site-copy";
import { cn } from "@/lib/utils";
import { lotUsesVideo } from "@/lib/lot-media";
import { lotFeedHeroPhoto, lotFeedPoster, preloadLotMedia } from "@/lib/feed-media";
import { LotPhotoHero } from "@/components/lot-photo-hero";
import { useFastAutoplayVideo } from "@/hooks/use-fast-autoplay-video";

function isNewLot(publishedAt: Date) {
  return Date.now() - publishedAt.getTime() < 48 * 60 * 60 * 1000;
}

function pulseEmotional(lot: Lot): string {
  const remaining = Math.max(0, lot.ticketsTotal - lot.ticketsSold);
  const ms = lot.endDate.getTime() - Date.now();
  const hours = Math.max(0, ms / (60 * 60 * 1000));
  if (hours <= 14) {
    return `${formatNumberEn(remaining)} tickets left , draw closes tonight.`;
  }
  if (hours <= 36) {
    return `${formatNumberEn(remaining)} tickets left before the verified draw.`;
  }
  return `${formatNumberEn(remaining)} tickets left · one random winner when entries close.`;
}

type Props = {
  lot: Lot;
  slideIndex: number;
  activeIndex: number;
  isActive: boolean;
  onExpand: () => void;
};

function shouldEagerLoad(slideIndex: number, activeIndex: number): boolean {
  return slideIndex === 0 || Math.abs(slideIndex - activeIndex) <= 1;
}

export function ConcourSlide({ lot, slideIndex, activeIndex, isActive, onExpand }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const usesVideo = lotUsesVideo(lot);
  const heroPhoto = lotFeedHeroPhoto(lot);
  const posterUrl = lotFeedPoster(lot);
  const eager = shouldEagerLoad(slideIndex, activeIndex);
  const videoSrc = usesVideo ? lot.media.videoUrl : undefined;
  const [videoReady, setVideoReady] = useState(false);
  const whisper = FEED_WHISPER_LINES[slideIndex % FEED_WHISPER_LINES.length]!;
  const ctaLabel = FEED_CTA_TICKETS(formatUsd(lot.ticketPrice));
  const ticketsLeft = Math.max(0, lot.ticketsTotal - lot.ticketsSold);

  useEffect(() => {
    if (usesVideo) preloadLotMedia(lot);
  }, [lot, usesVideo]);

  useFastAutoplayVideo(videoRef, {
    src: videoSrc,
    active: isActive && usesVideo,
    playbackRate: lot.media.playbackRate ?? 1,
    onPlaying: () => setVideoReady(true),
  });

  return (
    <motion.div
      className="relative h-[100dvh] w-full shrink-0 snap-start snap-always overflow-hidden bg-void ring-1 ring-inset ring-white/[0.08]"
      initial={false}
      animate={{ opacity: isActive ? 1 : 0.55, scale: isActive ? 1 : 0.985 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0">
        {usesVideo ? (
          <>
            <LotPhotoHero
              src={posterUrl}
              animate={false}
              priority={slideIndex === 0}
              imageClassName="object-[50%_22%] md:object-center"
            />
            <video
              ref={videoRef}
              className={cn(
                "absolute inset-0 h-full w-full object-cover object-[50%_22%] transition-opacity duration-500 md:object-center",
                videoReady ? "opacity-100" : "opacity-0"
              )}
              src={eager ? videoSrc : undefined}
              poster={posterUrl}
              muted
              loop
              playsInline
              autoPlay={isActive}
              preload={eager ? "auto" : "none"}
            />
          </>
        ) : eager ? (
          <LotPhotoHero
            src={heroPhoto}
            animate={isActive}
            priority={slideIndex === 0 || isActive}
            imageClassName="object-[50%_40%] md:object-center"
          />
        ) : (
          <LotPhotoHero
            src={posterUrl}
            animate={false}
            priority={false}
            imageClassName="object-[50%_40%] md:object-center"
          />
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-feed-image-fade"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(180deg,rgba(15,14,12,0.75)_0%,rgba(15,14,12,0.12)_38%,rgba(15,14,12,0.05)_50%,rgba(15,14,12,0.65)_78%,rgba(15,14,12,0.98)_100%)]"
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-[4] bg-[radial-gradient(ellipse_95%_58%_at_50%_88%,rgba(15,14,12,0.92)_0%,rgba(15,14,12,0.35)_46%,transparent_74%)]"
        aria-hidden
      />
      <div className="feed-atmosphere z-[5]" aria-hidden />
      <motion.div className="feed-light-sweep animate-light-sweep z-[6]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-[7] cinematic-grain opacity-[0.1]"
        aria-hidden
      />

      <motion.div className="absolute left-[max(1rem,calc(env(safe-area-inset-left,0px)+4px))] right-[max(1rem,calc(env(safe-area-inset-right,0px)+4px))] top-[max(6.5rem,calc(env(safe-area-inset-top)+5.85rem))] z-10 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/35 bg-gold/12 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-gold shadow-gold-glow backdrop-blur-md">
          {FEED_EYEBROW}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-navy-card/85 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--white)] shadow-gold-glow backdrop-blur-md">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full bg-safe animate-live-pulse"
            aria-hidden
          />
          Verified draw
        </span>
        {isNewLot(lot.publishedAt) && (
          <span className="rounded-full border border-white/[0.08] bg-navy-card/80 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-luxe-offwhite backdrop-blur-md">
            New contest
          </span>
        )}
        <span className="rounded-full border border-white/[0.08] bg-navy-card/80 px-3 py-1 font-display text-[10px] font-medium uppercase tracking-[0.18em] text-luxe-offwhite backdrop-blur-md">
          {feedMoodForLot(lot)}
        </span>
        {lot.membres_only && (
          <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-navy-card/90 px-2 py-1 font-mono text-[10px] text-gold shadow-gold-glow backdrop-blur-md">
            <Lock className="h-3 w-3" aria-hidden />
            Inner circle
          </span>
        )}
      </motion.div>

      <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-[max(7rem,calc(5.5rem+env(safe-area-inset-bottom,0px)))] pt-32 sm:px-6 md:px-10">
        <div className="mx-auto max-w-xl min-w-0 pointer-events-auto">
          <h2 className="font-serif text-[clamp(1.85rem,6.4vw,2.95rem)] font-normal italic leading-[1.06] tracking-tight text-[#FFFFFF] text-balance drop-shadow-[0_4px_36px_rgba(15,14,12,0.95)]">
            {lot.titre}
          </h2>
          <p className="mt-3 font-display text-[15px] font-light leading-snug text-luxe-offwhite drop-shadow-[0_2px_22px_rgba(15,14,12,0.88)]">
            {lot.tagline}
          </p>

          <motion.div
            className="mt-5 rounded-2xl border border-white/[0.08] bg-navy-card/75 px-4 py-3 backdrop-blur-md"
            initial={false}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.85, y: 4 }}
            transition={{ duration: 0.35 }}
          >
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Ticket price
            </p>
            <p className="mt-0.5 font-display text-[clamp(2rem,8vw,2.75rem)] font-semibold leading-none tracking-tight text-gold drop-shadow-[0_0_12px_rgba(240,192,64,0.4)]">
              {formatUsd(lot.ticketPrice)}
            </p>
            <p className="mt-2 font-display text-[11px] text-[var(--muted)]">
              Prize worth {formatUsd(lot.valeur)} · 1 winner
            </p>
            <p className="mt-1 font-mono text-[10px] text-[var(--muted)]/85">
              {formatNumberEn(ticketsLeft)} tickets left · {formatNumberEn(lot.ticketsSold)}/
              {formatNumberEn(lot.ticketsTotal)} sold
            </p>
            <p className="mt-1 font-display text-[10px] text-[var(--muted)]/75">
              Free postal entry available
            </p>
          </motion.div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <button
              type="button"
              onClick={() => {
                onExpand();
                if (typeof navigator !== "undefined" && navigator.vibrate) {
                  navigator.vibrate(50);
                }
              }}
              className="flex min-h-[3.25rem] flex-1 touch-manipulation items-center justify-center rounded-xl bg-gold px-5 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-void shadow-gold-glow transition-[transform,box-shadow,filter] duration-150 ease-out hover:bg-gold-light hover:shadow-gold-glow-lg active:scale-[0.98]"
            >
              {ctaLabel}
            </button>
            <Link
              href={`/concours/${lot.id}`}
              className="flex min-h-[3.25rem] touch-manipulation items-center justify-center rounded-xl border border-white/[0.08] bg-navy-card/90 px-5 font-display text-[12px] font-semibold uppercase tracking-[0.1em] text-[#FFFFFF] backdrop-blur-md transition-[border-color,opacity,transform] duration-150 ease-out hover:border-gold/35 hover:shadow-gold-glow active:scale-[0.98]"
            >
              {FEED_SECONDARY_CTA}
            </Link>
          </div>

          <p className="mt-4 text-center font-display text-[11px] font-light leading-relaxed text-gold/90">
            {pulseEmotional(lot)}
          </p>

          <p className="mt-2 text-center font-display text-[11px] font-light italic leading-snug text-luxe-offwhite/75">
            {whisper}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
