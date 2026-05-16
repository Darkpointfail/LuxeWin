"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LOTS } from "@/lib/data";
import type { Lot } from "@/lib/types";
import { cn } from "@/lib/utils";

const CASH_EQUIVALENT_LINE = "Cash-back path stays open if plans pivot.";

function FeaturedLotCard({ lot, index }: { lot: Lot; index: number }) {
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] shadow-[0_24px_60px_-40px_rgba(0,0,0,0.85)] transition-[border-color,box-shadow] duration-300 hover:border-gold/25 hover:shadow-[0_28px_70px_-36px_rgba(200,169,81,0.12)]"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden">
        <Image
          src={lot.media.posterUrl}
          alt=""
          fill
          className="object-cover object-center transition-[transform,filter] duration-[1.1s] ease-out group-hover:scale-[1.03] group-hover:brightness-[1.03]"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/45 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col border-t border-white/[0.06] bg-gradient-to-b from-[#0c0c0c] to-[#080808] px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
        <h2 className="font-serif text-xl font-normal italic leading-snug tracking-tight text-[var(--white)] sm:text-2xl">
          {lot.titre}
        </h2>
        <p className="mt-2 font-display text-[13px] font-light leading-relaxed text-[var(--muted)]">
          {lot.tagline}
        </p>
        <p className="mt-3 font-display text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          {CASH_EQUIVALENT_LINE}
        </p>
        <div className="mt-auto pt-5">
          <Link
            href={`/concours/${lot.id}`}
            className="flex h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-dark via-gold to-gold-light font-display text-sm font-medium text-void shadow-gold-glow transition-[opacity,transform] duration-100 ease-out hover:opacity-95 active:scale-[0.98] active:opacity-90"
          >
            Enter the moment
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function FeaturedSixLotsSection({ className }: { className?: string }) {
  const lots = LOTS;

  return (
    <section
      className={cn(className)}
      aria-labelledby="featured-live-drops-heading"
    >
      <div className="mb-8 text-center sm:text-left">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-gold/90">
          Gaviom
        </p>
        <h2
          id="featured-live-drops-heading"
          className="mt-3 font-serif text-[clamp(1.65rem,4.5vw,2.35rem)] font-normal italic leading-[1.08] tracking-tight text-balance text-[var(--white)]"
        >
          The live runway
        </h2>
        <p className="mx-auto mt-3 max-w-2xl font-display text-sm font-light leading-relaxed text-[var(--muted)] sm:mx-0">
          Scroll-stop moments built for projection, pick the life you&apos;d actually post.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {lots.map((lot, index) => (
          <FeaturedLotCard key={lot.id} lot={lot} index={index} />
        ))}
      </div>
    </section>
  );
}
