"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Share2, Info, Lock } from "lucide-react";
import { toast } from "sonner";
import type { Lot } from "@/lib/types";
import { feedMoodForLot, FEED_WHISPER_LINES } from "@/lib/data";
import { formatUsd } from "@/lib/format-display";
import { useFeedStore } from "@/stores/feed-store";
import { cn } from "@/lib/utils";
import { lotUsesVideo } from "@/lib/lot-media";
import { lotFeedHeroPhoto, lotFeedPoster, preloadLotMedia } from "@/lib/feed-media";
import { LotPhotoHero } from "@/components/lot-photo-hero";
import { useFastAutoplayVideo } from "@/hooks/use-fast-autoplay-video";

function isNewLot(publishedAt: Date) {
  return Date.now() - publishedAt.getTime() < 48 * 60 * 60 * 1000;
}

function pulseEmotional(lot: Lot): string {
  const ms = lot.endDate.getTime() - Date.now();
  const hours = Math.max(0, ms / (60 * 60 * 1000));
  if (hours <= 14) return "This chapter locks tonight, timelines are watching.";
  if (hours <= 36) return "The glow on this drop is climbing.";
  return "People are saving this moment for later.";
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

  useEffect(() => {
    if (usesVideo) preloadLotMedia(lot);
  }, [lot, usesVideo]);

  useFastAutoplayVideo(videoRef, {
    src: videoSrc,
    active: isActive && usesVideo,
    playbackRate: lot.media.playbackRate ?? 1,
    onPlaying: () => setVideoReady(true),
  });
  const likedLotIds = useFeedStore((s) => s.likedLotIds);
  const toggleLikeLot = useFeedStore((s) => s.toggleLikeLot);
  const liked = likedLotIds.includes(lot.id);
  const whisper = FEED_WHISPER_LINES[slideIndex % FEED_WHISPER_LINES.length]!;

  const share = async () => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/concours/${lot.id}`;
    const text = `${lot.tagline}, ${lot.titre} · Gaviom`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Gaviom", text, url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }

    const clip = `${text}\n${url}`;
    try {
      await navigator.clipboard.writeText(clip);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn’t copy link");
    }
  };

  return (
    <div className="relative h-[100dvh] w-full shrink-0 snap-start snap-always overflow-hidden bg-void">
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.985 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
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
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(5,5,7,0.82)_0%,rgba(5,5,7,0.18)_32%,rgba(5,5,7,0.08)_46%,rgba(5,5,7,0.78)_72%,rgba(5,5,7,0.99)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_95%_58%_at_50%_88%,rgba(5,5,7,0.94)_0%,rgba(5,5,7,0.4)_46%,transparent_74%)]"
        aria-hidden
      />
      <div className="feed-atmosphere z-[4]" aria-hidden />
      <div className="feed-light-sweep animate-light-sweep z-[5]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-[6] cinematic-grain opacity-[0.14]"
        aria-hidden
      />

      <div className="absolute left-[max(1rem,calc(env(safe-area-inset-left,0px)+4px))] right-[max(1rem,calc(env(safe-area-inset-right,0px)+4px))] top-[max(5.75rem,env(safe-area-inset-top)+4.75rem)] z-10 flex flex-wrap items-center gap-2">
        {isNewLot(lot.publishedAt) && (
          <span className="rounded-full border border-gold/35 bg-gold/[0.12] px-3 py-1 font-display text-[10px] font-medium uppercase tracking-[0.14em] text-gold-light shadow-[0_0_24px_rgba(200,169,81,0.12)]">
            Fresh drop
          </span>
        )}
        <span className="rounded-full border border-white/[0.08] bg-black/45 px-3 py-1 font-display text-[10px] font-medium uppercase tracking-[0.18em] text-white/75 backdrop-blur-md">
          {feedMoodForLot(lot)}
        </span>
        {lot.membres_only && (
          <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-black/55 px-2 py-1 font-mono text-[10px] text-gold backdrop-blur-md">
            <Lock className="h-3 w-3" aria-hidden />
            Inner circle
          </span>
        )}
      </div>

      <div className="absolute bottom-[max(8rem,calc(5.75rem+env(safe-area-inset-bottom,0px)))] right-[max(0.75rem,calc(env(safe-area-inset-right,0px)+8px))] z-30 flex flex-col items-center gap-5 md:bottom-32">
        <motion.button
          type="button"
          whileTap={{ scale: 1.18 }}
          transition={{ type: "spring", stiffness: 650, damping: 32, mass: 0.35 }}
          onClick={() => toggleLikeLot(lot.id)}
          className="flex touch-manipulation flex-col items-center gap-1 text-[var(--white)]"
          aria-label={liked ? "Remove from favorites" : "Save to favorites"}
          aria-pressed={liked}
        >
          <Heart
            className={cn(
              "h-8 w-8 drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]",
              liked && "fill-urgence text-urgence"
            )}
          />
        </motion.button>
        <button
          type="button"
          onClick={() => void share()}
          className="flex touch-manipulation flex-col items-center gap-1 text-[var(--white)] transition-opacity duration-100 active:opacity-70"
          aria-label="Share"
        >
          <Share2 className="h-7 w-7 drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]" />
        </button>
        <button
          type="button"
          onClick={() => {
            onExpand();
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate(30);
            }
          }}
          className="flex touch-manipulation flex-col items-center gap-1 text-[var(--white)] transition-opacity duration-100 active:opacity-70"
          aria-label="Full story"
        >
          <Info className="h-7 w-7 drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]" />
        </button>
      </div>

      <motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-[max(7rem,calc(5.5rem+env(safe-area-inset-bottom,0px)))] pt-36 sm:px-6 md:px-10">
        <div className="mx-auto max-w-xl min-w-0 pointer-events-auto">
          <h2 className="font-serif text-[clamp(1.85rem,6.4vw,2.95rem)] font-normal italic leading-[1.06] tracking-tight text-white text-balance drop-shadow-[0_4px_36px_rgba(0,0,0,0.92)]">
            {lot.titre}
          </h2>
          <p className="mt-3 font-display text-[15px] font-light leading-snug text-white/88 drop-shadow-[0_2px_22px_rgba(0,0,0,0.88)]">
            {lot.tagline}
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => {
                onExpand();
                if (typeof navigator !== "undefined" && navigator.vibrate) {
                  navigator.vibrate(50);
                }
              }}
              className="flex h-[3.25rem] flex-1 touch-manipulation items-center justify-center rounded-2xl bg-gradient-to-r from-gold-dark via-gold to-gold-light font-display text-[15px] font-medium tracking-tight text-void shadow-gold-glow transition-[opacity,transform,filter] duration-200 ease-out hover:brightness-[1.03] active:scale-[0.98] active:opacity-95"
            >
              Enter the moment
            </button>
            <Link
              href={`/concours/${lot.id}`}
              className="flex h-[3.25rem] touch-manipulation items-center justify-center rounded-2xl border border-white/[0.14] bg-black/50 px-5 font-display text-[14px] font-medium text-white backdrop-blur-md transition-[border-color,opacity,transform] duration-200 ease-out hover:border-gold/35 active:scale-[0.98] active:opacity-85"
            >
              See the story
            </Link>
          </div>

          <p className="mt-4 text-center font-display text-[11px] font-light tracking-wide text-white/38">
            Unlock from {formatUsd(lot.ticketPrice)}
            <span className="mx-2 text-white/25">·</span>
            <span className="text-white/28 line-through decoration-white/25">
              {formatUsd(lot.valeur)} experience value
            </span>
          </p>

          <p className="mt-4 text-center font-display text-[11px] font-light leading-relaxed text-gold/75">
            {pulseEmotional(lot)}
          </p>

          <p className="mt-2 text-center font-display text-[11px] font-light italic leading-snug text-white/55">
            {whisper}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
