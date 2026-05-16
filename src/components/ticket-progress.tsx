"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  sold: number;
  total: number;
  className?: string;
  /** Ton sobre : pas de rouge « casino », urgence en or / ivoire. */
  variant?: "default" | "luxe";
};

export function TicketProgress({ sold, total, className, variant = "default" }: Props) {
  const pct = total > 0 ? Math.min(100, (sold / total) * 100) : 0;
  const remaining = Math.max(0, total - sold);

  const tier =
    pct >= 95
      ? "critical"
      : pct >= 80
        ? "hot"
        : pct >= 60
          ? "warm"
          : "calm";

  const luxe = variant === "luxe";

  const mv = useMotionValue(0);
  const spring = useSpring(mv, {
    stiffness: tier === "critical" && !luxe ? 120 : 80,
    damping: tier === "critical" && !luxe ? 14 : 20,
  });
  const width = useTransform(spring, (v) => `${v}%`);

  useEffect(() => {
    mv.set(pct);
  }, [pct, mv]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between font-mono text-[11px] text-[var(--muted)]">
        <span>
          <span className="text-[var(--white)]">{sold.toLocaleString("en-US")}</span> /{" "}
          {total.toLocaleString("en-US")}{" "}
          {luxe ? "entries secured" : "entries"}
        </span>
        <span
          className={cn(
            luxe
              ? cn(
                  tier === "critical" && "font-medium text-gold-light",
                  tier === "hot" && "font-medium text-gold-light/95",
                  tier === "warm" && "text-gold"
                )
              : cn(
                  tier === "critical" && "animate-pulse-urgent font-medium text-urgence",
                  tier === "hot" && "font-medium text-urgence/90",
                  tier === "warm" && "text-gold"
                )
          )}
        >
          {remaining} {luxe ? "spots left" : "left"}
        </span>
      </div>
      <div
        className={cn(
          "relative h-2.5 w-full overflow-hidden rounded-full bg-luxe-smoke",
          !luxe && tier === "critical" && "ring-1 ring-urgence/50",
          !luxe && tier === "hot" && "ring-1 ring-urgence/25",
          luxe && (tier === "hot" || tier === "critical") && "ring-1 ring-gold/20"
        )}
      >
        <motion.div
          className={cn(
            "h-full rounded-full",
            tier === "calm" && "bg-gradient-to-r from-gold-dark via-gold to-gold-light",
            tier === "warm" &&
              "bg-gradient-to-r from-gold-dark via-gold to-gold-light brightness-110",
            !luxe &&
              tier === "hot" &&
              "bg-gradient-to-r from-amber-600 via-gold to-gold-light shadow-[0_0_12px_rgba(232,64,42,0.35)]",
            luxe && tier === "hot" && "bg-gradient-to-r from-gold-dark via-gold to-gold-light shadow-[0_0_20px_rgba(200,169,81,0.2)]",
            !luxe &&
              tier === "critical" &&
              "bg-gradient-to-r from-urgence via-red-500 to-gold-light animate-pulse-urgent",
            luxe &&
              tier === "critical" &&
              "bg-gradient-to-r from-gold-dark via-gold-light to-gold brightness-110 shadow-[0_0_24px_rgba(240,208,128,0.25)]"
          )}
          style={{ width }}
        />
      </div>
      {tier === "warm" && pct < 80 && (
        <p className="text-center font-mono text-[10px] font-medium uppercase tracking-wide text-gold/90">
          {luxe ? "Momentum is building, still room" : "Filling fast"}
        </p>
      )}
      {tier === "hot" && (
        <p
          className={cn(
            "text-center font-mono text-[10px] font-medium uppercase tracking-wide",
            luxe ? "text-gold/90" : "text-urgence"
          )}
        >
          {luxe ? "Almost sold out, rarity in motion" : "Almost sold out"}
        </p>
      )}
      {tier === "critical" && (
        <p
          className={cn(
            "text-center font-mono text-[10px] font-medium uppercase tracking-wide",
            luxe ? "text-gold-light" : "text-urgence"
          )}
        >
          {luxe ? "Final spots remaining" : "Final entries"}
        </p>
      )}
    </div>
  );
}
