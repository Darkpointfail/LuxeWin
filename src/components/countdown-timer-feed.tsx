"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

type Props = {
  endDate: Date;
  className?: string;
  /** Compte à rebours discret : pas de rouge agressif sous 24h. */
  variant?: "default" | "luxe";
};

export function CountdownTimerFeed({ endDate, className, variant = "default" }: Props) {
  const [now, setNow] = useState(() => Date.now());
  const [shake, setShake] = useState(false);
  const lastShake = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, endDate.getTime() - now);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const under24h = diff < 24 * 60 * 60 * 1000;
  const under1h = diff < 60 * 60 * 1000;
  const ended = diff <= 0;

  useEffect(() => {
    if (variant === "luxe" || !under1h || ended) return;
    const id = window.setInterval(() => {
      const t = Date.now();
      if (t - lastShake.current > 30000) {
        lastShake.current = t;
        setShake(true);
        window.setTimeout(() => setShake(false), 500);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [under1h, ended, variant]);

  const luxe = variant === "luxe";

  if (ended) {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-2 font-mono text-sm font-medium text-gold",
          className
        )}
      >
        <motion.span
          className="inline-block h-3 w-3 rounded-full border-2 border-gold border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          aria-hidden
        />
        DRAW IN PROGRESS
      </div>
    );
  }

  const display = `${pad2(days)}:${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;

  return (
    <div
      className={cn(
        "font-mono text-sm font-medium tabular-nums tracking-tight",
        luxe
          ? cn(
              under1h &&
                "rounded-lg border border-gold/25 bg-gold/[0.07] px-3 py-2 text-gold-light",
              !under1h && under24h && "text-gold-light/95",
              !under24h && "text-[var(--white)]"
            )
          : cn(
              under1h
                ? "rounded-lg bg-urgence/20 px-3 py-2 text-urgence"
                : under24h
                  ? "text-urgence"
                  : "text-[var(--white)]",
              shake && "animate-shake-soft"
            ),
        className
      )}
      role="timer"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={display}
          initial={{ opacity: 0.5 }}
          animate={{
            opacity: 1,
            scale: !luxe && under1h ? [1, 1.02, 1] : 1,
          }}
          transition={{ duration: 0.35 }}
        >
          {display}
        </motion.span>
      </AnimatePresence>
      <span className="mt-0.5 block text-[9px] font-normal uppercase tracking-widest text-[var(--muted)]">
        DD : HH : MM : SS
      </span>
    </div>
  );
}
