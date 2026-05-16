"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  containerVariants,
  pageVariants,
  cardVariants,
} from "@/lib/motion";
import type { ConcourClient, Temoignage } from "@/lib/data";
import { PARTENAIRES } from "@/lib/data";
import { GoldButton } from "@/components/gold-button";
import { ConcourCard } from "@/components/concour-card";
import { HeroConcoursCarousel } from "@/components/hero-concours-carousel";
import { CinematicHero } from "@/components/cinematic-hero";
import { CategoryRail } from "@/components/category-rail";
import { WinningCallSection } from "@/components/winning-call-section";
import { StoriesSevenEuro } from "@/components/stories-seven-euro";
import { GamificationTeaser } from "@/components/gamification-teaser";
import { SiteFooter } from "@/components/site-footer";
import { cn } from "@/lib/utils";
import { formatUsd } from "@/lib/format-display";

type Props = {
  concours: ConcourClient[];
  testimonials: Temoignage[];
};

function useSalesSimulation(
  initial: Record<string, number>,
  caps: Record<string, number>
) {
  const [sales, setSales] = useState(initial);

  useEffect(() => {
    const tick = () => {
      setSales((prev) => {
        const ids = Object.keys(prev);
        const id = ids[Math.floor(Math.random() * ids.length)]!;
        const cap = caps[id] ?? 0;
        const delta = Math.floor(Math.random() * 3) + 1;
        const sign = Math.random() > 0.14 ? 1 : -1;
        const next = Math.min(cap, Math.max(0, prev[id]! + sign * delta));
        return { ...prev, [id]: next };
      });
    };
    const schedule = () => 8000 + Math.floor(Math.random() * 7000);
    let id: ReturnType<typeof setTimeout>;
    const loop = () => {
      id = setTimeout(() => {
        tick();
        loop();
      }, schedule());
    };
    loop();
    return () => clearTimeout(id);
  }, [caps]);

  return sales;
}

