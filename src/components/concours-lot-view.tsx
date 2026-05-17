"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  Lock,
  Shield,
  FileCheck,
  CreditCard,
  Headphones,
  Sparkles,
  Wine,
  Moon,
  Sun,
  UtensilsCrossed,
  Building2,
  CircleDot,
  Maximize2,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Lot } from "@/lib/types";
import type { LotSerialized } from "@/lib/lot-serde";
import { hydrateLot } from "@/lib/lot-serde";
import { lotHeroPhoto, lotUsesVideo } from "@/lib/lot-media";
import { lotFeedPoster, preloadLotMedia } from "@/lib/feed-media";
import { useFastAutoplayVideo } from "@/hooks/use-fast-autoplay-video";
import { LotPhotoHero } from "@/components/lot-photo-hero";
import { categorieLabel, drawTimelineForLotTitle } from "@/lib/data";
import { formatDrawDateUS, formatUsd } from "@/lib/format-display";
import { useRouter } from "next/navigation";
import { GoldButton } from "@/components/gold-button";
import { TravelPrizeDetails } from "@/components/travel-prize-details";
import { ContestEntryPaths } from "@/components/contest-entry-paths";
import type { EntryWayTab } from "@/components/entry-way-tab-list";
import { useSimulatedTickets } from "@/hooks/use-simulated-tickets";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Props = { serialized: LotSerialized };

function categoryPremiumLabel(c: Lot["categorie"]): string {
  if (c === "experience") return "Signature experience";
  return categorieLabel(c);
}

function availabilityRibbon(sold: number, total: number) {
  const r = total > 0 ? sold / total : 0;
  if (r >= 0.92) return { label: "Final spots remaining", key: "last" as const };
  if (r >= 0.72) return { label: "Almost sold out", key: "hot" as const };
  if (r <= 0.14) return { label: "New contest", key: "new" as const };
  return { label: "Entries open", key: "open" as const };
}

function formatDrawDateDisplay(d: Date): string {
  return formatDrawDateUS(d);
}

