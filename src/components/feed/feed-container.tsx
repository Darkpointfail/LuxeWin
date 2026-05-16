"use client";

import { useRef, useEffect, useCallback } from "react";
import { LOTS } from "@/lib/data";
import { ConcourSlide } from "@/components/feed/concour-slide";
import { useFeedStore } from "@/stores/feed-store";
import { preloadLotMedia } from "@/lib/feed-media";
import { cn } from "@/lib/utils";

export function FeedContainer({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIndex = useFeedStore((s) => s.activeIndex);
  const setActiveIndex = useFeedStore((s) => s.setActiveIndex);
  const openDetail = useFeedStore((s) => s.openDetail);
  const pendingScroll = useFeedStore((s) => s.pendingScroll);
  const clearPendingScroll = useFeedStore((s) => s.clearPendingScroll);

  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const h = el.clientHeight;
    const idx = Math.round(el.scrollTop / h);
    const clamped = Math.max(0, Math.min(LOTS.length - 1, idx));
    if (clamped !== activeIndex) setActiveIndex(clamped);
  }, [activeIndex, setActiveIndex]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    const next = LOTS[activeIndex + 1];
    if (next) preloadLotMedia(next);
  }, [activeIndex]);

  useEffect(() => {
    if (!pendingScroll) return;
    const el = containerRef.current;
    if (!el) return;
    const h = el.clientHeight;
    const idx = Math.max(
      0,
      Math.min(LOTS.length - 1, pendingScroll.index)
    );
    el.scrollTo({ top: idx * h, behavior: "smooth" });
    setActiveIndex(idx);
    clearPendingScroll();
  }, [pendingScroll, setActiveIndex, clearPendingScroll]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "snap-feed h-[100dvh] w-full overflow-y-auto overflow-x-hidden overscroll-y-contain",
        className
      )}
      style={{ scrollSnapType: "y mandatory" }}
    >
      {LOTS.map((lot, i) => (
        <ConcourSlide
          key={lot.id}
          lot={lot}
          slideIndex={i}
          activeIndex={activeIndex}
          isActive={i === activeIndex}
          onExpand={() => openDetail(lot.id)}
        />
      ))}
    </div>
  );
}
