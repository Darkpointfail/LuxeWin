"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, MapPin, ExternalLink } from "lucide-react";
import type { Lot } from "@/lib/types";
import { getLotBySlug } from "@/lib/data";
import { useSimulatedTickets } from "@/hooks/use-simulated-tickets";
import { useFeedStore } from "@/stores/feed-store";
import { useRouter } from "next/navigation";
import { ContestEntryPaths } from "@/components/contest-entry-paths";
import { lotHeroPhoto, lotUsesVideo } from "@/lib/lot-media";
import { lotFeedPoster, preloadLotMedia } from "@/lib/feed-media";
import { useFastAutoplayVideo } from "@/hooks/use-fast-autoplay-video";

function ContestDetailBody({ lot, onClose }: { lot: Lot; onClose: () => void }) {
  const usesVideo = lotUsesVideo(lot);
  const heroPhoto = lotHeroPhoto(lot);
  const gallery = lot.media.photos.length > 0 ? lot.media.photos : [heroPhoto];
  const [galleryIndex, setGalleryIndex] = useState(0);
  const sheetVideoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (usesVideo) preloadLotMedia(lot);
  }, [lot, usesVideo]);

  useFastAutoplayVideo(sheetVideoRef, {
    src: usesVideo ? lot.media.videoUrl : undefined,
    active: usesVideo,
    playbackRate: lot.media.playbackRate ?? 1,
  });
  const selectedQty = useFeedStore((s) => s.selectedQty);
  const setSelectedQty = useFeedStore((s) => s.setSelectedQty);
  const purchaseActions = useFeedStore((s) => s.purchaseActions);
  const [sold] = useSimulatedTickets(lot.ticketsSold, lot.ticketsTotal);

  const bonusNote =
    purchaseActions >= 3 && purchaseActions % 3 === 0
      ? "Inner circle perk: +1 bonus pass layered on this tier."
      : null;

  const mapHref =
    lot.location &&
    `https://www.google.com/maps?q=${lot.location.lat},${lot.location.lng}`;

  return (
    <motion.div
      role="dialog"
      aria-modal
      aria-labelledby="sheet-title"
      className="max-h-[min(94dvh,920px)] w-full max-w-[min(100vw-1rem,40rem)] overflow-hidden rounded-t-[22px] border border-[var(--border)] bg-[var(--surface)] shadow-2xl sm:max-w-2xl md:max-w-3xl md:rounded-t-[24px]"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 38, stiffness: 520, mass: 0.85 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sticky top-0 z-10 flex justify-center border-b border-[var(--border)] bg-[var(--surface)] py-3">
        <button
          type="button"
          aria-label="Close"
          className="absolute right-3 top-3 touch-manipulation rounded-full p-2 text-[var(--muted)] transition-colors duration-100 hover:text-[var(--white)] active:opacity-60"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        <span className="h-1.5 w-12 rounded-full bg-[var(--ghost)]" aria-hidden />
      </div>

      <div className="max-h-[calc(min(94dvh,920px)-52px)] overflow-y-auto overscroll-contain px-5 pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] pt-4 sm:px-8 md:px-10">
        <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#141414]">
          {usesVideo ? (
            <video
              ref={sheetVideoRef}
              className="h-full w-full object-cover object-center"
              src={lot.media.videoUrl}
              poster={lotFeedPoster(lot)}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
            />
          ) : (
            <>
              <Image
                src={gallery[galleryIndex] ?? heroPhoto}
                alt=""
                fill
                className="object-cover object-center scale-105"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
              {gallery.length > 1 ? (
                <div className="absolute inset-x-0 bottom-0 flex gap-1.5 overflow-x-auto bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                  {gallery.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setGalleryIndex(i)}
                      className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border transition-opacity ${
                        i === galleryIndex
                          ? "border-gold/60 opacity-100"
                          : "border-white/20 opacity-60 hover:opacity-90"
                      }`}
                      aria-label={`Photo ${i + 1}`}
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>

        <h2
          id="sheet-title"
          className="font-serif text-3xl font-normal italic leading-tight text-[var(--white)]"
        >
          {lot.titre}
        </h2>
        <p className="mt-2 font-display text-sm font-medium text-[var(--muted)]">
          {lot.tagline}
        </p>

        <section className="mt-8">
          <ContestEntryPaths
            contestId={lot.id}
            contestTitle={lot.titre}
            endDate={lot.endDate}
            ticketsTotal={lot.ticketsTotal}
            ticketsSold={sold}
            ticketPrice={lot.ticketPrice}
            selectedQty={selectedQty}
            onTicketsChange={setSelectedQty}
            bonusNote={bonusNote}
            variant="luxe"
            onlineCtaLabel="Continue to payment"
            onOnlineConfirm={() => {
              onClose();
              router.push(`/concours/${lot.id}/checkout?qty=${selectedQty}`);
            }}
          />
        </section>

        <section className="mt-8 space-y-4">
          <h3 className="font-display text-xs font-medium uppercase tracking-[0.14em] text-gold">
            The fantasy, spelled out
          </h3>
          {lot.description.split(/\n\n+/).map((para, i) => (
            <p
              key={i}
              className="font-display text-sm font-light leading-relaxed text-[var(--muted)]"
            >
              {para}
            </p>
          ))}
        </section>

        {lot.journeeType && lot.journeeType.length > 0 && (
          <section className="mt-8">
            <h3 className="font-display text-xs font-medium uppercase tracking-[0.14em] text-gold">
              How it could feel
            </h3>
            <ul className="mt-4 space-y-3 border-l border-[var(--border)] pl-4">
              {lot.journeeType.map((line) => (
                <li key={line} className="font-mono text-[13px] text-[var(--white)]">
                  {line}
                </li>
              ))}
            </ul>
          </section>
        )}

        {lot.location && mapHref && (
          <section className="mt-8">
            <h3 className="font-display text-xs font-medium uppercase tracking-[0.14em] text-gold">
              Location
            </h3>
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 text-sm text-[var(--white)] transition-colors hover:border-gold/30"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" />
                {lot.location.ville}, {lot.location.pays}
              </span>
              <ExternalLink className="h-4 w-4 shrink-0 text-[var(--muted)]" />
            </a>
            <p className="mt-2 font-mono text-[11px] text-[var(--muted)]">
              {lot.location.lat.toFixed(4)}, {lot.location.lng.toFixed(4)}
            </p>
          </section>
        )}

        <section className="mt-8">
          <h3 className="font-display text-xs font-medium uppercase tracking-[0.14em] text-gold">
            Who&apos;s feeling this right now
          </h3>
          <ul className="mt-3 space-y-2">
            {lot.leaderboard.map((row, i) => (
              <li
                key={row.pseudo}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--void)] px-3 py-2 font-mono text-xs"
              >
                <span className="text-[var(--muted)]">#{i + 1}</span>
                <span className="text-[var(--white)]">{row.pseudo}</span>
                <span className="text-gold/90">{row.tickets} deep</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <h3 className="font-display text-xs font-medium uppercase tracking-[0.14em] text-gold">
            Winner reels
          </h3>
          <p className="mt-2 font-display text-sm text-[var(--muted)]">
            Video testimonials from past draws, landing soon.
          </p>
        </section>
      </div>
    </motion.div>
  );
}

export function ContestDetailSheet() {
  const detailLotId = useFeedStore((s) => s.detailLotId);
  const closeDetail = useFeedStore((s) => s.closeDetail);
  const lot = detailLotId ? getLotBySlug(detailLotId) : undefined;

  useEffect(() => {
    if (!detailLotId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [detailLotId]);

  if (!detailLotId || !lot) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-void/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => closeDetail()}
    >
      <ContestDetailBody lot={lot} onClose={closeDetail} />
    </motion.div>
  );
}