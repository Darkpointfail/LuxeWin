"use client";

import { SITE_VALUE_PROP } from "@/lib/site-copy";
import { cn } from "@/lib/utils";

/** One-line product clarity under the winners ticker on the home feed. */
export function FeedValuePropStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed left-0 right-0 top-[calc(env(safe-area-inset-top)+6.65rem)] z-[37] border-b border-white/[0.06] bg-void/90 backdrop-blur-md",
        className
      )}
      role="note"
    >
      <p className="px-3 py-2 text-center font-display text-[10px] font-medium uppercase tracking-[0.14em] text-luxe-offwhite/85 sm:text-[11px] sm:tracking-[0.16em]">
        {SITE_VALUE_PROP}
      </p>
    </div>
  );
}
