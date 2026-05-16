"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cardVariants } from "@/lib/motion";
import { CountdownTimer } from "@/components/countdown-timer";
import { TicketProgress } from "@/components/ticket-progress";
import { GoldButton } from "@/components/gold-button";
import { cn } from "@/lib/utils";
import { formatNumberEn, formatUsd } from "@/lib/format-display";

export type ConcourCardLot = {
  id: string;
  titre: string;
  ticketPrice: number;
  ticketsTotal: number;
  image: string;
  categorie?: string;
};

type Props = {
  lot: ConcourCardLot;
  endDate: Date;
  ticketsSold: number;
  className?: string;
  fullBleedMobile?: boolean;
};

export function ConcourCard({
  lot,
  endDate,
  ticketsSold,
  className,
  fullBleedMobile = true,
}: Props) {
  const remaining = Math.max(0, lot.ticketsTotal - ticketsSold);
  const remainingRatio = lot.ticketsTotal > 0 ? remaining / lot.ticketsTotal : 0;
  const soldRatio = lot.ticketsTotal > 0 ? ticketsSold / lot.ticketsTotal : 0;
  const almostGone = remainingRatio < 0.2;
  const popular = soldRatio > 0.65;
  const msLeft = endDate.getTime() - Date.now();
  const lastHours = msLeft < 24 * 60 * 60 * 1000 && msLeft > 0;

  return (
    <motion.article
      variants={cardVariants}
      className={cn(
        "group/card relative overflow-hidden rounded-2xl border border-white/10 bg-luxe-charcoal",
        "shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-all duration-500",
        "md:hover:-translate-y-1 md:hover:border-gold/35 md:hover:shadow-[0_28px_80px_rgba(201,168,76,0.14)]",
        fullBleedMobile && "min-h-[min(100dvh,44rem)] md:min-h-0",
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="animate-ken-burns h-full w-full will-change-transform">
          <Image
            src={lot.image}
            alt=""
            fill
            className="object-cover transition-[filter] duration-700 group-hover/card:brightness-110"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-luxe-black via-luxe-black/65 to-luxe-black/25" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/[0.07] via-transparent to-transparent opacity-80" />
        <motion.div
          className="pointer-events-none absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
          animate={{ opacity: [0, 0.35, 0], x: ["-100%", "100%"] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 2,
          }}
          style={{ skewX: "-12deg" }}
        />
      </div>

      <div
        className={cn(
          "relative z-[2] flex h-full flex-col justify-end",
          "min-h-[min(100dvh,44rem)] p-6 md:min-h-[420px] md:p-8",
          "backdrop-blur-[2px]"
        )}
      >
        <div className="rounded-2xl border border-white/10 bg-luxe-black/45 p-4 shadow-lg backdrop-blur-xl md:p-5">
          <div className="flex flex-wrap gap-2">
            {lastHours && (
              <span className="rounded-full bg-urgency/25 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-urgence">
                Final hours
              </span>
            )}
            {almostGone && (
              <motion.span
                className="inline-flex items-center gap-1 rounded-full bg-urgency/20 px-2.5 py-0.5 text-[10px] font-medium text-urgence ring-1 ring-urgency/35"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              >
                <span aria-hidden>●</span> Almost sold out
              </motion.span>
            )}
            {popular && (
              <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gold">
                Trending
              </span>
            )}
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] text-luxe-offwhite/60">
              Live activity
            </span>
          </div>

          {lot.categorie && (
            <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-gold/85">
              {lot.categorie}
            </p>
          )}
          <h3 className="mt-2 font-display text-2xl font-bold italic leading-tight text-white md:text-3xl">
            {lot.titre}
          </h3>
          <p className="mt-2 text-xs text-luxe-offwhite/55">
            <span className="tabular-nums font-medium text-luxe-offwhite">
              {formatNumberEn(remaining)}
            </span>{" "}
            entries left · don’t sleep on the close
          </p>

          <div className="mt-4 max-w-md">
            <CountdownTimer
              endDate={endDate}
              urgentWithinMs={24 * 60 * 60 * 1000}
            />
          </div>

          <div className="mt-5 space-y-4">
            <TicketProgress sold={ticketsSold} total={lot.ticketsTotal} />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-luxe-offwhite/50">
                  From
                </p>
                <p className="font-display text-3xl font-bold text-gold">
                  {formatUsd(lot.ticketPrice)}
                </p>
              </div>
              <GoldButton asChild className="w-full sm:w-auto">
                <Link href={`/concours/${lot.id}`}>Explore experience</Link>
              </GoldButton>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
