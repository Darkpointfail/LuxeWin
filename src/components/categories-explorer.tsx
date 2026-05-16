"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowRight, Lock, RotateCcw, SlidersHorizontal } from "lucide-react";
import { FeaturedSixLotsSection } from "@/components/featured-six-lots";
import {
  LOTS,
  CATEGORY_FILTERS,
  EXPLORE_MOOD_PRESETS,
  feedMoodForLot,
} from "@/lib/data";
import type { Lot } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatUsd } from "@/lib/format-display";

type CategoryFilter = (typeof CATEGORY_FILTERS)[number]["value"];

type PriceTier = "all" | "lt5" | "5-10" | "10-20" | "gte20";
/** Tickets still available to buy (relates to estimated 1-entry odds on cards). */
type AvailabilityTier = "all" | "few" | "moderate" | "many" | "mega";
type SortKey =
  | "recommended"
  | "price_asc"
  | "draw_soon"
  | "best_odds_one_entry"
  | "most_spots_left";

const PRICE_OPTIONS: { id: PriceTier; label: string }[] = [
  { id: "all", label: "All prices" },
  { id: "lt5", label: "Under $5" },
  { id: "5-10", label: "$5 – $10" },
  { id: "10-20", label: "$10 – $20" },
  { id: "gte20", label: "$20+" },
];

const AVAILABILITY_OPTIONS: { id: AvailabilityTier; label: string; hint: string }[] = [
  { id: "all", label: "Any availability", hint: "Show every drop" },
  {
    id: "few",
    label: "≤100 spots left",
    hint: "Tighter pools · stronger scarcity",
  },
  {
    id: "moderate",
    label: "101–400 left",
    hint: "Balanced inventory",
  },
  {
    id: "many",
    label: "401–1,500 left",
    hint: "Still plenty of entries open",
  },
  {
    id: "mega",
    label: "1,500+ left",
    hint: "Large pools · many tickets left",
  },
];

const SORT_OPTIONS: { id: SortKey; label: string; hint: string }[] = [
  { id: "recommended", label: "Recommended", hint: "Desire score & closing date" },
  { id: "price_asc", label: "Entry price · low → high", hint: "Cheapest ticket first" },
  { id: "draw_soon", label: "Closing soon", hint: "Soonest draw first" },
  {
    id: "best_odds_one_entry",
    label: "Best odds · 1 entry",
    hint: "Smallest “1 in X” first (see cards)",
  },
  {
    id: "most_spots_left",
    label: "Most spots left",
    hint: "Largest remaining inventory first",
  },
];

function spotsRemaining(lot: Lot): number {
  return Math.max(0, lot.ticketsTotal - lot.ticketsSold);
}

function estimatedOddsOneTicket(total: number, sold: number): number {
  const remaining = Math.max(0, total - sold);
  if (remaining <= 0) return 1;
  return Math.ceil(remaining);
}

function matchesPrice(lot: Lot, tier: PriceTier): boolean {
  const p = lot.ticketPrice;
  switch (tier) {
    case "all":
      return true;
    case "lt5":
      return p < 5;
    case "5-10":
      return p >= 5 && p < 10;
    case "10-20":
      return p >= 10 && p <= 20;
    case "gte20":
      return p > 20;
    default:
      return true;
  }
}

function matchesAvailability(lot: Lot, tier: AvailabilityTier): boolean {
  const r = spotsRemaining(lot);
  switch (tier) {
    case "all":
      return true;
    case "few":
      return r <= 100;
    case "moderate":
      return r > 100 && r <= 400;
    case "many":
      return r > 400 && r <= 1500;
    case "mega":
      return r > 1500;
    default:
      return true;
  }
}

function sortLots(lots: Lot[], key: SortKey): Lot[] {
  const copy = [...lots];
  switch (key) {
    case "price_asc":
      return copy.sort((a, b) => a.ticketPrice - b.ticketPrice);
    case "draw_soon":
      return copy.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
    case "best_odds_one_entry":
      return copy.sort((a, b) => {
        const oa = estimatedOddsOneTicket(a.ticketsTotal, a.ticketsSold);
        const ob = estimatedOddsOneTicket(b.ticketsTotal, b.ticketsSold);
        if (oa !== ob) return oa - ob;
        return b.desirabiliteScore - a.desirabiliteScore;
      });
    case "most_spots_left":
      return copy.sort((a, b) => {
        const ra = spotsRemaining(a);
        const rb = spotsRemaining(b);
        if (ra !== rb) return rb - ra;
        return a.endDate.getTime() - b.endDate.getTime();
      });
    case "recommended":
    default:
      return copy.sort((a, b) => {
        const s = b.desirabiliteScore - a.desirabiliteScore;
        if (s !== 0) return s;
        return a.endDate.getTime() - b.endDate.getTime();
      });
  }
}

