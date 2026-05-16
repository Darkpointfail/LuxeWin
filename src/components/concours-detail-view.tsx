"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CountdownTimer } from "@/components/countdown-timer";
import { TicketProgress } from "@/components/ticket-progress";
import { GoldButton } from "@/components/gold-button";
import type { ConcourClient } from "@/lib/data";
import { drawTimelineForLotTitle } from "@/lib/data";
import { useSimulatedTickets } from "@/hooks/use-simulated-tickets";
import { cn } from "@/lib/utils";
import { formatUsd } from "@/lib/format-display";

const QUANTITIES = [1, 3, 5, 10] as const;

const galleryExtras = [
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
];

type Props = {
  concours: ConcourClient;
};

export function ConcoursDetailView({ concours: c }: Props) {
  const end = useMemo(() => new Date(c.endDate), [c.endDate]);
  const drawsForPrize = useMemo(() => drawTimelineForLotTitle(c.titre), [c.titre]);
  const [sold, setSold] = useSimulatedTickets(c.ticketsSold, c.ticketsTotal);
  const [qty, setQty] = useState(1);

  const totalPrice = qty * c.ticketPrice;

  return (
    <div className="bg-luxe-black pt-20 text-luxe-offwhite lg:pt-24">
      <div className="mx-auto flex max-w-[1600px] flex-col lg:min-h-screen lg:flex-row">
        <div className="relative h-[45vh] w-full lg:sticky lg:top-0 lg:h-screen lg:w-[60%]">
          <Image
            src={c.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxe-black/80 via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>

        <div className="relative z-[1] w-full px-6 pb-28 pt-10 lg:w-[40%] lg:overflow-y-auto lg:px-10 lg:pb-16 lg:pt-16">
          <span className="inline-flex rounded-full border border-gold/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold">
            {c.categorie}
          </span>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,2.5rem)] font-bold italic leading-tight">
            {c.titre}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-luxe-offwhite/75">
            {c.description}
          </p>
          <p className="mt-4 text-sm text-luxe-offwhite/50">
            Est. value{" "}
            <span className="text-gold">
              {formatUsd(c.valeur)}
            </span>
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-luxe-charcoal/60 p-6 backdrop-blur-sm">
            <CountdownTimer endDate={end} />
            <div className="mt-6">
              <TicketProgress sold={sold} total={c.ticketsTotal} />
            </div>

            <p className="mt-6 text-xs uppercase tracking-widest text-luxe-offwhite/45">
              Quantity
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUANTITIES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQty(n)}
                  className={cn(
                    "h-10 min-w-[3rem] rounded-md border text-sm transition-colors",
                    qty === n
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-white/15 text-luxe-offwhite/80 hover:border-gold/40"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-xs text-luxe-offwhite/50">Total</p>
                <p className="font-display text-3xl font-bold text-white">
                  {formatUsd(totalPrice)}
                </p>
                <p className="text-xs text-luxe-offwhite/45">
                  {qty} × {formatUsd(c.ticketPrice)}
                </p>
              </div>
              <GoldButton
                type="button"
                className="shrink-0"
                onClick={() =>
                  setSold((s) => Math.min(c.ticketsTotal, s + qty))
                }
              >
                Unlock the experience
              </GoldButton>
            </div>

            <p className="mt-4 text-xs text-luxe-offwhite/55">
              Guaranteed draw with a single entry, transparent process, published winners.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-luxe-offwhite/50">
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />
              <span>Secure checkout · SSL encryption</span>
            </div>
          </div>

          <section className="mt-14">
            <h2 className="font-display text-xl font-bold italic">
              Prize details
            </h2>
            <Accordion type="single" collapsible className="mt-4 w-full">
              <AccordionItem value="win">
                <AccordionTrigger>What you win</AccordionTrigger>
                <AccordionContent>
                  An exceptional prize delivered or experienced per the official rules. Our team stays with you through handoff.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="rules">
                <AccordionTrigger>Eligibility</AccordionTrigger>
                <AccordionContent>
                  Open to eligible adults where permitted. One winner per experience drop. Travel is included only when stated on the prize page.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="draw">
                <AccordionTrigger>How the draw works</AccordionTrigger>
                <AccordionContent>
                  Random selection, supervised and recorded. Winners are contacted by email and phone within 48 hours. Results publish across our official channels.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-8 columns-2 gap-3 [column-fill:_balance]">
              {galleryExtras.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  className="relative mb-3 break-inside-avoid overflow-hidden rounded-xl"
                >
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 20vw"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mt-14">
            <h2 className="font-display text-xl font-bold italic">
              Verified draws
            </h2>
            <p className="mt-2 text-sm text-luxe-offwhite/50">
              Published payouts for this prize only. Nothing simulated.
            </p>
            {drawsForPrize.length ? (
              <ul className="mt-4 space-y-2">
                {drawsForPrize.map((d) => (
                  <li
                    key={d.id}
                    className="rounded-xl border border-white/[0.08] bg-luxe-charcoal/40 px-3 py-2.5 text-[12px] leading-snug text-luxe-offwhite/72"
                  >
                    <span className="font-medium text-luxe-offwhite/90">{d.gagnantMasque}</span>
                    <span className="text-luxe-offwhite/35"> · </span>
                    {d.ville}
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-wide text-luxe-offwhite/42">
                      {d.date} · {d.participants.toLocaleString("en-US")} entrants ·{" "}
                      {d.statut === "remis" ? "Paid out" : "In progress"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-luxe-offwhite/45">
                No completed draw listed for this prize yet. Full archive on{" "}
                <Link href="/gagnants" className="text-gold hover:underline">
                  Winners
                </Link>
                .
              </p>
            )}
          </section>

          <Link
            href="/"
            className="mt-10 inline-block text-sm text-gold hover:underline"
          >
            ← All drops
          </Link>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-luxe-black/95 p-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-luxe-offwhite/45">
              Total
            </p>
            <p className="font-display text-xl font-bold">{formatUsd(totalPrice)}</p>
          </div>
          <GoldButton
            type="button"
            className="flex-1"
            onClick={() => setSold((s) => Math.min(c.ticketsTotal, s + qty))}
          >
            Secure entries
          </GoldButton>
        </div>
      </div>
    </div>
  );
}
