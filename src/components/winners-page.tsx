"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Dices, ShieldCheck, Video } from "lucide-react";
import { LOTS } from "@/lib/data";
import { GoldButton } from "@/components/gold-button";
import { SiteFooter } from "@/components/site-footer";
import { formatUsd } from "@/lib/format-display";
import { BRAND } from "@/lib/brand";

const PRIZE_ROW_LABELS: Record<string, string> = {
  "vegas-travel-credit": "Vegas Travel Credit",
  "iphone-17-pro-max": "iPhone 17 Pro Max",
  "luxury-cruise-two": "Luxury Cruise for Two",
  "supercar-experience": "Supercar Experience",
};

const HOW_WINNERS_CHOSEN = [
  {
    icon: Dices,
    title: "Certified random draw",
    body: "Every winner is selected via Random.org, a certified third-party random number generator. No human intervention. Ever.",
  },
  {
    icon: Video,
    title: "Filmed and published",
    body: "Every draw is recorded. Every winner announcement is filmed. We post it all, so you can see it's real.",
  },
  {
    icon: ShieldCheck,
    title: "Verified identity",
    body: "Winners are verified before prizes are fulfilled. No anonymous claims. Real people. Real prizes.",
  },
];

const fade = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export function WinnersPage() {
  const activePrizes = LOTS.map((lot) => ({
    id: lot.id,
    label: PRIZE_ROW_LABELS[lot.id] ?? lot.titre,
    value: lot.valeur,
  }));

  return (
    <motion.div
      className="min-h-screen bg-[#030303] pb-[calc(7rem+env(safe-area-inset-bottom))] pt-[max(4.5rem,env(safe-area-inset-top)+3rem)] text-[var(--off-white)] lg:pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.header
        className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
        {...fade}
      >
        <div
          className="pointer-events-none absolute -top-20 left-1/2 h-48 w-[min(100vw,420px)] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-[90px]"
          aria-hidden
        />
        <h1 className="font-serif text-[clamp(2rem,8vw,3.25rem)] font-normal italic leading-[1.05] tracking-tight text-[var(--white)]">
          Winners
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-display text-sm font-light leading-relaxed text-[var(--muted)] sm:text-[15px]">
          Every draw is real. Every winner is verified. Every story is filmed.
        </p>
      </motion.header>

      {/* Invitation */}
      <motion.section
        className="relative mx-auto mt-12 max-w-2xl px-4 sm:mt-16 sm:px-6"
        aria-labelledby="invitation-heading"
        {...fade}
      >
        <motion.div
          className="rounded-3xl border border-gold/20 bg-gradient-to-b from-gold/[0.07] via-white/[0.03] to-transparent px-6 py-10 text-center shadow-[0_0_72px_-36px_rgba(200,169,81,0.22)] backdrop-blur-md sm:px-10 sm:py-12"
          {...fade}
        >
          <h2
            id="invitation-heading"
            className="font-display text-[clamp(1.5rem,5vw,2rem)] font-medium leading-snug tracking-tight text-[var(--white)]"
          >
            Be the first name on this page.
          </h2>
          <p className="mx-auto mt-5 max-w-md font-display text-sm font-light leading-relaxed text-[var(--muted)] sm:text-[15px]">
            No winners yet. The first drop is live.
            <br />
            Your name could be the one that starts it all.
          </p>
          <motion.div className="mt-8" {...fade}>
            <GoldButton asChild size="lg">
              <Link href="/">Enter a drop →</Link>
            </GoldButton>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* How winners are chosen */}
      <motion.section
        className="mx-auto mt-16 max-w-4xl px-4 sm:mt-20 sm:px-6"
        aria-labelledby="how-chosen-heading"
        {...fade}
      >
        <h2
          id="how-chosen-heading"
          className="text-center font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold"
        >
          How winners are chosen
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {HOW_WINNERS_CHOSEN.map((item, i) => (
            <motion.li
              key={item.title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-md sm:p-6"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gold/25 bg-gold/[0.08]">
                <item.icon className="h-5 w-5 text-gold/90" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-[15px] font-medium text-[var(--white)]">{item.title}</h3>
              <p className="mt-2 font-display text-[13px] font-light leading-relaxed text-[var(--muted)]">
                {item.body}
              </p>
            </motion.li>
          ))}
        </ul>
      </motion.section>

      {/* What's up for grabs */}
      <motion.section
        className="mx-auto mt-16 max-w-2xl px-4 sm:mt-20 sm:px-6"
        aria-labelledby="prizes-heading"
        {...fade}
      >
        <h2
          id="prizes-heading"
          className="text-center font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold"
        >
          What&apos;s up for grabs
        </h2>
        <ul className="mt-6 divide-y divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
          {activePrizes.map((prize, i) => (
            <motion.li
              key={prize.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
            >
              <Link
                href={`/concours/${prize.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-white/[0.04] sm:px-6"
              >
                <span className="font-display text-[14px] font-medium text-[var(--white)]">{prize.label}</span>
                <span className="shrink-0 font-mono text-sm text-gold">{formatUsd(prize.value)}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <GoldButton asChild variant="secondary" size="lg">
            <Link href="/">See all active drops →</Link>
          </GoldButton>
        </div>
      </motion.section>

      {/* Legal */}
      <motion.p
        className="mx-auto mt-16 max-w-2xl px-6 text-center font-display text-[11px] font-light leading-relaxed text-[var(--muted)]/90 sm:mt-20"
        {...fade}
      >
        All draws conducted via certified random selection.
        <br />
        No purchase necessary, free mail-in entry available for every contest.
        <br />
        Official rules published at{" "}
        <a
          href={`${BRAND.siteUrl}/rules`}
          className="text-gold/80 underline-offset-2 hover:text-gold hover:underline"
        >
          gaviom.com/rules
        </a>
      </motion.p>

      <motion.div className="mt-12" {...fade}>
        <SiteFooter />
      </motion.div>
    </motion.div>
  );
}
