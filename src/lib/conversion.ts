import type { Lot } from "@/lib/types";
import { formatUsd } from "@/lib/format-display";

/** Stable “today” entry count for social proof (not random per render). */
export function entriesTodayCount(lot: Lot): number {
  const seed = lot.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return Math.max(47, Math.floor(lot.ticketsSold * 0.14) + (seed % 120));
}

/** Hero line: "$39 to win $5,500" */
export function prizeValueHook(lot: Lot): string {
  return `${formatUsd(lot.ticketPrice)} to win ${formatUsd(lot.valeur)}`;
}

export const SUBSCRIPTION = {
  monthlyPrice: 19,
  entriesPerMonth: 3,
  label: "Gaviom Pass",
} as const;

export function subscriptionSavingsCopy(lastTicketSpend: number): string {
  const perEntry = SUBSCRIPTION.monthlyPrice / SUBSCRIPTION.entriesPerMonth;
  const saved = Math.max(0, lastTicketSpend - perEntry);
  if (saved < 1) {
    return `$${SUBSCRIPTION.monthlyPrice}/mo = ${SUBSCRIPTION.entriesPerMonth} auto-entries every draw. Never miss out.`;
  }
  return `You just spent ${formatUsd(lastTicketSpend)}. For ${formatUsd(SUBSCRIPTION.monthlyPrice)}/mo you get ${SUBSCRIPTION.entriesPerMonth} auto-entries per draw, that's ${formatUsd(perEntry)} each.`;
}