function FilterChip({
  active,
  children,
  onClick,
  className,
  title,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  className?: string;
  /** Native tooltip for longer explanations. */
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "shrink-0 touch-manipulation rounded-full border px-3.5 py-2 font-display text-[11px] font-medium tracking-wide transition-[background-color,border-color,color,transform] duration-200 ease-out sm:px-4 sm:text-xs",
        active
          ? "border-gold/45 bg-gold/[0.14] text-gold-light shadow-[0_0_0_1px_rgba(200,169,81,0.12)]"
          : "border-white/[0.1] bg-white/[0.03] text-[var(--muted)] hover:border-gold/25 hover:text-[var(--white)]",
        className
      )}
    >
      {children}
    </button>
  );
}

function CategoryLotCard({ lot, index }: { lot: Lot; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.36),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] shadow-[0_24px_60px_-40px_rgba(0,0,0,0.85)] transition-[border-color,box-shadow] duration-300 hover:border-gold/25 hover:shadow-[0_28px_70px_-36px_rgba(200,169,81,0.12)]"
    >
      <Link href={`/concours/${lot.id}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]">
        <div className="relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/10]">
          <Image
            src={lot.media.posterUrl}
            alt=""
            fill
            className="object-cover object-[50%_28%] transition-[transform,filter] duration-[1.1s] ease-out group-hover:scale-[1.04] group-hover:brightness-[1.03] md:object-center"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/55 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
            <span className="rounded-full border border-white/10 bg-black/45 px-2.5 py-1 font-display text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--off-white)]/90 backdrop-blur-md">
              {feedMoodForLot(lot)}
            </span>
            {lot.membres_only && (
              <span className="inline-flex items-center gap-1 rounded-full border border-gold/35 bg-black/55 px-2.5 py-1 font-mono text-[10px] text-gold backdrop-blur-md">
                <Lock className="h-3 w-3" aria-hidden />
                Gaviom Club
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-white/[0.06] bg-gradient-to-b from-[#0c0c0c] to-[#080808] px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
          <h2 className="font-serif text-xl font-normal italic leading-snug tracking-tight text-[var(--white)] sm:text-2xl">
            {lot.titre}
          </h2>
          <p className="mt-2 line-clamp-3 font-display text-[13px] font-light leading-relaxed text-[var(--muted)]">
            {lot.tagline}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.05] pt-4">
            <span className="font-display text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
              Unlock from{" "}
              <span className="font-mono text-[13px] font-medium normal-case tracking-normal text-gold">
                {formatUsd(lot.ticketPrice)}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-display text-sm font-medium text-gold transition-transform duration-200 group-hover:translate-x-0.5">
              Step inside
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function CategoriesExplorer() {
  const totalLots = LOTS.length;
  const [moodPresetId, setMoodPresetId] = useState<string>("all");
  const [category, setCategory] = useState<CategoryFilter>("tous");
  const [priceTier, setPriceTier] = useState<PriceTier>("all");
  const [availabilityTier, setAvailabilityTier] = useState<AvailabilityTier>("all");
  const [sortKey, setSortKey] = useState<SortKey>("recommended");

  const filtered = useMemo(() => {
    const preset =
      EXPLORE_MOOD_PRESETS.find((m) => m.id === moodPresetId) ?? EXPLORE_MOOD_PRESETS[0]!;
    let list = LOTS.filter((l) => preset.filter(l)).filter((l) => {
      if (category !== "tous" && l.categorie !== category) return false;
      if (!matchesPrice(l, priceTier)) return false;
      if (!matchesAvailability(l, availabilityTier)) return false;
      return true;
    });
    list = sortLots(list, sortKey);
    return list;
  }, [availabilityTier, category, moodPresetId, priceTier, sortKey]);

  const resetFilters = useCallback(() => {
    setMoodPresetId("all");
    setCategory("tous");
    setPriceTier("all");
    setAvailabilityTier("all");
    setSortKey("recommended");
  }, []);

  const hasActiveFilters =
    moodPresetId !== "all" ||
    category !== "tous" ||
    priceTier !== "all" ||
    availabilityTier !== "all" ||
    sortKey !== "recommended";

  return (
    <div className="min-h-screen bg-[#030303] px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-[max(5rem,env(safe-area-inset-top)+3.5rem)] sm:px-6 lg:pb-28">
      <header className="mx-auto max-w-4xl text-center sm:text-left">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-gold/90">
          Gaviom
        </p>
        <h1 className="mt-3 font-serif text-[clamp(1.9rem,5.5vw,3rem)] font-normal italic leading-[1.08] tracking-tight text-balance text-[var(--white)]">
          Discover your next obsession
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-display text-sm font-light leading-relaxed text-[var(--muted)] sm:mx-0">
          Not a catalog, a moodboard of escapes, adrenaline, and quiet flexes. Glide the runway, then tune filters if
          you want precision.
        </p>
        <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:items-baseline sm:gap-4">
          <p className="font-display text-sm text-[var(--muted)]">
            <motion.span
              key={totalLots}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block font-medium text-[var(--white)]"
            >
              {totalLots} stories live
            </motion.span>
          </p>
          <span className="hidden h-1 w-1 rounded-full bg-gold/40 sm:inline-block" aria-hidden />
          <p className="text-center font-display text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--muted)] sm:text-left">
            Dream-first drops · Verified outcomes underneath
          </p>
        </div>
        <Link
          href="/comment-ca-marche"
          className="mt-5 inline-flex items-center justify-center gap-1.5 font-display text-[13px] font-medium text-gold/90 underline-offset-4 hover:underline sm:justify-start"
        >
          How it works
          <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
        </Link>
      </header>

      <section className="mx-auto mt-10 max-w-6xl" aria-label="Curated moods">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/85">
          Curated moods
        </p>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
          {EXPLORE_MOOD_PRESETS.map((m) => (
            <button
              key={m.id}
              type="button"
              title={m.hint}
              onClick={() => setMoodPresetId(m.id)}
              className={cn(
                "shrink-0 touch-manipulation rounded-full border px-4 py-2 text-left transition-[background-color,border-color,color,transform] duration-200 ease-out sm:text-center",
                moodPresetId === m.id
                  ? "border-gold/45 bg-gold/[0.14] text-gold-light shadow-[0_0_0_1px_rgba(200,169,81,0.12)]"
                  : "border-white/[0.1] bg-white/[0.03] text-[var(--muted)] hover:border-gold/25 hover:text-[var(--white)]"
              )}
            >
              <span className="block font-display text-[11px] font-medium tracking-wide">{m.label}</span>
              <span className="mt-0.5 block font-display text-[10px] font-light leading-snug text-[var(--muted)]">
                {m.hint}
              </span>
            </button>
          ))}
        </div>
      </section>

      <FeaturedSixLotsSection className="mx-auto mt-12 max-w-6xl lg:mt-14" />

      <section className="mx-auto mt-14 max-w-5xl border-t border-white/[0.06] pt-14">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[var(--muted)]">
              <SlidersHorizontal className="h-4 w-4 text-gold/70" aria-hidden />
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--off-white)]/90">
                Filters
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <motion.p
                key={filtered.length}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="font-mono text-[11px] tabular-nums text-[var(--muted)]"
              >
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </motion.p>
              <button
                type="button"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-display text-[11px] font-medium uppercase tracking-wide transition-colors",
                  hasActiveFilters
                    ? "border-white/15 text-[var(--off-white)] hover:border-gold/35 hover:text-gold"
                    : "cursor-not-allowed border-white/[0.06] text-[var(--muted)]/50"
                )}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Reset
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-8">
            <div>
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Category
              </p>
              <p className="mt-1 max-w-prose font-display text-[10px] font-light leading-relaxed text-[var(--muted)]/85">
                Experience type for each drop.
              </p>
              <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
                {CATEGORY_FILTERS.map(({ value, label }) => (
                  <FilterChip key={value} active={category === value} onClick={() => setCategory(value)}>
                    {label}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
              <div>
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Entry price
                </p>
                <p className="mt-1 max-w-prose font-display text-[10px] font-light leading-relaxed text-[var(--muted)]/85">
                  Cost per ticket before checkout.
                </p>
                <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
                  {PRICE_OPTIONS.map(({ id, label }) => (
                    <FilterChip key={id} active={priceTier === id} onClick={() => setPriceTier(id)}>
                      {label}
                    </FilterChip>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                  Tickets still available
                </p>
                <p className="mt-1 max-w-prose font-display text-[10px] font-light leading-relaxed text-[var(--muted)]/85">
                  Based on spots left to sell. Card copy shows estimated odds for one entry (1 in X, same logic).
                </p>
                <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
                  {AVAILABILITY_OPTIONS.map(({ id, label, hint }) => (
                    <FilterChip
                      key={id}
                      active={availabilityTier === id}
                      onClick={() => setAvailabilityTier(id)}
                      title={hint}
                    >
                      {label}
                    </FilterChip>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-6">
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Sort results
              </p>
              <p className="mt-1 max-w-prose font-display text-[10px] font-light leading-relaxed text-[var(--muted)]/85">
                Ordering applies after category, price, and availability filters.
              </p>
              <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:flex-wrap sm:overflow-visible">
                {SORT_OPTIONS.map(({ id, label, hint }) => (
                  <FilterChip
                    key={id}
                    active={sortKey === id}
                    onClick={() => setSortKey(id)}
                    title={hint}
                  >
                    {label}
                  </FilterChip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <LayoutGroup>
        <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:gap-6">
          {filtered.map((lot, index) => (
            <CategoryLotCard key={lot.id} lot={lot} index={index} />
          ))}
        </div>
      </LayoutGroup>

      <AnimatePresence>
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-16 max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-12 text-center backdrop-blur-md"
          >
            <p className="font-serif text-xl italic text-[var(--white)]">No matches</p>
            <p className="mt-3 font-display text-sm font-light leading-relaxed text-[var(--muted)]">
              Nothing fits those filters yet. Loosen a filter or reset to see every drop.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-full border border-gold/35 bg-gold/10 px-5 py-2.5 font-display text-xs font-medium uppercase tracking-wide text-gold transition-colors hover:bg-gold/15"
            >
              Reset filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mx-auto mt-14 max-w-2xl text-center font-display text-[11px] font-light leading-relaxed text-[var(--muted)]">
        Guaranteed draw on every drop · Live numbers update on each experience page.
      </p>
    </div>
  );
}
