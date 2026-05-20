"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PrizeCarouselItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { preloadCarouselItems } from "@/lib/prize-carousel-media";

const AUTO_MS = 3600;
const SWIPE_THRESHOLD = 48;

type Props = {
  items: PrizeCarouselItem[];
  isActive: boolean;
  priority?: boolean;
  className?: string;
  onIndexChange?: (index: number) => void;
};

export function PrizeMediaCarousel({
  items,
  isActive,
  priority = false,
  className,
  onIndexChange,
}: Props) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const len = Math.max(1, items.length);
  const multi = len > 1;
  const safeIndex = ((index % len) + len) % len;
  const active = items[safeIndex] ?? items[0]!;

  const go = useCallback(
    (next: number) => {
      if (!multi) return;
      const i = ((next % len) + len) % len;
      setIndex(i);
      onIndexChange?.(i);
      preloadCarouselItems(items, i);
    },
    [items, len, multi, onIndexChange]
  );

  const next = useCallback(() => go(safeIndex + 1), [go, safeIndex]);
  const prev = useCallback(() => go(safeIndex - 1), [go, safeIndex]);

  useEffect(() => {
    if (!multi || !isActive) return;
    const id = window.setInterval(next, AUTO_MS);
    return () => window.clearInterval(id);
  }, [multi, isActive, next]);

  useEffect(() => {
    if (isActive) preloadCarouselItems(items, safeIndex);
  }, [isActive, items, safeIndex]);

  useEffect(() => {
    onIndexChange?.(safeIndex);
  }, [safeIndex, onIndexChange]);

  if (!items.length) return null;

  return (
    <div
      className={cn("absolute inset-0 z-0 touch-pan-y", className)}
      aria-roledescription="carousel"
      aria-label="Prize gallery"
      onPointerDown={(e) => {
        if (!multi) return;
        touchStart.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        if (!multi || !touchStart.current) return;
        const dx = e.clientX - touchStart.current.x;
        const dy = e.clientY - touchStart.current.y;
        touchStart.current = null;
        if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) next();
        else prev();
      }}
    >
      {/* Media stack — CSS crossfade (reliable vs AnimatePresence) */}
      <div className="absolute inset-0 overflow-hidden bg-void">
        {items.map((item, i) => (
          <motion.div
            key={item.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-[900ms] ease-out",
              i === safeIndex ? "z-[1] opacity-100" : "z-0 opacity-0"
            )}
            aria-hidden={i !== safeIndex}
          >
            {item.type === "video" ? (
              <video
                className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-center"
                src={item.src}
                muted
                loop
                playsInline
                autoPlay={isActive && i === safeIndex}
                preload="metadata"
              />
            ) : (
              <motion.div
                className="absolute inset-0"
                animate={i === safeIndex && isActive ? { scale: 1.08 } : { scale: 1.04 }}
                transition={{ duration: AUTO_MS / 1000 + 0.4, ease: "linear" }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  priority={priority && i === 0}
                  sizes="100vw"
                  unoptimized
                  className="object-cover object-center"
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Cinematic overlays */}
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_right,rgba(0,0,0,0.78),rgba(0,0,0,0.45),rgba(0,0,0,0.75))]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.55)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(20,18,16,0.5)_0%,rgba(20,18,16,0.06)_40%,rgba(20,18,16,0.55)_72%,rgba(20,18,16,0.94)_100%)]"
        aria-hidden
      />

      {active.label ? (
        <span className="pointer-events-none absolute left-4 top-[max(7.25rem,calc(env(safe-area-inset-top)+6.25rem))] z-[6] rounded-full border border-white/10 bg-black/35 px-2.5 py-1 font-display text-[9px] font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
          {active.label}
        </span>
      ) : null}

    </div>
  );
}
