"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { useFeedStore } from "@/stores/feed-store";
import { pageVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ProfilePersonalInfo } from "@/components/profile-personal-info";
import { BRAND } from "@/lib/brand";

const ProfileClubWaitlistDialog = dynamic(
  () =>
    import("@/components/profile-club-waitlist-dialog").then((m) => ({
      default: m.ProfileClubWaitlistDialog,
    })),
  { ssr: false }
);

export default function ProfilPage() {
  const soundEnabled = useFeedStore((s) => s.soundEnabled);
  const toggleSound = useFeedStore((s) => s.toggleSound);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const rowLinkClass =
    "flex w-full items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 text-left transition-colors hover:border-gold/30";

  return (
    <motion.div
      className="min-h-screen bg-void px-5 pb-app-nav pt-[max(5rem,env(safe-area-inset-top)+3.5rem)]"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <header>
        <h1 className="font-display text-2xl font-medium text-[var(--white)]">Profile</h1>
        <p className="mt-2 font-display text-sm text-[var(--muted)]">
          Your details, preferences, and member status, in one calm screen.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-0">
        <ProfilePersonalInfo />

        <section className="mt-6 border-t border-[var(--border)] pt-6" aria-labelledby="sound-heading">
          <h2 id="sound-heading" className="sr-only">
            Sound preference
          </h2>
          <button type="button" onClick={() => toggleSound()} className={cn(rowLinkClass)}>
            <div className="min-w-0">
              <span className="font-display text-sm text-[var(--white)]">
                Optional sound · subtle swoosh &amp; countdown tension
              </span>
              <p className="mt-1 font-display text-[11px] leading-relaxed text-[var(--muted)]">
                Plays during countdowns and draw reveals
              </p>
            </div>
            {soundEnabled ? (
              <Volume2 className="h-5 w-5 shrink-0 text-gold" aria-hidden />
            ) : (
              <VolumeX className="h-5 w-5 shrink-0 text-[var(--muted)]" aria-hidden />
            )}
          </button>
        </section>

        <section className="mt-6 border-t border-[var(--border)] pt-6">
          <Link href="/mes-tickets" className={cn(rowLinkClass)}>
            <div className="min-w-0">
              <span className="font-display text-sm text-[var(--white)]">My entries &amp; activity</span>
              <p className="mt-1 font-display text-[11px] leading-relaxed text-[var(--muted)]">
                View all your active and past contest entries
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-[var(--muted)]" aria-hidden />
          </Link>
        </section>

        <section className="mt-6 border-t border-[var(--border)] pt-6">
          <Link href="/corpo" className={cn(rowLinkClass, "border-gold/25 hover:border-gold/40")}>
            <div className="min-w-0">
              <span className="font-display text-sm font-medium text-gold">Gaviom Corpo</span>
              <p className="mt-1 font-display text-[11px] leading-relaxed text-[var(--muted)]">
                Bespoke programs for brands, volume, co-branding, annual calendars.
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-gold/80" aria-hidden />
          </Link>
        </section>

        <section className="mt-6 border-t border-[var(--border)] pt-6 pb-2">
          <div className="rounded-2xl border border-gold/20 bg-gold/5 p-4 sm:p-5">
            <p className="font-serif text-lg italic text-gold">{BRAND.membership}</p>
            <p className="mt-2 font-display text-sm leading-relaxed text-[var(--muted)]">
              Early access to locked drops in the feed, extended combo perks, and private experiences, the house list,
              digital-first.
            </p>
            <button
              type="button"
              onClick={() => setWaitlistOpen(true)}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light py-3 font-display text-sm font-medium text-void transition-opacity hover:opacity-95"
            >
              Join waitlist
            </button>
          </div>
        </section>
      </div>

      <ProfileClubWaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} />
    </motion.div>
  );
}