function StepIcon({ variant }: { variant: 1 | 2 | 3 }) {
  const common = "h-12 w-12 text-gold";
  if (variant === 1) {
    return (
      <svg viewBox="0 0 48 48" className={common} aria-hidden>
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M16 24h16M24 16v16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (variant === 2) {
    return (
      <svg viewBox="0 0 48 48" className={common} aria-hidden>
        <rect
          x="12"
          y="14"
          width="24"
          height="18"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M18 26h12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className={common} aria-hidden>
      <path
        d="M14 28l8 8 16-20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="24"
        cy="24"
        r="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.35"
      />
    </svg>
  );
}

function AnimatedStat({ value }: { value: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(value * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-5xl font-bold italic text-gold md:text-7xl">
      {display.toLocaleString("en-US")}
    </span>
  );
}

export function HomeView({ concours, testimonials }: Props) {
  const caps = useMemo(
    () =>
      Object.fromEntries(concours.map((c) => [c.id, c.ticketsTotal])) as Record<
        string,
        number
      >,
    [concours]
  );
  const initialSales = useMemo(
    () =>
      Object.fromEntries(concours.map((c) => [c.id, c.ticketsSold])) as Record<
        string,
        number
      >,
    [concours]
  );
  const sales = useSalesSimulation(initialSales, caps);

  const [heroSlide, setHeroSlide] = useState(0);
  const activeHero = concours[heroSlide] ?? concours[0]!;

  const stepsRef = useRef(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="bg-luxe-black text-luxe-offwhite"
    >
      <CinematicHero />

      <CategoryRail />

      <section className="relative overflow-x-hidden bg-gradient-to-b from-luxe-black via-luxe-black to-luxe-charcoal/90 py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-2 sm:px-4">
          <HeroConcoursCarousel
            concours={concours}
            sales={sales}
            onSlideChange={setHeroSlide}
          />
        </div>
      </section>

      <section
        ref={stepsRef}
        className="noise-overlay border-t border-white/5 bg-luxe-charcoal py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold/75">
            Three moves
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold italic md:text-4xl">
            Simple as a swipe. Serious as a private club.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-luxe-offwhite/55">
            No jargon. No hollow hype. A clear path in, verified draws, and a real shot at the life you usually scroll past on someone else’s feed.
          </p>
          <motion.div
            className="mt-12 grid gap-10 md:grid-cols-3"
            initial="hidden"
            animate={stepsInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {[
              {
                t: "Pick your moment",
                d: "Watches, drives, suites, escapes, every card is a story you can step into.",
                i: 1 as const,
              },
              {
                t: "One entry, real odds",
                d: "Stack entries with full transparency. Every number is tracked. Every draw is verified.",
                i: 2 as const,
              },
              {
                t: "Someone always wins",
                d: "No vague postponements. A guaranteed close, and that someone could be you.",
                i: 3 as const,
              },
            ].map((s) => (
              <motion.div
                key={s.t}
                variants={cardVariants}
                className="rounded-2xl border border-white/10 bg-luxe-black/40 p-8"
              >
                <StepIcon variant={s.i} />
                <h3 className="mt-6 font-display text-xl font-bold italic">
                  {s.t}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-luxe-offwhite/65">
                  {s.d}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        id="concours"
        className="noise-overlay bg-luxe-black py-4 md:py-24"
      >
        <div className="md:mx-auto md:max-w-6xl md:px-6">
          <div className="px-6 pb-6 md:px-0">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold/75">
              Luxury trailers
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold italic md:text-4xl">
              Stay. Scroll. Let it pull you in.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-luxe-offwhite/55">
              Each card is a moodboard with a deadline, what matters is how it feels before you tap in.
            </p>
          </div>
          <motion.div
            className={cn(
              "flex flex-col gap-6 px-4 pb-10 md:grid md:grid-cols-2 md:gap-6 md:px-0 md:pb-0",
              "md:overflow-visible"
            )}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
          >
            {concours.map((c) => (
              <ConcourCard
                key={c.id}
                lot={{
                  id: c.id,
                  titre: c.titre,
                  ticketPrice: c.ticketPrice,
                  ticketsTotal: c.ticketsTotal,
                  image: c.image,
                  categorie: c.categorie,
                }}
                endDate={new Date(c.endDate)}
                ticketsSold={sales[c.id] ?? c.ticketsSold}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <WinningCallSection />

      <StoriesSevenEuro />

      <section className="noise-overlay border-t border-white/5 bg-luxe-charcoal py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold/75">
            They look like people you know
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold italic md:text-4xl">
            Everyday lives. Unforgettable wins.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-luxe-offwhite/55">
            No staged “luxury influencer” casting, real members so your brain does the quiet math: if them, why not me?
          </p>
          <div className="mt-8 flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {testimonials.map((t) => (
              <article
                key={t.id}
                className="min-w-[280px] max-w-[300px] flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-luxe-black/80 shadow-lg backdrop-blur-md"
              >
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={t.photo}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxe-black via-luxe-black/20 to-transparent" />
                </div>
                <div className="p-5">
                  <p className="text-sm font-medium text-white">{t.nom}</p>
                  <p className="text-xs text-gold">{t.lot}</p>
                  <p className="mt-3 text-sm leading-relaxed text-luxe-offwhite/80">
                    “{t.citation}”
                  </p>
                  <p className="mt-3 text-xs text-luxe-offwhite/40">{t.date}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="noise-overlay bg-luxe-black py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-luxe-offwhite/45">
            A community that keeps growing
          </p>
          <div className="mt-6 flex flex-col items-center gap-2">
            <AnimatedStat value={12847} />
            <p className="font-sans text-lg text-luxe-offwhite/70">
              stories that started with one small yes
            </p>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-40 grayscale">
            {PARTENAIRES.map((p) => (
              <span
                key={p}
                className="font-display text-lg font-semibold italic text-luxe-offwhite"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <GamificationTeaser />

      <SiteFooter />

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-luxe-black/90 p-3 backdrop-blur-md md:hidden">
        <GoldButton asChild className="w-full animate-glow-breathe">
          <Link href={`/concours/${activeHero.id}`}>
            Dream now, {formatUsd(activeHero.ticketPrice)}
          </Link>
        </GoldButton>
      </div>
    </motion.div>
  );
}
