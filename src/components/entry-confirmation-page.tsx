"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import {
  type EntryConfirmationPayload,
  formatCloseDateUS,
  mergeEntryPayload,
  readEntryFromLocalStorage,
} from "@/lib/entry-confirmation";
import { formatUsd } from "@/lib/format-display";
import { EntryWayTabListConfirmation, type EntryWayTab } from "@/components/entry-way-tab-list";
import { PostalEntryPanel, SubscriptionEntryPanel } from "@/components/entry-way-panels";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

const GOLD = "#C9A84C";
const GOLD_SOFT = "#E8C97A";
const BG = "#111111";
const TRACK = "#2A2A2A";

function serif() {
  return "font-[family-name:var(--font-corpo-serif),Georgia,serif]";
}

function emitEntryConfirmedGtag(entry: EntryConfirmationPayload, contestId: string) {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", "entry_confirmed", {
    method: entry.method,
    contest_id: contestId,
    entry_number: entry.entryNumber,
  });
}

function firstParam(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

function buildSearchParamsRecord(
  raw: Record<string, string | string[] | undefined>
): URLSearchParams {
  const sp = new URLSearchParams();
  for (const [k, val] of Object.entries(raw)) {
    const s = firstParam(val);
    if (s !== undefined && s !== "") sp.set(k, s);
  }
  return sp;
}

function getInitialEntry(
  contestId: string,
  raw: Record<string, string | string[] | undefined>
): EntryConfirmationPayload {
  const sp = buildSearchParamsRecord(raw);
  return mergeEntryPayload(contestId, sp, null);
}

function postalDeadlineEn(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

type Props = {
  contestId: string;
  searchParams: Record<string, string | string[] | undefined>;
  showAppleDisclaimer: boolean;
};

export function EntryConfirmationPage({ contestId, searchParams, showAppleDisclaimer }: Props) {
  const [confirmTab, setConfirmTab] = useState<EntryWayTab>("online");
  const [entry, setEntry] = useState<EntryConfirmationPayload>(() =>
    getInitialEntry(contestId, searchParams)
  );
  const [barPct, setBarPct] = useState(0);

  const spString = useMemo(() => JSON.stringify(searchParams), [searchParams]);
  const gtagSent = useRef(false);

  useEffect(() => {
    const sp = buildSearchParamsRecord(searchParams);
    const merged = mergeEntryPayload(contestId, sp, readEntryFromLocalStorage());
    setEntry(merged);
    if (!gtagSent.current) {
      gtagSent.current = true;
      emitEntryConfirmedGtag(merged, contestId);
    }
  }, [contestId, spString, searchParams]);

  useEffect(() => {
    setBarPct(0);
    if (!entry || entry.maxEntries <= 0) return;
    const pct = Math.min(100, (entry.totalEntries / entry.maxEntries) * 100);
    const t = window.setTimeout(() => setBarPct(pct), 80);
    return () => window.clearTimeout(t);
  }, [entry]);

  const shareEntry = useCallback(async () => {
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : BRAND.siteUrl;
    const url = `${origin}/concours/${contestId}`;
    const shareLine = `I’m in the running for ${entry.contestName} on ${BRAND.name}, ${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: BRAND.name, text: shareLine, url });
        return;
      } catch {
        /* user cancelled or share failed */
      }
    }
    try {
      await navigator.clipboard.writeText(shareLine);
      toast.message("Link copied", {
        duration: 1600,
        className: "border border-[#C9A84C]/40 bg-[#1A1A1A] text-[#C9A84C]",
      });
    } catch {
      toast.error("Couldn’t copy link");
    }
  }, [contestId, entry]);

  const copyEntryNumber = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(entry.entryNumber);
      toast.message("Entry number copied", {
        duration: 1600,
        className: "border border-[#C9A84C]/40 bg-[#1A1A1A] text-[#C9A84C]",
      });
    } catch {
      toast.error("Copy failed");
    }
  }, [entry]);

  const isPaid = entry.method === "paid";
  const closeLabel = formatCloseDateUS(entry.closeDate);

  const recapRows = useMemo(() => {
    const rows: [string, string, string][] = [
      ["concours", "Experience drop", entry.contestName],
    ];
    if (entry.ticketQty != null && entry.ticketQty > 0) {
      rows.push(["qty", "Passes purchased", String(entry.ticketQty)]);
    }
    if (entry.amountPaidUsd != null) {
      rows.push(["paid", "Amount paid", formatUsd(entry.amountPaidUsd)]);
    }
    if (entry.paymentMethod) {
      rows.push(["pm", "Payment method", entry.paymentMethod]);
    }
    rows.push(
      ["guess", "Your pick", entry.userGuess],
      ["close", "Closes", closeLabel],
      ["entry", "Entry number", entry.entryNumber]
    );
    return rows;
  }, [closeLabel, entry]);

  return (
    <div className="min-h-screen pb-16 text-[#FAFAF8]" style={{ backgroundColor: BG }}>
      <div className="mx-auto w-full max-w-[min(100vw-1rem,40rem)] px-5 pt-10 sm:max-w-2xl sm:px-8 sm:pt-14 md:max-w-3xl md:px-10">
        <EntryWayTabListConfirmation value={confirmTab} onChange={setConfirmTab} />

        {confirmTab === "online" && (
          <>
        {/* 1, Header */}
        <header className="text-center">
          <motion.div
            initial={{ scale: 0.82, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A84C]/35 bg-[#C9A84C]/10"
            aria-hidden
          >
            <Check className="h-7 w-7 text-[#C9A84C]" strokeWidth={2.2} aria-hidden />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(serif(), "mt-8 text-[2.25rem] font-light leading-tight tracking-[-0.02em] sm:text-4xl")}
          >
            {isPaid ? "You’re officially in the draw." : "Free entry confirmed."}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-white/[0.6]"
          >
            {isPaid ? (
              <>
                Your entry is on file · Number{" "}
                <span className="font-medium text-white/90">{entry.entryNumber}</span>
              </>
            ) : (
              <>
                Alternate entry method · Number{" "}
                <span className="font-medium text-white/90">{entry.entryNumber}</span>
              </>
            )}
          </motion.p>
        </header>

        {/* 2, Récap */}
        <section className="mt-12 rounded-lg border border-[#C9A84C]/20 bg-[#1A1A1A] p-6 sm:p-8">
          <dl className="space-y-5">
            {recapRows.map(([key, label, value]) => (
              <div key={key} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <dt className="shrink-0 text-[13px] text-white/50">{label}</dt>
                <dd className="flex flex-wrap items-center gap-2 text-left text-[14px] font-medium leading-snug text-white sm:max-w-[62%] sm:justify-end sm:text-right">
                  <span className={cn(key === "entry" && "break-all sm:ml-auto")}>{value}</span>
                  {key === "entry" && (
                    <button
                      type="button"
                      onClick={() => void copyEntryNumber()}
                      className="inline-flex rounded border border-white/15 p-1.5 text-[#C9A84C] transition-colors hover:border-[#C9A84C]/45 hover:bg-white/[0.04]"
                      aria-label="Copy entry number"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 3, Progression */}
        <section className="mt-10">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[15px] font-medium text-white/90">Entries logged</h2>
            <p className="text-[14px] font-medium tabular-nums text-[#C9A84C]">
              {entry.totalEntries} / {entry.maxEntries}
            </p>
          </div>
          <div className="mt-3 h-[6px] overflow-hidden rounded-[3px]" style={{ backgroundColor: TRACK }}>
            <div
              className="h-full max-w-full rounded-[3px] transition-[width] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: `${barPct}%`,
                background: `linear-gradient(90deg, ${GOLD} 0%, ${GOLD_SOFT} 100%)`,
              }}
            />
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-white/40">
            The drop locks at {entry.maxEntries} entries or on {closeLabel}, whichever comes first.
          </p>
        </section>

        {/* 4, Légal */}
        <section className="mt-14">
          <h2 className="text-center text-[11px] font-medium uppercase tracking-[0.22em] text-white/40">
            Legal & compliance
          </h2>
          <div className="mx-auto mt-4 h-px max-w-[200px] bg-[#C9A84C]/20" />

          <div
            className="mt-6 border-l-2 py-4 pl-4 text-[13px] leading-[1.7] text-white/[0.55]"
            style={{
              backgroundColor: "rgba(201, 168, 76, 0.05)",
              borderLeftColor: "rgba(201, 168, 76, 0.3)",
            }}
          >
            <p className="font-medium text-white/70">No purchase necessary to enter or win</p>
            <p className="mt-3">
              Open to eligible U.S. residents 18+ (void in CO, MD, NE, ND, VT, NJ, TN). A free alternative method of
              entry (AMOE) is available. Enter without purchase via the daily mini-game in the Gaviom app or the free
              mail-in form at gaviom.com/free-entry. Free entries carry the same odds of winning as paid entries.
            </p>
          </div>

          <p className="mt-5">
            <a
              href={`/rules/${encodeURIComponent(contestId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium text-[#C9A84C] underline-offset-4 hover:underline"
            >
              View full official rules →
            </a>
          </p>

          {showAppleDisclaimer && (
            <p className="mt-6 text-[11px] italic leading-relaxed text-white/30">
              This promotion is not sponsored, endorsed, or administered by Apple Inc.
            </p>
          )}
        </section>

        {/* 5, Actions */}
        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          {isPaid ? (
            <>
              <button
                type="button"
                onClick={() => void shareEntry()}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-lg bg-[#C9A84C] px-6 text-[14px] font-medium text-[#111] transition-opacity hover:opacity-90 sm:flex-none sm:min-w-[220px]"
              >
                Share my entry →
              </button>
              <Link
                href="/"
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-lg border border-[#C9A84C]/55 px-6 text-[14px] font-medium text-[#C9A84C] transition-colors hover:border-[#C9A84C] hover:bg-[#C9A84C]/08 sm:flex-none sm:min-w-[200px]"
              >
                View all drops
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/concours/${encodeURIComponent(contestId)}`}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-lg bg-[#C9A84C] px-6 text-center text-[14px] font-medium text-[#111] transition-opacity hover:opacity-90 sm:flex-none sm:min-w-[280px]"
              >
                Stack more entries, paid path
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-lg border border-[#C9A84C]/55 px-6 text-[14px] font-medium text-[#C9A84C] transition-colors hover:border-[#C9A84C] hover:bg-[#C9A84C]/08 sm:flex-none sm:min-w-[200px]"
              >
                Back to home
              </Link>
            </>
          )}
        </div>
          </>
        )}

        {confirmTab === "postal" && (
          <div
            className="rounded-lg border border-white/[0.1] bg-[#1A1A1A] p-6 sm:p-8"
            role="tabpanel"
            aria-label="Free postal entry"
          >
            <p className="font-[family-name:var(--font-corpo-sans),system-ui,sans-serif] text-[11px] font-medium uppercase tracking-[0.18em] text-[#C9A84C]/90">
              Free Postal Entry
            </p>
            <p className="mt-2 font-[family-name:var(--font-corpo-serif),Georgia,serif] text-xl font-light italic text-white/95">
              Free mail-in entry
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-white/45">
              Your online entry is already logged. This tab explains how someone else can submit a free postal AMOE on
              the same compliant model as leading US skill contests.
            </p>
            <div className="mt-6">
              <PostalEntryPanel
                contestTitle={entry.contestName}
                postalDeadline={postalDeadlineEn(entry.closeDate)}
                variant="confirmation"
              />
            </div>
            <button
              type="button"
              onClick={() => setConfirmTab("online")}
              className="mt-8 w-full rounded-lg border border-[#C9A84C]/35 py-3 text-[13px] font-medium text-[#C9A84C] transition-colors hover:border-[#C9A84C]/55 hover:bg-[#C9A84C]/08"
            >
              Back to confirmation
            </button>
          </div>
        )}

        {confirmTab === "subscription" && (
          <div
            className="rounded-lg border border-white/[0.1] bg-[#1A1A1A] p-6 sm:p-8"
            role="tabpanel"
            aria-label="Subscription"
          >
            <p className="font-[family-name:var(--font-corpo-sans),system-ui,sans-serif] text-[11px] font-medium uppercase tracking-[0.18em] text-[#C9A84C]/90">
              Subscription
            </p>
            <p className="mt-2 font-[family-name:var(--font-corpo-serif),Georgia,serif] text-xl font-light italic text-white/95">
              Membership entries
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-white/45">
              Subscription entries are separate from one-time purchases, manage them from your account dashboard.
            </p>
            <div className="mt-6">
              <SubscriptionEntryPanel variant="confirmation" />
            </div>
            <button
              type="button"
              onClick={() => setConfirmTab("online")}
              className="mt-8 w-full rounded-lg border border-[#C9A84C]/35 py-3 text-[13px] font-medium text-[#C9A84C] transition-colors hover:border-[#C9A84C]/55 hover:bg-[#C9A84C]/08"
            >
              Back to confirmation
            </button>
          </div>
        )}
      </div>

      {/* 6, Footer */}
      <footer className="mt-20 border-t border-[#C9A84C]/20 bg-[#0A0A0A] px-5 py-10 text-center">
        <p className="text-[11px] leading-relaxed text-white/30">
          © 2026 Gaviom · All rights reserved
          <br />
          Skill contest where legally permitted · Void in CO, MD, NE, ND, VT, NJ, TN
          <br />
          <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <a href={`/rules/${encodeURIComponent(contestId)}`} className="text-[#C9A84C]/70 hover:underline">
              gaviom.com/rules
            </a>
            <span aria-hidden className="text-white/20">
              ·
            </span>
            <Link href="/privacy" className="text-[#C9A84C]/70 hover:underline">
              gaviom.com/privacy
            </Link>
            <span aria-hidden className="text-white/20">
              ·
            </span>
            <Link href="/contact" className="text-[#C9A84C]/70 hover:underline">
              gaviom.com/contact
            </Link>
          </span>
        </p>
      </footer>
    </div>
  );
}
