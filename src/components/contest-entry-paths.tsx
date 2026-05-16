"use client";

import { useState } from "react";
import { CountdownTimerFeed } from "@/components/countdown-timer-feed";
import { TicketProgress } from "@/components/ticket-progress";
import { GoldButton } from "@/components/gold-button";
import { EntryWayTabList, type EntryWayTab } from "@/components/entry-way-tab-list";
import { PostalEntryPanel, SubscriptionEntryPanel } from "@/components/entry-way-panels";
import { formatUsd } from "@/lib/format-display";
import { cn } from "@/lib/utils";

const DEFAULT_QTY = [1, 3, 5, 10] as const;

function formatPostalDeadline(end: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(end);
}

type ContestEntryPathsProps = {
  contestId: string;
  contestTitle: string;
  endDate: Date;
  ticketsTotal: number;
  ticketsSold: number;
  ticketPrice: number;
  selectedQty: number;
  onTicketsChange: (n: number) => void;
  onOnlineConfirm: () => void;
  quantities?: readonly number[];
  bonusNote?: string | null;
  onlineCtaLabel?: string;
  entryTab?: EntryWayTab;
  onEntryTabChange?: (tab: EntryWayTab) => void;
  variant?: "default" | "luxe";
  hideTitleBlock?: boolean;
  className?: string;
  rootId?: string | null;
};

export function ContestEntryPaths({
  contestId,
  contestTitle,
  endDate,
  ticketsTotal,
  ticketsSold,
  ticketPrice,
  selectedQty,
  onTicketsChange,
  onOnlineConfirm,
  quantities = DEFAULT_QTY,
  bonusNote,
  onlineCtaLabel = "Confirm",
  entryTab: entryTabProp,
  onEntryTabChange,
  variant = "default",
  hideTitleBlock = false,
  className,
  rootId,
}: ContestEntryPathsProps) {
  const [uncontrolledTab, setUncontrolledTab] = useState<EntryWayTab>("online");
  const tab = entryTabProp ?? uncontrolledTab;
  const setTab = onEntryTabChange ?? setUncontrolledTab;

  const totalFormatted = formatUsd(selectedQty * ticketPrice);
  const postalDeadline = formatPostalDeadline(endDate);
  const luxe = variant === "luxe";

  const panelAria =
    tab === "online"
      ? "Paid online entry"
      : tab === "postal"
        ? "Free mail-in entry"
        : "Membership entry";

  return (
    <div
      className={cn("space-y-3", className)}
      id={rootId === null ? undefined : (rootId ?? "ways-to-enter")}
    >
      {!hideTitleBlock && (
        <div className="pb-1">
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
            Step into this drop
          </p>
          <p className="mt-1 font-display text-xs text-[var(--muted)]">
            Online checkout, complimentary mail-in option, or membership paths, every route stays documented.
          </p>
        </div>
      )}

      <EntryWayTabList value={tab} onChange={setTab} />

      <div
        role="tabpanel"
        aria-label={panelAria}
        className={cn(
          "rounded-b-2xl border border-t-0 p-5 sm:p-6",
          luxe
            ? "border-white/[0.08] bg-white/[0.03] backdrop-blur-md shadow-none"
            : "border-[var(--border)] bg-[var(--surface-raised)]/90 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.6)]"
        )}
      >
        {tab === "online" && (
          <div className="space-y-5">
            <p className="font-display text-sm font-light leading-relaxed text-[var(--muted)]">
              You’ll pick card, Apple Pay, Google Pay, or PayPal on the next screen, then confirm.
            </p>

            <div
              className={cn(
                "space-y-4 rounded-xl border p-4",
                luxe
                  ? "border-white/[0.08] bg-[var(--surface)]/75 backdrop-blur-md"
                  : "border-[var(--border)]/80 bg-[var(--void)]/40"
              )}
            >
              <CountdownTimerFeed endDate={endDate} variant={luxe ? "luxe" : "default"} />
              <TicketProgress sold={ticketsSold} total={ticketsTotal} variant={luxe ? "luxe" : "default"} />
            </div>

            <p className="font-display text-[12px] font-medium leading-snug text-[var(--muted)]">
              How many tickets do you want?
            </p>
            <div className="flex flex-wrap gap-2">
              {quantities.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onTicketsChange(n)}
                  className={cn(
                    "min-h-11 min-w-11 rounded-xl border font-mono text-sm transition-colors",
                    luxe && "transition-all duration-200",
                    selectedQty === n
                      ? luxe
                        ? "border-gold/55 bg-gold/12 text-gold-light shadow-[0_0_0_1px_rgba(200,169,81,0.15)]"
                        : "border-info/50 bg-info/15 text-info"
                      : luxe
                        ? "border-white/[0.1] text-[var(--muted)] hover:border-gold/25 hover:text-[var(--white)]"
                        : "border-[var(--border)] text-[var(--muted)] hover:border-white/25 hover:text-[var(--white)]"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>

            <div
              className={cn(
                "flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-end sm:justify-between",
                luxe ? "border-white/[0.08]" : "border-[var(--border)]/70"
              )}
            >
              <div>
                <p className="font-mono text-xs text-[var(--muted)]">Total</p>
                <p className="font-mono text-2xl font-medium text-gold">{totalFormatted}</p>
                <p className="mt-1 font-mono text-[10px] text-[var(--muted)]">
                  Draw ref. · <span className="text-[var(--white)]/80">{contestId}</span>
                </p>
              </div>
              <GoldButton
                type="button"
                className={cn("w-full shrink-0 sm:w-auto", luxe && "shadow-gold-glow")}
                size={luxe ? "lg" : "default"}
                onClick={onOnlineConfirm}
              >
                {onlineCtaLabel}
              </GoldButton>
            </div>
            {bonusNote ? (
              <p className="text-center font-mono text-[11px] font-medium text-safe">{bonusNote}</p>
            ) : null}
            {luxe ? (
              <p className="text-center font-display text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                Verified outcomes · Secure rails · Results you can replay
              </p>
            ) : null}
          </div>
        )}

        {tab === "postal" && (
          <PostalEntryPanel contestTitle={contestTitle} postalDeadline={postalDeadline} variant="feed" />
        )}

        {tab === "subscription" && <SubscriptionEntryPanel variant="feed" />}
      </div>
    </div>
  );
}
