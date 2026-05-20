"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { SUBSCRIPTION, subscriptionSavingsCopy } from "@/lib/conversion";
import { formatUsd } from "@/lib/format-display";

export function PostalEntryPanel({
  contestTitle,
  postalDeadline,
  variant = "feed",
}: {
  contestTitle: string;
  postalDeadline: string;
  variant?: "feed" | "confirmation";
}) {
  const isConf = variant === "confirmation";
  return (
    <div className="space-y-4">
      <p
        className={
          isConf
            ? "font-[family-name:var(--font-corpo-sans),system-ui,sans-serif] text-sm font-light leading-[1.65] text-white/55"
            : "font-display text-sm font-light leading-[1.65] text-[var(--muted)]"
        }
      >
        No purchase required. Mail one free entry on a postcard with your details and the contest title: «{" "}
        {contestTitle} ». Postmarked by {postalDeadline}.
      </p>
      <address
        className={
          isConf
            ? "rounded-lg border border-[#C9A84C]/25 bg-surface px-4 py-3 font-mono text-[12px] not-italic leading-relaxed text-white/90"
            : "rounded-xl border border-gold/20 bg-[var(--void)]/60 px-4 py-3 font-mono text-[12px] not-italic leading-relaxed text-[var(--white)]/90"
        }
      >
        Gaviom, Free Postal Entry (AMOE)
        <br />
        350 Fifth Avenue, Suite 4800
        <br />
        New York, NY 10118, USA
      </address>
      <p
        className={
          isConf
            ? "font-mono text-[11px] leading-relaxed text-white/40"
            : "font-mono text-[11px] leading-relaxed text-[var(--muted)]"
        }
      >
        Same odds as paid entries. See official rules for full AMOE requirements.
      </p>
    </div>
  );
}

export function SubscriptionEntryPanel({ variant = "feed" }: { variant?: "feed" | "confirmation" }) {
  const linkBase =
    variant === "confirmation"
      ? "inline-flex h-11 items-center justify-center rounded-lg border px-5 font-[family-name:var(--font-corpo-sans),system-ui,sans-serif] text-sm font-medium transition-colors"
      : "inline-flex h-11 items-center justify-center rounded-xl border px-5 font-display text-sm font-medium transition-colors";

  const perEntry = SUBSCRIPTION.monthlyPrice / SUBSCRIPTION.entriesPerMonth;

  return (
    <div className="space-y-4">
      <p
        className={
          variant === "confirmation"
            ? "font-[family-name:var(--font-corpo-sans),system-ui,sans-serif] text-sm font-light leading-[1.65] text-white/55"
            : "font-display text-sm font-light leading-[1.65] text-[var(--muted)]"
        }
      >
        {subscriptionSavingsCopy(5)} Get {SUBSCRIPTION.entriesPerMonth} automatic entries every contest for{" "}
        {formatUsd(SUBSCRIPTION.monthlyPrice)}/mo, about {formatUsd(perEntry)} per entry.
      </p>
      <ul
        className={
          variant === "confirmation"
            ? "space-y-2 text-sm text-white/70"
            : "space-y-2 text-sm text-[var(--muted)]"
        }
      >
        <li>✓ Never miss a draw</li>
        <li>✓ Cancel anytime</li>
        <li>✓ Same verified random draws</li>
      </ul>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Link
          href="/profil"
          className={cn(
            linkBase,
            variant === "confirmation"
              ? "border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C] hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/15"
              : "border-gold/35 bg-gold/10 text-gold hover:border-gold/55 hover:bg-gold/15"
          )}
        >
          Get {SUBSCRIPTION.label} →
        </Link>
      </div>
    </div>
  );
}
