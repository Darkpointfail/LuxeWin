"use client";

import { cn } from "@/lib/utils";

export type EntryWayTab = "online" | "postal" | "subscription";

const TABS: { id: EntryWayTab; label: string }[] = [
  { id: "online", label: "Pay online" },
  { id: "postal", label: "Free mail-in" },
  { id: "subscription", label: "Membership" },
];

type EntryWayTabListProps = {
  value: EntryWayTab;
  onChange: (tab: EntryWayTab) => void;
  className?: string;
};

export function EntryWayTabList({ value, onChange, className }: EntryWayTabListProps) {
  return (
    <div
      role="tablist"
      aria-label="Ways to enter this draw"
      className={cn(
        "flex w-full gap-0 rounded-t-lg border border-[var(--border)] border-b-0 bg-[var(--void)]/50 p-1 sm:p-1.5",
        className
      )}
    >
      {TABS.map((tab) => {
        const selected = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              "min-h-[44px] flex-1 touch-manipulation rounded-md px-1.5 py-2.5 text-center font-display text-[10px] font-medium uppercase leading-snug tracking-wide transition-colors sm:px-2 sm:text-[11px]",
              selected
                ? "bg-[var(--surface-raised)] text-gold shadow-[inset_0_-2px_0_0_rgba(200,169,81,0.85)]"
                : "text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--white)]/80"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export function EntryWayTabListConfirmation({
  value,
  onChange,
  className,
}: {
  value: EntryWayTab;
  onChange: (tab: EntryWayTab) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Entry method and confirmation"
      className={cn("mb-8 flex w-full gap-0 rounded-lg border border-white/[0.12] bg-[#161616] p-1", className)}
    >
      {TABS.map((tab) => {
        const selected = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={cn(
              "min-h-[44px] flex-1 rounded-md px-2 py-2.5 text-center font-[family-name:var(--font-corpo-sans),system-ui,sans-serif] text-[10px] font-medium uppercase tracking-[0.12em] transition-colors sm:text-[11px]",
              selected
                ? "bg-[#1A1A1A] text-[#C9A84C] shadow-[inset_0_-2px_0_0_#C9A84C]"
                : "text-white/45 hover:bg-white/[0.04] hover:text-white/75"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
