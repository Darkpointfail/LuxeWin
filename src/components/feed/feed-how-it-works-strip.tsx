"use client";

import Link from "next/link";
import { HOW_IT_WORKS_MICRO_LINE } from "@/lib/how-it-works-content";
import { cn } from "@/lib/utils";

/**
 * Sits under the winners ticker on the home feed so first-time visitors see the spine of the product
 * without leaving the runway.
 */
export function FeedHowItWorksStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed left-0 right-0 top-[calc(env(safe-area-inset-top)+5.55rem)] z-[37] border-b border-white/[0.06] bg-black/45 backdrop-blur-md",
        className
      )}
    >
      <div className="mx-auto flex max-w-lg items-center justify-center gap-x-2 gap-y-1 px-3 py-2 text-center sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
        <span className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/85">
          How it works
        </span>
        <span className="hidden text-white/25 sm:inline" aria-hidden>
          ·
        </span>
        <span className="max-w-[min(100%,20rem)] font-display text-[10px] font-light leading-snug text-white/52 sm:max-w-none">
          {HOW_IT_WORKS_MICRO_LINE}
        </span>
        <Link
          href="/comment-ca-marche"
          className="pointer-events-auto shrink-0 rounded-full border border-white/[0.1] bg-white/[0.06] px-2.5 py-1 font-display text-[10px] font-medium text-gold/95 transition-colors hover:border-gold/35 hover:bg-gold/[0.08]"
        >
          Full guide
        </Link>
      </div>
    </div>
  );
}
