"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

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
        No purchase is required to enter. You may submit one free entry by post, similar to operators like BOTB: send
        a{" "}
        <strong className={isConf ? "font-medium text-white/90" : "font-medium text-[var(--white)]/90"}>
          handwritten or typed postcard
        </strong>{" "}
        (not a letter in an envelope, a single card) including all of the following in clear block capitals or
        legible print:
      </p>
      <ul
        className={
          isConf
            ? "list-inside list-disc space-y-1.5 font-[family-name:var(--font-corpo-sans),system-ui,sans-serif] text-sm font-light text-white/55"
            : "list-inside list-disc space-y-1.5 font-display text-sm font-light text-[var(--muted)]"
        }
      >
        <li>Your full legal name</li>
        <li>Date of birth</li>
        <li>Email address and mobile number</li>
        <li>Full postal address (including postcode / ZIP)</li>
        <li>The exact contest title: « {contestTitle} »</li>
        <li>
          A unique sentence of at least ten words explaining{" "}
          <span className="italic">why you would like to win this prize</span> (do not copy a template, it must be your
          own words).
        </li>
      </ul>
      <p
        className={
          isConf
            ? "font-[family-name:var(--font-corpo-sans),system-ui,sans-serif] text-sm font-light text-white/55"
            : "font-display text-sm font-light leading-[1.65] text-[var(--muted)]"
        }
      >
        Mail your postcard to:
      </p>
      <address
        className={
          isConf
            ? "rounded-lg border border-[#C9A84C]/25 bg-[#1A1A1A] px-4 py-3 font-mono text-[12px] not-italic leading-relaxed text-white/90"
            : "rounded-xl border border-gold/20 bg-[var(--void)]/60 px-4 py-3 font-mono text-[12px] not-italic leading-relaxed text-[var(--white)]/90"
        }
      >
        Gaviom, Free Postal Entry (AMOE)
        <br />
        Contest Services
        <br />
        350 Fifth Avenue, Suite 4800
        <br />
        New York, NY 10118, USA
      </address>
      <p
        className={
          isConf
            ? "font-[family-name:var(--font-corpo-sans),system-ui,sans-serif] text-sm font-light leading-[1.65] text-white/55"
            : "font-display text-sm font-light leading-[1.65] text-[var(--muted)]"
        }
      >
        <strong className={isConf ? "text-white/85" : "text-[var(--white)]/85"}>Rules:</strong> one free postal entry
        per stamped postcard. Bulk or machine-generated mailings may be void. Entries must be{" "}
        <strong className={isConf ? "text-white/85" : "text-[var(--white)]/85"}>
          postmarked on or before {postalDeadline}
        </strong>{" "}
        (local post date). We are not responsible for late, lost, illegible, or undelivered mail. Postal entries receive
        the same chance of winning as paid online entries for this contest, subject to the official rules and
        eligibility.
      </p>
      <p
        className={
          isConf
            ? "font-mono text-[11px] leading-relaxed text-white/40"
            : "font-mono text-[11px] leading-relaxed text-[var(--muted)]"
        }
      >
        Tip: photograph your postcard before posting. Keep proof of postage.
      </p>
    </div>
  );
}

export function SubscriptionEntryPanel({ variant = "feed" }: { variant?: "feed" | "confirmation" }) {
  const linkBase =
    variant === "confirmation"
      ? "inline-flex h-11 items-center justify-center rounded-lg border px-5 font-[family-name:var(--font-corpo-sans),system-ui,sans-serif] text-sm font-medium transition-colors"
      : "inline-flex h-11 items-center justify-center rounded-xl border px-5 font-display text-sm font-medium transition-colors";

  return (
    <div className="space-y-4">
      <p
        className={
          variant === "confirmation"
            ? "font-[family-name:var(--font-corpo-sans),system-ui,sans-serif] text-sm font-light leading-[1.65] text-white/55"
            : "font-display text-sm font-light leading-[1.65] text-[var(--muted)]"
        }
      >
        Subscribe to Gaviom and receive recurring contest entries each billing period, ideal if you play across several
        drops. Your subscription is managed from your account; you can change or cancel according to the subscription
        terms. Eligibility and prize rules are the same as for other entry methods.
      </p>
      <p
        className={
          variant === "confirmation"
            ? "font-[family-name:var(--font-corpo-sans),system-ui,sans-serif] text-sm font-light text-white/55"
            : "font-display text-sm font-light text-[var(--muted)]"
        }
      >
        Subscription entries are credited automatically; you will see them alongside your other entries.
      </p>
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
          Manage subscription
        </Link>
        <Link
          href="/comment-ca-marche"
          className={cn(
            linkBase,
            variant === "confirmation"
              ? "border-white/15 text-white/60 hover:border-white/25 hover:text-white/85"
              : "border-[var(--border)] text-[var(--muted)] hover:border-white/20 hover:text-[var(--white)]"
          )}
        >
          How it works
        </Link>
      </div>
    </div>
  );
}
