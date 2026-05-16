"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  CheckCircle2,
  Headphones,
  MapPin,
  Shield,
  Sparkles,
  Ticket,
} from "lucide-react";
import {
  DRAW_TIMELINE_GAGNANTS,
  GAGNANTS_MOCK,
  GAGNANTS_PAGE_STATS,
  type Gagnant,
} from "@/lib/data";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GoldButton } from "@/components/gold-button";
import { SiteFooter } from "@/components/site-footer";
import { formatUsd, formatNumberEn } from "@/lib/format-display";

const EMOTIONAL_IMAGE =
  "https://images.unsplash.com/photo-1517245386807-bb43f82e33b4?w=1400&q=85";

function useAnimatedNumber(target: number, enabled: boolean, duration = 1.35) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [enabled, target, duration]);
  return value;
}

function StatBlock({
  label,
  children,
  delay = 0,
}: {
  label: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-5 py-4 text-center backdrop-blur-md sm:px-6 sm:py-5"
    >
      <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
        {label}
      </p>
      <div className="mt-2 font-serif text-2xl italic text-[var(--white)] sm:text-3xl">{children}</div>
    </motion.div>
  );
}

function WinnerCard({
  g,
  index,
  onSelect,
}: {
  g: Gagnant;
  index: number;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 120, damping: 28 });
  const springY = useSpring(my, { stiffness: 120, damping: 28 });
  const rotateX = useTransform(springY, [-40, 40], [3, -3]);
  const rotateY = useTransform(springX, [-40, 40], [-3, 3]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.08, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <motion.button
        type="button"
        onClick={onSelect}
        onPointerMove={(e) => {
          const el = ref.current;
          if (!el) return;
          const r = el.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width - 0.5) * 80;
          const py = ((e.clientY - r.top) / r.height - 0.5) * 80;
          mx.set(px);
          my.set(py);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] text-left shadow-[0_28px_80px_-48px_rgba(0,0,0,0.9)] transition-[border-color,box-shadow] duration-500 hover:border-gold/25 hover:shadow-[0_32px_90px_-44px_rgba(200,169,81,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/45 sm:rounded-3xl"
      >
        <motion.div
          ref={ref}
          style={{ rotateX, rotateY, transformPerspective: 1200 }}
          className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[4/5]"
        >
          <Image
            src={g.photo}
            alt=""
            fill
            className="object-cover object-[center_22%] transition-[transform,filter] duration-[1.1s] ease-out group-hover:scale-[1.04] group-hover:brightness-[1.04]"
            sizes="(max-width:640px) 100vw, 50vw"
            priority={index < 2}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/45 to-[#030303]/20" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-black/55 px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-wider text-gold-light shadow-[0_0_20px_rgba(200,169,81,0.15)] backdrop-blur-md">
              <CheckCircle2 className="h-3 w-3" aria-hidden />
              Verified moment
            </span>
          <div className="absolute bottom-0 left-0 right-0 space-y-1.5 p-5 sm:p-7">
            <p className="font-display text-lg font-medium text-[var(--white)] sm:text-xl">
              {g.nom}{" "}
              <span className="font-normal text-[var(--muted)]">, {g.ville}</span>
            </p>
            <p className="font-mono text-xs text-gold sm:text-sm">{g.lot}</p>
            <p className="line-clamp-3 font-display text-[13px] font-light leading-relaxed text-[var(--muted)]">
              « {g.temoignage} »
            </p>
          </div>
        </motion.div>
      </motion.button>
    </motion.article>
  );
}

function WinnerDetailModal({
  winner,
  open,
  onOpenChange,
}: {
  winner: Gagnant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!winner) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92vh,900px)] w-[min(calc(100vw-1.25rem),560px)] max-w-none overflow-y-auto border-white/[0.1] bg-[#0a0a0a] p-0 shadow-[0_0_0_1px_rgba(200,169,81,0.08),0_40px_100px_-40px_rgba(0,0,0,0.85)] sm:rounded-2xl">
        <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden sm:aspect-[16/10]">
          <Image src={winner.photo} alt="" fill className="object-cover object-top" sizes="560px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-gold/35 bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-gold backdrop-blur-md">
              Verified draw
            </span>
            <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1 font-mono text-[10px] text-[var(--muted)] backdrop-blur-md">
              Partial identity, editorial privacy
            </span>
          </div>
        </div>
        <div className="space-y-5 px-5 pb-8 pt-6 sm:px-8">
          <DialogTitle className="sr-only">Verified winner, {winner.nom}</DialogTitle>
          <div>
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/90">
              Gaviom verified winner
            </p>
            <h2 className="mt-2 font-serif text-2xl font-normal italic tracking-tight text-[var(--white)] sm:text-3xl">
              {winner.nom}
            </h2>
            <p className="mt-1 flex items-center gap-2 font-display text-sm text-[var(--muted)]">
              <MapPin className="h-3.5 w-3.5 text-gold/70" aria-hidden />
              {winner.ville}
            </p>
            <p className="mt-3 font-mono text-sm text-gold">{winner.lot}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Prize value", value: formatUsd(winner.valeurLot) },
              { label: "Entries held", value: String(winner.ticketsAchetes) },
              { label: "Pool size", value: formatNumberEn(winner.participants) },
              { label: "Draw date", value: winner.dateTirage },
            ].map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 text-center"
              >
                <p className="font-mono text-[9px] uppercase tracking-wide text-[var(--muted)]">{row.label}</p>
                <p className="mt-1 font-display text-sm font-medium text-[var(--white)]">{row.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/85">
              The win, in their words
            </p>
            <p className="mt-2 font-display text-sm font-light leading-relaxed text-[var(--muted)]">
              {winner.experienceVecue}
            </p>
          </div>

          <blockquote className="border-l-2 border-gold/40 pl-4 font-display text-sm font-light italic leading-relaxed text-[var(--off-white)]/90">
            « {winner.temoignage} »
          </blockquote>

          <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-6 sm:flex-row">
            <GoldButton asChild size="lg" className="w-full sm:flex-1">
              <Link href="/categories">Enter the next drop</Link>
            </GoldButton>
            <GoldButton asChild variant="secondary" size="lg" className="w-full sm:flex-1">
              <Link href="/comment-ca-marche">How it works</Link>
            </GoldButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function WinnersPage() {
  const [selected, setSelected] = useState<Gagnant | null>(null);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-20%" });
  const winnersCount = useAnimatedNumber(GAGNANTS_PAGE_STATS.totalWinners, heroInView);
  const valueEuro = useAnimatedNumber(GAGNANTS_PAGE_STATS.totalValueDelivered, heroInView, 1.6);

  return (
    <div className="min-h-screen bg-[#030303] pb-[calc(7rem+env(safe-area-inset-bottom))] pt-[max(4.5rem,env(safe-area-inset-top)+3rem)] text-[var(--off-white)] lg:pb-28">
      <div className="noise-overlay pointer-events-none fixed inset-0 opacity-[0.18]" aria-hidden />

      {/* Hero */}
      <header
        ref={heroRef}
        className="relative mx-auto max-w-4xl px-4 text-center sm:px-6"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[min(100vw,520px)] -translate-x-1/2 rounded-full bg-gold/[0.07] blur-[100px]" aria-hidden />
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-gold/90"
        >
          Hall of living proof
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-serif text-[clamp(2rem,8vw,3.75rem)] font-normal italic leading-[1.05] tracking-tight text-balance text-[var(--white)]"
        >
          The moment everything shifts.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mx-auto mt-5 max-w-xl font-display text-sm font-light leading-relaxed text-[var(--muted)] sm:text-base"
        >
          The wall is filling with faces who pressed once and woke up somewhere louder.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.55 }}
          className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
        >
          <StatBlock label="Stories on the wall">
            <span className="tabular-nums">{winnersCount}</span>
          </StatBlock>
          <StatBlock label="Dream value staged" delay={0.06}>
            <span className="tabular-nums">{formatUsd(valueEuro)}</span>
          </StatBlock>
          <StatBlock label="Next cinematic reveal" delay={0.12}>
            <span className="text-xl sm:text-2xl">
              {GAGNANTS_PAGE_STATS.nextDrawInDays === 1
                ? "Tomorrow"
                : `In ${GAGNANTS_PAGE_STATS.nextDrawInDays} days`}
            </span>
          </StatBlock>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
            <GoldButton asChild size="lg">
              <Link href="/categories">Hunt your moment</Link>
            </GoldButton>
        </motion.div>
      </header>

      {/* Future reveals */}
      <section
        className="relative mx-auto mt-16 max-w-6xl px-4 sm:mt-20 sm:px-6"
        aria-labelledby="reveal-teaser-heading"
      >
        <div className="mb-8 text-center sm:text-left">
          <h2
            id="reveal-teaser-heading"
            className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold"
          >
            Lens reveals · coming soon
          </h2>
          <p className="mt-2 max-w-2xl font-serif text-2xl italic text-[var(--white)] sm:text-3xl">
            Your reaction could be next.
          </p>
          <p className="mt-3 max-w-xl font-display text-sm font-light text-[var(--muted)]">
            Blurred on purpose, future winners stay mysterious until the cinematic unveil.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
          {["Spring unveil", "Night-drive reveal", "Ocean drop film", "Neon portrait"].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808] shadow-[0_24px_70px_-50px_rgba(0,0,0,0.85)]"
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-gold/25 via-white/[0.07] to-transparent opacity-40 blur-3xl"
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-4">
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/85">
                  Locked teaser {i + 1}
                </p>
                <p className="mt-2 font-serif text-lg italic text-white/85">{label}</p>
                <p className="mt-1 font-mono text-[10px] text-[var(--muted)]">Countdown publishing · 2026</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Grille gagnants */}
      <section className="relative mx-auto mt-16 max-w-6xl px-4 sm:mt-20 sm:px-6" aria-labelledby="winners-grid-heading">
        <div className="mb-10 text-center sm:text-left">
          <h2 id="winners-grid-heading" className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            Faces who pressed go
          </h2>
          <p className="mt-2 max-w-2xl font-serif text-2xl italic text-[var(--white)] sm:text-3xl">
            Why not you?
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {GAGNANTS_MOCK.map((g, i) => (
            <WinnerCard key={g.id} g={g} index={i} onSelect={() => setSelected(g)} />
          ))}
        </div>
      </section>

      {/* Confiance, sélection */}
      <section className="mx-auto mt-20 max-w-4xl px-4 sm:mt-28 sm:px-6" aria-labelledby="trust-process-heading">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl sm:p-10"
        >
          <h2 id="trust-process-heading" className="text-center font-serif text-2xl italic text-[var(--white)] sm:text-3xl">
            Transparent selection. Verifiable outcomes.
          </h2>
          <ol className="mx-auto mt-10 max-w-2xl space-y-6">
            {[
              {
                step: "01",
                title: "Unique entry ID",
                body: "Every entry receives a traceable ID and is counted against the published cap.",
              },
              {
                step: "02",
                title: "Draw on schedule",
                body: "The draw runs at the published date and time, no opaque delays, no gray areas.",
              },
              {
                step: "03",
                title: "Outreach & publication",
                body: "The winner is contacted first; results are published and archived for the community.",
              },
            ].map((row, i) => (
              <motion.li
                key={row.step}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="flex gap-4 border-b border-white/[0.06] pb-6 last:border-0 last:pb-0"
              >
                <span className="font-mono text-xs text-gold">{row.step}</span>
                <div>
                  <p className="font-display font-medium text-[var(--white)]">{row.title}</p>
                  <p className="mt-1 font-display text-sm font-light leading-relaxed text-[var(--muted)]">{row.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {[
              { icon: Ticket, label: "Limited entries" },
              { icon: Shield, label: "Verified draw" },
              { icon: CheckCircle2, label: "Winner published" },
              { icon: Headphones, label: "Member support" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-black/30 px-3 py-2 font-display text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]"
              >
                <Icon className="h-3.5 w-3.5 text-gold/80" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Bloc émotionnel */}
      <section className="relative mx-auto mt-20 max-w-6xl overflow-hidden px-0 sm:mt-28 sm:rounded-3xl sm:px-0">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="relative min-h-[min(70vh,560px)] w-full"
        >
          <Image
            src={EMOTIONAL_IMAGE}
            alt=""
            fill
            className="object-cover object-[center_40%]"
            sizes="(max-width:768px) 100vw, 1152px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-[#030303]/88 to-[#030303]/55" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex min-h-[min(70vh,560px)] flex-col justify-center px-6 py-16 sm:px-12 lg:max-w-[52%]"
          >
            <Sparkles className="mb-4 h-6 w-6 text-gold/70" aria-hidden />
            <p className="font-serif text-[clamp(1.5rem,4vw,2.25rem)] font-normal italic leading-snug text-[var(--white)]">
              Nobody thinks it can happen to them, until their name is on the list.
            </p>
            <p className="mt-5 max-w-md font-display text-sm font-light leading-relaxed text-[var(--muted)]">
              It is not about volume of tickets. It is the gesture, a few seconds that can sketch a memory you keep
              forever.
            </p>
            <div className="mt-8">
              <GoldButton asChild variant="secondary">
                <Link href="/categories">Explore experiences</Link>
              </GoldButton>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="mx-auto mt-20 max-w-3xl px-4 sm:mt-28 sm:px-6" aria-labelledby="timeline-heading">
        <h2 id="timeline-heading" className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
          Recent seals
        </h2>
        <p className="mt-2 font-serif text-xl italic text-[var(--white)] sm:text-2xl">
          Public trail, cinematic pacing
        </p>
        <ol className="relative mt-10 ms-2 border-l border-white/10 pl-8">
          {DRAW_TIMELINE_GAGNANTS.map((row, i) => (
            <motion.li
              key={row.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45 }}
              className="relative pb-10 last:pb-2"
            >
              <span className="absolute -left-[25px] top-1.5 flex h-3 w-3 rounded-full border border-gold/50 bg-[#030303] shadow-[0_0_12px_rgba(200,169,81,0.35)]" />
              <p className="font-mono text-[11px] uppercase tracking-wider text-gold/85">{row.date}</p>
              <p className="mt-1 font-display text-base font-medium text-[var(--white)]">{row.lot}</p>
              <p className="mt-1 font-mono text-xs text-[var(--muted)]">
                {row.gagnantMasque}, {row.ville} · {formatNumberEn(row.participants)} watching ·{" "}
                <span className={row.statut === "remis" ? "text-gold/90" : "text-[var(--muted)]"}>
                  {row.statut === "remis" ? "Prize delivered" : "Fulfillment in progress"}
                </span>
              </p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* CTA final */}
      <section className="mx-auto mt-20 max-w-4xl px-4 sm:mt-28 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="rounded-3xl border border-gold/20 bg-gradient-to-b from-gold/[0.08] to-transparent px-6 py-12 text-center shadow-[0_0_80px_-40px_rgba(200,169,81,0.25)] sm:px-12 sm:py-16"
        >
          <h2 className="font-serif text-[clamp(1.75rem,5vw,2.75rem)] font-normal italic leading-tight text-[var(--white)]">
            Your portrait could be next.
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-display text-sm font-light leading-relaxed text-[var(--muted)]">
            Scroll until something hijacks your imagination, then decide how deep you go.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <GoldButton asChild size="lg">
              <Link href="/categories">View live drops</Link>
            </GoldButton>
            <GoldButton asChild variant="secondary" size="lg">
              <Link href="/comment-ca-marche">How it works</Link>
            </GoldButton>
          </div>
        </motion.div>
      </section>

      <div className="mt-16">
        <SiteFooter />
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] z-40 px-4 lg:hidden">
        <Link
          href="/categories"
          className="flex w-full items-center justify-center rounded-full border border-gold/35 bg-[#0a0a0a]/95 py-3.5 font-display text-sm font-medium text-gold shadow-lg backdrop-blur-md transition-colors hover:bg-gold/10"
        >
          Hunt your moment
        </Link>
      </div>

      <WinnerDetailModal winner={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}
