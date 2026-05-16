"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Ticket, Sparkles, ChevronRight } from "lucide-react";
import { LOTS } from "@/lib/data";
import { CountdownTimerFeed } from "@/components/countdown-timer-feed";
import { pageVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { formatUsd } from "@/lib/format-display";

export default function MesTicketsPage() {
  const active = LOTS.slice(0, 2);

  return (
    <motion.div
      className="min-h-screen bg-void px-5 pb-app-nav pt-[max(5rem,env(safe-area-inset-top)+3.5rem)]"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <h1 className="font-display text-2xl font-medium text-[var(--white)]">My entries</h1>
      <p className="mt-2 font-display text-sm text-[var(--muted)]">
        Your locker for active drops and history (demo).
      </p>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Active entries", value: "12", mono: true },
          { label: "Drops followed", value: "4", mono: true },
          { label: "Wins incoming", value: "2", mono: true },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <p className="font-display text-xs text-[var(--muted)]">{s.label}</p>
            <p
              className={cn(
                "mt-1 text-2xl text-gold",
                s.mono && "font-mono font-medium"
              )}
            >
              {s.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="flex items-center gap-2 font-display text-sm font-medium uppercase tracking-wide text-gold">
          <Ticket className="h-4 w-4" />
          In play
        </h2>
        <ul className="mt-4 space-y-3">
          {active.map((lot) => (
            <li
              key={lot.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-lg italic text-[var(--white)]">{lot.titre}</p>
                  <p className="mt-1 font-mono text-xs text-[var(--muted)]">
                    {formatUsd(lot.ticketPrice)} × your entries
                  </p>
                </div>
                <Link
                  href={`/concours/${lot.id}`}
                  className="shrink-0 rounded-full border border-[var(--border)] p-2 text-[var(--muted)] hover:border-gold/40 hover:text-gold"
                  aria-label="Open experience"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-3 max-w-xs">
                <CountdownTimerFeed endDate={lot.endDate} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-sm font-medium uppercase tracking-wide text-[var(--muted)]">History</h2>
        <p className="mt-2 font-display text-sm text-[var(--muted)]">
          Past closes will appear here with serial-style entry IDs and proof of participation.
        </p>
      </section>

      <Link
        href="/profil"
        className="mt-12 flex items-center justify-between rounded-2xl border border-gold/25 bg-gold/10 px-4 py-4 text-[var(--white)] transition-colors hover:border-gold/40"
      >
        <span className="flex items-center gap-2 font-display text-sm font-medium">
          <Sparkles className="h-4 w-4 text-gold" />
          Upgrade Gaviom Club, members-only drops
        </span>
        <ChevronRight className="h-4 w-4 text-gold" />
      </Link>
    </motion.div>
  );
}
