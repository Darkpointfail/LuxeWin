"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HERO_DREAM_SCENES,
  HERO_EMOTIONAL_LINES,
  LIVE_TICKER_MESSAGES,
} from "@/lib/emotional-content";
import { MagneticHeroCta } from "@/components/magnetic-hero-cta";
import { ChevronDown } from "lucide-react";

export function CinematicHero() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [copyIndex, setCopyIndex] = useState(0);
  const [online, setOnline] = useState(2847);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSceneIndex((i) => (i + 1) % HERO_DREAM_SCENES.length);
    }, 8500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === sceneIndex) {
        el.play().catch(() => {});
      } else {
        el.pause();
        try {
          el.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
    });
  }, [sceneIndex]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCopyIndex((i) => (i + 1) % HERO_EMOTIONAL_LINES.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setOnline((n) => {
        const d = Math.floor(Math.random() * 5) - 2;
        return Math.max(2100, Math.min(4200, n + d));
      });
    }, 2800);
    return () => window.clearInterval(id);
  }, []);

  const tickerDup = [...LIVE_TICKER_MESSAGES, ...LIVE_TICKER_MESSAGES];
  const sceneCount = HERO_DREAM_SCENES.length;
  const nextSceneIndex = (sceneIndex + 1) % sceneCount;

  return (
    <section className="relative min-h-[100dvh] overflow-x-hidden bg-luxe-black pt-[3.65rem] md:pt-16">
      {/* Vidéos plein écran en crossfade (lieux, voitures, yacht, suites…) */}
      <div className="absolute inset-0">
        {HERO_DREAM_SCENES.map((scene, i) => (
          <motion.div
            key={scene.id}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === sceneIndex ? 1 : 0 }}
            transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              className="absolute inset-0 h-full w-full object-cover object-[50%_24%] md:object-center"
              poster={scene.image}
              muted
              loop
              playsInline
              preload={
                i === sceneIndex || i === nextSceneIndex ? "auto" : "metadata"
              }
              aria-hidden
            >
              <source src={scene.video} type="video/mp4" />
            </video>
          </motion.div>
        ))}
        <div
          className="absolute inset-0 bg-gradient-to-b from-luxe-black/75 via-luxe-black/40 to-luxe-black/92"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_70%,rgba(0,0,0,0.88)_100%)]"
          aria-hidden
        />
        <div
          className="cinematic-grain pointer-events-none absolute inset-0 opacity-[0.16]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-gold/[0.06] to-transparent blur-3xl"
          aria-hidden
        />
      </div>

      <div className="relative z-[3] border-b border-white/10 bg-luxe-black/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-2 text-[12px] leading-snug text-white/75 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-2.5 sm:text-[13px]">
          <p className="flex items-center gap-2 font-medium text-white/85">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>
              <span className="tabular-nums text-gold">
                {online.toLocaleString("en-US")}
              </span>{" "}
              live now
            </span>
          </p>
          <div className="relative min-h-[1.25rem] max-w-full overflow-hidden sm:max-w-[58%]">
            <div className="flex w-max animate-marquee whitespace-nowrap">
              {tickerDup.map((msg, i) => (
                <span
                  key={`${msg}-${i}`}
                  className="mx-6 text-white/55 sm:mx-8"
                >
                  {msg}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[2] isolate flex min-h-[calc(100dvh-5.5rem)] flex-col items-center justify-center px-4 pb-28 pt-8 text-center sm:px-6 md:min-h-[calc(100dvh-6rem)] md:pb-24 md:pt-12">
        <p className="order-1 mb-5 max-w-md text-xs font-medium uppercase tracking-[0.18em] text-gold md:text-[13px] md:tracking-[0.16em]">
          Verified draws · Member-first access
        </p>

        <div className="order-2 flex w-full max-w-[34rem] flex-col items-center justify-center md:max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={copyIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-[12.5rem] flex-col items-center justify-center gap-4 md:min-h-[11rem] md:gap-5"
            >
              <h1 className="font-display text-pretty text-[clamp(1.75rem,5.2vw,3.35rem)] font-semibold leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_28px_rgba(0,0,0,0.55)]">
                {HERO_EMOTIONAL_LINES[copyIndex]!.line1}
              </h1>
              <p className="max-w-xl text-pretty font-sans text-[clamp(1rem,2.6vw,1.2rem)] font-normal leading-snug text-white/78 drop-shadow-[0_1px_14px_rgba(0,0,0,0.45)]">
                {HERO_EMOTIONAL_LINES[copyIndex]!.line2}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="order-3 mt-8 max-w-sm text-sm leading-relaxed text-white/60 md:mt-10 md:max-w-md md:text-[0.95rem]">
          Clear rules, secure checkout, winners published, the same bar you’d expect from a private member club.
        </p>

        <div className="order-4 mt-8 flex flex-col items-center gap-3 md:mt-10">
          <MagneticHeroCta href="/#concours">
            Explore drops
          </MagneticHeroCta>
          <p className="text-[12px] text-white/45">
            Secure payment · Winners announced
          </p>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          aria-hidden
        >
          <ChevronDown className="h-7 w-7 text-gold/70" />
        </motion.div>
      </div>
    </section>
  );
}
