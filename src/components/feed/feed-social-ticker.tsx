"use client";

import { FEED_WINNER_TICKER_LINES } from "@/lib/data";
import { cn } from "@/lib/utils";

function TickerRow({ suffix }: { suffix: string }) {
  return (
    <>
      {FEED_WINNER_TICKER_LINES.map((line) => (
        <span
          key={`${suffix}-${line}`}
          className="whitespace-nowrap font-display text-[10px] font-medium uppercase tracking-[0.22em] text-white/45"
        >
          {line}
        </span>
      ))}
    </>
  );
}

export function FeedSocialTicker({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed left-0 right-0 top-[calc(env(safe-area-inset-top)+3.25rem)] z-[38] overflow-hidden border-b border-white/[0.05] bg-black/35 backdrop-blur-md",
        className
      )}
      role="region"
      aria-label="Recent verified winners"
    >
      <div className="flex w-max animate-marquee gap-16 py-2 pl-4">
        <TickerRow suffix="a" />
        <TickerRow suffix="b" />
      </div>
    </div>
  );
}