function sentencesOf(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function buildSensoryCards(lot: Lot): { title: string; body: string }[] {
  const s = sentencesOf(lot.description);
  if (lot.contestType === "travel") {
    const titles = ["Freedom to choose", "Credit value", "Twelve-month runway"];
    const b0 = s[0] ?? lot.description;
    const b1 = s[1] ?? b0;
    const b2 = s.slice(2).join(" ") || b0;
    return titles.map((title, i) => ({
      title,
      body: [b0, b1, b2][i] ?? lot.description,
    }));
  }
  if (lot.categorie === "experience") {
    const titles = ["The suite", "The dinner", "The night"];
    const b0 = s[0] ?? lot.description;
    const b1 = s[1] ?? b0;
    const b2 = s.slice(2).join(" ") || b0;
    return titles.map((title, i) => ({
      title,
      body: [b0, b1, b2][i] ?? lot.description,
    }));
  }
  const titles = ["The moment", "The texture", "The feeling"];
  return titles.map((title, i) => ({
    title,
    body: s[i] ?? lot.description,
  }));
}

function parseProgramLine(line: string): { time: string; title: string; detail: string } {
  const m12 = line.match(/^(\d{1,2}:\d{2}\s*(?:AM|PM))\s*[,–\-]\s*(.+)$/i);
  if (m12) {
    const rest = m12[2]!;
    const parts = rest.split(/\s*[,–\-]\s+/);
    if (parts.length >= 2) {
      return { time: m12[1]!, title: parts[0]!.trim(), detail: parts.slice(1).join(", ").trim() };
    }
    return { time: m12[1]!, title: rest.trim(), detail: "" };
  }
  const m24 = line.match(/^(\d{1,2}h\d{2})\s*[,–\-]\s*(.+)$/i);
  if (!m24) return { time: "", title: line, detail: "" };
  const rest = m24[2]!;
  const parts = rest.split(/\s*[,–\-]\s+/);
  if (parts.length >= 2) {
    return { time: m24[1]!, title: parts[0]!.trim(), detail: parts.slice(1).join(", ").trim() };
  }
  return { time: m24[1]!, title: rest.trim(), detail: "" };
}

function programIcon(title: string, detail: string): LucideIcon {
  const t = `${title} ${detail}`.toLowerCase();
  if (t.includes("morning") || t.includes("breakfast") || t.includes("matin") || t.includes("petit"))
    return Sun;
  if (t.includes("night") || t.includes("return") || t.includes("nuit") || t.includes("retour")) return Moon;
  if (t.includes("casino") || t.includes("soirée") || t.includes("evening")) return CircleDot;
  if (t.includes("dinner") || t.includes("dîner") || t.includes("diner")) return UtensilsCrossed;
  if (t.includes("champagne")) return Wine;
  if (t.includes("check") || t.includes("welcome") || t.includes("accueil") || t.includes("suite"))
    return Building2;
  return Sparkles;
}

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

function LotExperienceStory({
  lot,
  sensory,
}: {
  lot: Lot;
  sensory: { title: string; body: string }[];
}) {
  const intro =
    lot.contestType === "travel"
      ? lot.description
      : "A quiet story: harbor noise fades, light turns intimate, time bends to your rhythm. Nothing is accidental, only emotion, framed like cinema.";

  return (
    <motion.section className="space-y-6" {...fadeUp} aria-labelledby="story-heading">
      <h2
        id="story-heading"
        className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold"
      >
        The experience
      </h2>
      <p className="max-w-prose font-display text-sm font-light leading-relaxed text-[var(--muted)]">{intro}</p>
      <div className="grid gap-4 md:grid-cols-3">
        {sensory.map((card, i) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="group flex flex-col rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-5 transition-colors hover:border-gold/25"
          >
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/90">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 font-serif text-xl italic text-[var(--white)]">{card.title}</h3>
            <p className="mt-3 flex-1 font-display text-[13px] font-light leading-relaxed text-[var(--muted)]">
              {card.body}
            </p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

export function ConcoursLotView({ serialized }: Props) {
  const router = useRouter();
  const lot = useMemo(() => hydrateLot(serialized), [serialized]);
  const usesVideo = lotUsesVideo(lot);
  const heroPhoto = lotHeroPhoto(lot);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [sold] = useSimulatedTickets(lot.ticketsSold, lot.ticketsTotal);
  const [qty, setQty] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroPhotos = lot.media.photos.length > 0 ? lot.media.photos : [heroPhoto];
  const lightboxPushRef = useRef(false);
  const ignoreNextPopRef = useRef(false);
  const [entryTab, setEntryTab] = useState<EntryWayTab>("online");

  const remaining = Math.max(0, lot.ticketsTotal - sold);
  const ribbon = availabilityRibbon(sold, lot.ticketsTotal);
  const sensory = useMemo(() => buildSensoryCards(lot), [lot]);
  const drawsForPrize = useMemo(() => drawTimelineForLotTitle(lot.titre), [lot.titre]);
  const showTravelPrizeDetails =
    lot.contestType === "travel" &&
    typeof lot.travelCredit === "number" &&
    lot.travelCredit > 0;

  const mapHref =
    lot.location && `https://www.google.com/maps?q=${lot.location.lat},${lot.location.lng}`;

  useEffect(() => {
    if (usesVideo) preloadLotMedia(lot);
  }, [lot, usesVideo]);

  useFastAutoplayVideo(heroVideoRef, {
    src: usesVideo ? lot.media.videoUrl : undefined,
    active: usesVideo,
    playbackRate: lot.media.playbackRate ?? 1,
  });

  const lightboxOpenRef = useRef(false);

  useEffect(() => {
    lightboxOpenRef.current = lightboxOpen;
  }, [lightboxOpen]);

  const openLightbox = useCallback(() => {
    if (lightboxOpenRef.current) return;
    window.history.pushState({ gaviomLightbox: 1 }, "", window.location.href);
    lightboxPushRef.current = true;
    setLightboxOpen(true);
  }, []);

  const onLightboxOpenChange = useCallback((open: boolean) => {
    if (open) {
      setLightboxOpen(true);
      return;
    }
    const hadHistory = lightboxPushRef.current;
    lightboxPushRef.current = false;
    setLightboxOpen(false);
    if (hadHistory) {
      ignoreNextPopRef.current = true;
      window.history.back();
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      if (ignoreNextPopRef.current) {
        ignoreNextPopRef.current = false;
        return;
      }
      setLightboxOpen((wasOpen) => {
        if (!wasOpen) return wasOpen;
        lightboxPushRef.current = false;
        return false;
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const goToCheckout = useCallback(() => {
    router.push(`/concours/${lot.id}/checkout?qty=${qty}`);
  }, [lot.id, qty, router]);

  const entryPathsProps = {
    contestId: lot.id,
    contestTitle: lot.titre,
    endDate: lot.endDate,
    ticketsTotal: lot.ticketsTotal,
    ticketsSold: sold,
    ticketPrice: lot.ticketPrice,
    selectedQty: qty,
    onTicketsChange: setQty,
    onOnlineConfirm: goToCheckout,
    onlineCtaLabel: "Continue to payment" as const,
    variant: "luxe" as const,
    hideTitleBlock: true,
    entryTab,
    onEntryTabChange: setEntryTab,
    rootId: null,
  };

  return (
    <div className="min-h-screen bg-void pb-[calc(5.5rem+env(safe-area-inset-bottom))] text-[var(--off-white)] lg:pb-0">
      <div className="mx-auto flex max-w-[1680px] flex-col lg:h-[100dvh] lg:flex-row">
        {/* Galerie, sticky desktop, hero mobile */}
        <motion.aside
          className="relative flex w-full shrink-0 flex-col lg:sticky lg:top-0 lg:h-[100dvh] lg:w-[50%] lg:self-start"
        >
          <div className="relative min-h-[100svh] w-full overflow-hidden lg:min-h-0 lg:flex-1">
            <div className="absolute inset-0 bg-gradient-to-br from-surface via-transparent to-transparent" />
            {usesVideo ? (
              <video
                ref={heroVideoRef}
                className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
                src={lot.media.videoUrl}
                poster={lotFeedPoster(lot)}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
              />
            ) : (
              <motion.div
                key={heroPhotos[heroIndex]}
                className="absolute inset-0"
                initial={{ opacity: 0.92 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <LotPhotoHero
                  src={heroPhotos[heroIndex] ?? heroPhoto}
                  animate
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/40 to-void/10 lg:from-void/95 lg:via-void/35" />
            {!usesVideo ? (
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(3,3,3,0.9)_0%,transparent_65%)]"
                aria-hidden
              />
            ) : null}

            {!usesVideo && heroPhotos.length > 1 ? (
              <div className="pointer-events-auto absolute inset-x-0 bottom-20 z-10 flex gap-2 overflow-x-auto px-4 pb-1 lg:bottom-6 lg:px-6">
                {heroPhotos.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setHeroIndex(i)}
                    className={cn(
                      "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-colors",
                      i === heroIndex
                        ? "border-gold/60 ring-1 ring-gold/30"
                        : "border-white/15 opacity-70 hover:opacity-100"
                    )}
                    aria-label={`View photo ${i + 1}`}
                    aria-current={i === heroIndex}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            ) : null}

            <button
              type="button"
              onClick={openLightbox}
              className="pointer-events-auto absolute bottom-24 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-[var(--white)] backdrop-blur-md transition-colors hover:border-gold/40 hover:text-gold lg:bottom-8 lg:right-6"
              aria-label="View fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

        </motion.aside>

        {/* Colonne fiche */}
        <div className="flex min-h-0 w-full flex-1 flex-col border-t border-white/[0.06] lg:max-h-[100dvh] lg:w-[50%] lg:border-l lg:border-t-0">
          <div className="relative z-0 min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
            <div className="mx-auto max-w-xl space-y-12 px-5 pb-12 pt-8 lg:max-w-none lg:px-10 lg:pb-20 lg:pt-10 xl:pr-16">
              <motion.header className="space-y-8" {...fadeUp}>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 font-display text-xs font-medium tracking-wide text-white/40 transition-colors hover:text-gold"
                >
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  Back
                </Link>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-display text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
                    {categoryPremiumLabel(lot.categorie)}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 font-display text-[10px] font-medium uppercase tracking-[0.12em]",
                      ribbon.key === "last" && "border-gold/35 bg-gold/10 text-gold-light",
                      ribbon.key === "hot" && "border-gold/25 bg-gold/5 text-gold",
                      ribbon.key === "new" && "border-white/10 text-[var(--muted)]",
                      ribbon.key === "open" && "border-white/10 text-[var(--muted)]"
                    )}
                  >
                    {ribbon.label}
                  </span>
                  {lot.membres_only && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-gold/30 bg-black/40 px-2.5 py-1 font-mono text-[10px] text-gold">
                      <Lock className="h-3 w-3" aria-hidden />
                      Gaviom Club · Members
                    </span>
                  )}
                </div>

                <div className="grid gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-sm sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      Experience value
                    </p>
                    <p className="mt-1 font-serif text-2xl italic text-[var(--white)]">
                      {formatUsd(lot.valeur)}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      Entry from
                    </p>
                    <p className="mt-1 font-mono text-2xl font-medium text-gold">{formatUsd(lot.ticketPrice)}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      Spots left
                    </p>
                    <p className="mt-1 font-mono text-lg text-[var(--white)]">{remaining}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      Draw closes
                    </p>
                    <p className="mt-1 font-display text-sm font-light capitalize leading-snug text-[var(--white)]/90">
                      {formatDrawDateDisplay(lot.endDate)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="font-serif text-[clamp(2rem,4.5vw,3.25rem)] font-normal italic leading-[1.05] tracking-tight text-balance text-[var(--white)]">
                    {lot.titre}
                  </h1>
                  <p className="max-w-prose font-display text-base font-light leading-relaxed text-[var(--muted)]">
                    {lot.tagline}
                  </p>
                </div>
              </motion.header>

              <motion.section className="space-y-5" {...fadeUp} aria-labelledby="trust-heading">
                <h2
                  id="trust-heading"
                  className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold"
                >
                  Why members trust this draw
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      icon: FileCheck,
                      t: "Verified selection",
                      d: "Documented, auditable method, reproducible at close.",
                    },
                    {
                      icon: Shield,
                      t: "Limited entries",
                      d: "A fixed cap: every entry is counted and shown transparently.",
                    },
                    {
                      icon: CreditCard,
                      t: "Secure checkout",
                      d: "Encrypted flow, card-grade standards, zero theater.",
                    },
                    {
                      icon: Sparkles,
                      t: "Prize as described",
                      d: "What you see is what the winner receives, no opaque swaps.",
                    },
                    {
                      icon: Sparkles,
                      t: "Winner published",
                      d: "Official announcement, archived, no gray areas.",
                    },
                    {
                      icon: Headphones,
                      t: "Member support",
                      d: "Concierge team for questions before and after the draw.",
                    },
                  ].map((row) => (
                    <li
                      key={row.t}
                      className="flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm"
                    >
                      <row.icon className="mt-0.5 h-4 w-4 shrink-0 text-gold/80" aria-hidden />
                      <div>
                        <p className="font-display text-sm font-medium text-[var(--white)]">{row.t}</p>
                        <p className="mt-1 font-display text-xs font-light leading-relaxed text-[var(--muted)]">
                          {row.d}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {showTravelPrizeDetails ? (
                <>
                  <LotExperienceStory lot={lot} sensory={sensory} />
                  <motion.div {...fadeUp}>
                    <TravelPrizeDetails travelCredit={lot.travelCredit!} />
                  </motion.div>
                </>
              ) : null}

              {/* Participation : un seul bloc dans le scroll (mobile + desktop), évite l’écrasement du header sur grand écran */}
              <motion.section
                className="scroll-mt-8 space-y-4 lg:scroll-mt-10 lg:rounded-2xl lg:border lg:border-white/[0.08] lg:bg-surface/55 lg:p-8 lg:backdrop-blur-sm"
                {...fadeUp}
                aria-labelledby="buy-heading"
                id="participation"
              >
                <h2
                  id="buy-heading"
                  className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold"
                >
                  Enter the moment
                </h2>
                <ContestEntryPaths {...entryPathsProps} />
              </motion.section>

              {!showTravelPrizeDetails ? <LotExperienceStory lot={lot} sensory={sensory} /> : null}

              {lot.journeeType && lot.journeeType.length > 0 && (
                <motion.section className="space-y-6" {...fadeUp} aria-labelledby="program-heading">
                  <h2
                    id="program-heading"
                    className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold"
                  >
                    Sample itinerary
                  </h2>
                  <ol className="space-y-0">
                    {lot.journeeType.map((line, i) => {
                      const { time, title, detail } = parseProgramLine(line);
                      const Icon = programIcon(title, detail);
                      const isLast = i === lot.journeeType!.length - 1;
                      return (
                        <li key={`${i}-${line}`} className="relative flex gap-4 pb-10 last:pb-0">
                          <div className="relative z-[1] flex shrink-0 flex-col items-center">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface text-gold shadow-[0_0_0_3px_var(--void)]">
                              <Icon className="h-4 w-4" aria-hidden />
                            </span>
                          </div>
                          {!isLast ? (
                            <span
                              className="pointer-events-none absolute left-5 top-11 z-0 h-[calc(100%-2.75rem)] w-px bg-gradient-to-b from-white/15 to-white/5"
                              aria-hidden
                            />
                          ) : null}
                          <div className="min-w-0 flex-1 pt-0.5">
                            {time && (
                              <p className="font-mono text-[11px] uppercase tracking-wider text-gold/85">
                                {time}
                              </p>
                            )}
                            <p className="mt-1 font-display text-base font-medium text-[var(--white)]">{title}</p>
                            {detail && (
                              <p className="mt-1 max-w-md font-display text-xs font-light leading-relaxed text-[var(--muted)]">
                                {detail}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </motion.section>
              )}

              {lot.location && mapHref && (
                <motion.section className="space-y-3" {...fadeUp} aria-labelledby="place-heading">
                  <h2
                    id="place-heading"
                    className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold"
                  >
                    Location
                  </h2>
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm backdrop-blur-sm transition-colors hover:border-gold/30"
                  >
                    <span className="flex items-center gap-2 font-display font-medium text-[var(--white)]">
                      <MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                      {lot.location.ville}, {lot.location.pays}
                    </span>
                    <ExternalLink className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                  </a>
                </motion.section>
              )}

              <motion.section className="space-y-4" {...fadeUp} aria-labelledby="faq-heading">
                <h2
                  id="faq-heading"
                  className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold"
                >
                  FAQ
                </h2>
                <Accordion type="single" collapsible className="rounded-2xl border border-white/[0.08] px-4">
                  {[
                    {
                      q: "How does the draw work?",
                      a: "At the published close time, a fair random selection runs across every registered entry, online, mail-in, or membership, per the official rules.",
                    },
                    {
                      q: "When is the winner announced?",
                      a: "Within hours to a few days after close, results post on our official channels and the winner is contacted directly.",
                    },
                    {
                      q: "What if not every entry sells?",
                      a: "The draw still happens on schedule. Scarcity never delays transparency.",
                    },
                    {
                      q: "How is the prize delivered?",
                      a: "Our team coordinates with the winner: calendar, paperwork, and concierge support, tailored to the experience.",
                    },
                    {
                      q: "Can I buy multiple entries?",
                      a: "Yes, each entry is a separate chance. Your total scales with quantity; the prize value for the winner stays the same.",
                    },
                  ].map((item, idx) => (
                    <AccordionItem key={item.q} value={`faq-${idx}`} className="border-luxe-smoke/80">
                      <AccordionTrigger className="py-4 text-left font-display text-sm font-normal text-[var(--white)] hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="font-display text-sm font-light leading-relaxed text-[var(--muted)]">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.section>

              <motion.section className="space-y-5 pb-4" {...fadeUp} aria-labelledby="social-heading">
                <h2
                  id="social-heading"
                  className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-gold"
                >
                  Pulse on this drop
                </h2>
                <p className="font-display text-xs font-light text-[var(--muted)]">
                  Published winners for this prize, plus the live scoreboard. Nothing staged as fake alerts.
                </p>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-white/[0.06] bg-surface/50 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      Verified payout on record
                    </p>
                    {drawsForPrize.length ? (
                      <ul className="mt-3 space-y-2">
                        {drawsForPrize.map((d) => (
                          <li
                            key={d.id}
                            className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 text-[11px] leading-snug text-[var(--white)]/72"
                          >
                            <span className="font-medium text-[var(--white)]/90">{d.gagnantMasque}</span>
                            <span className="text-[var(--muted)]"> · </span>
                            {d.ville}
                            <span className="mt-1 block font-mono text-[10px] uppercase tracking-wide text-[var(--muted)]">
                              {d.date} · {d.participants.toLocaleString("en-US")} entrants ·{" "}
                              {d.statut === "remis" ? "Paid out" : "In progress"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 font-display text-[11px] font-light leading-relaxed text-[var(--muted)]">
                        No completed draw listed for this prize yet. See all fulfilled prizes on{" "}
                        <Link href="/gagnants" className="text-gold/90 underline-offset-2 hover:underline">
                          Winners
                        </Link>
                        .
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-white/[0.06] bg-surface/50 p-4">
                    <div className="flex items-end justify-between gap-2">
                      <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--muted)]">
                        Live board
                      </p>
                      <p className="font-mono text-[10px] text-[var(--muted)]">
                        {sold.toLocaleString("en-US")} entries secured
                      </p>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {lot.leaderboard.slice(0, 4).map((row, i) => (
                        <li
                          key={row.pseudo}
                          className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2 font-mono text-[11px]"
                        >
                          <span className="text-[var(--muted)]">#{i + 1}</span>
                          <span className="min-w-0 flex-1 truncate text-center text-[var(--white)]/90">
                            {row.pseudo}
                          </span>
                          <span className="shrink-0 text-gold/90">{row.tickets} entries</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 font-display text-[10px] font-light text-[var(--muted)]">
                      Identities masked, indicative ranking.
                    </p>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile : raccourci paiement lorsque l’onglet Payant est actif */}
      {entryTab === "online" ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-void/92 px-4 py-3 backdrop-blur-xl lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--muted)]">Total</p>
              <p className="font-mono text-lg font-medium text-gold">{formatUsd(qty * lot.ticketPrice)}</p>
            </div>
            <GoldButton type="button" className="min-w-[10rem] shrink-0" onClick={goToCheckout}>
              Continue to payment
            </GoldButton>
          </div>
        </div>
      ) : null}

      <Dialog open={lightboxOpen} onOpenChange={onLightboxOpenChange}>
        <DialogContent className="max-w-4xl overflow-visible border-white/10 bg-surface p-2 sm:p-4">
          <DialogTitle className="sr-only">Expanded view</DialogTitle>
          <motion.div className="relative z-0 aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/10">
            {usesVideo ? (
              <video
                className="h-full w-full object-contain"
                src={lot.media.videoUrl}
                controls
                playsInline
                autoPlay
              />
            ) : (
              <Image
                src={heroPhotos[heroIndex] ?? heroPhoto}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            )}
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
