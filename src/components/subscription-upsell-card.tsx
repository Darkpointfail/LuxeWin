"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { SUBSCRIPTION, subscriptionSavingsCopy } from "@/lib/conversion";
import { formatUsd } from "@/lib/format-display";
import { cn } from "@/lib/utils";

type Props = {
  lastPaidAmount?: number;
  className?: string;
};

export function SubscriptionUpsellCard({ lastPaidAmount = 5, className }: Props) {
  const perEntry = SUBSCRIPTION.monthlyPrice / SUBSCRIPTION.entriesPerMonth;

  return (
    <section
      className={cn(
        "rounded-2xl border border-gold/35 bg-gradient-to-b from-gold/[0.14] via-gold/[0.06] to-transparent p-6 sm:p-7",
        className
      )}
      aria-labelledby="sub-upsell-heading"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
          <Zap className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
            Upgrade your odds
          </p>
          <h2
            id="sub-upsell-heading"
            className="mt-1 font-display text-xl font-semibold leading-snug text-white"
          >
            {formatUsd(SUBSCRIPTION.monthlyPrice)}/mo , never miss a draw
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            {subscriptionSavingsCopy(lastPaidAmount)}
          </p>
          <ul className="mt-4 space-y-2 text-[13px] text-white/75">
            <li>✓ {SUBSCRIPTION.entriesPerMonth} automatic entries every contest</li>
            <li>✓ About {formatUsd(perEntry)} per entry vs one-offs</li>
            <li>✓ Cancel anytime from your account</li>
          </ul>
          <Link
            href="/profil"
            className="mt-5 flex min-h-[48px] w-full items-center justify-center rounded-xl bg-gold font-display text-sm font-bold uppercase tracking-[0.12em] text-void shadow-gold-glow transition-opacity hover:opacity-95 active:scale-[0.98]"
          >
            Start {SUBSCRIPTION.label} →
          </Link>
          <p className="mt-3 text-center text-[11px] text-white/45">
            No trap , upgrade only if it makes sense for you.
          </p>
        </div>
      </div>
    </section>
  );
}
