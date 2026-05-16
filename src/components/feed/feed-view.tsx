"use client";

import { useEffect } from "react";
import { FeedTopBar } from "@/components/feed/feed-top-bar";
import { FeedContainer } from "@/components/feed/feed-container";
import { FeedMediaWarmup } from "@/components/feed/feed-media-warmup";
import { FeedSocialTicker } from "@/components/feed/feed-social-ticker";
import { FeedHowItWorksStrip } from "@/components/feed/feed-how-it-works-strip";
import { ContestDetailSheet } from "@/components/feed/contest-detail-sheet";
import { useFeedStore } from "@/stores/feed-store";
import { LOTS } from "@/lib/data";
import { cn } from "@/lib/utils";

function SlideDots() {
  const activeIndex = useFeedStore((s) => s.activeIndex);
  return (
    <div
      className="pointer-events-none fixed right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2 max-[380px]:right-2"
      aria-hidden
    >
      {LOTS.map((lot, i) => (
        <span
          key={lot.id}
          className={cn(
            "h-2 w-2 rounded-full transition-colors",
            i === activeIndex ? "bg-gold" : "bg-[var(--ghost)]"
          )}
        />
      ))}
    </div>
  );
}

export function FeedView() {
  const setActiveIndex = useFeedStore((s) => s.setActiveIndex);
  const detailLotId = useFeedStore((s) => s.detailLotId);

  useEffect(() => {
    setActiveIndex(0);
  }, [setActiveIndex]);

  return (
    <div className="relative min-h-[100dvh] bg-void">
      <FeedMediaWarmup />
      <FeedTopBar />
      <FeedSocialTicker />
      <FeedHowItWorksStrip />
      <FeedContainer />
      <SlideDots />
      {detailLotId ? <ContestDetailSheet /> : null}
    </div>
  );
}
