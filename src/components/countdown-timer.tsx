"use client";

import { useEffect, useState, useRef, useLayoutEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

type Size = "default" | "compact";

/**
 * Adapte la rangée à la largeur du parent (carte) sans scroll ni débordement visible.
 */
function FitScaleRow({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [clipHeight, setClipHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const update = () => {
      const available = container.clientWidth;
      const needed = inner.scrollWidth;
      const h = inner.offsetHeight;

      let s = 1;
      if (available >= 1 && needed > available) {
        s = Math.max(0.52, available / needed);
      }

      setScale(s);
      setClipHeight(s < 1 ? Math.ceil(h * s) : undefined);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex w-full min-w-0 justify-center overflow-hidden"
      style={clipHeight != null ? { height: clipHeight } : undefined}
    >
      <div
        className="inline-block max-w-none"
        style={{
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top center",
        }}
      >
        <div ref={innerRef} className="inline-flex w-max items-center gap-0">
          {children}
        </div>
      </div>
    </div>
  );
}

function DigitBox({
  value,
  urgent,
  size,
}: {
  value: string;
  urgent: boolean;
  size: Size;
}) {
  const prev = useRef(value);
  const flip = prev.current !== value;
  useEffect(() => {
    prev.current = value;
  }, [value]);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded border text-center font-medium tabular-nums leading-none",
        size === "compact"
          ? "h-7 w-[1.35rem] text-xs sm:h-8 sm:w-6 sm:text-sm"
          : "h-10 w-9 text-lg md:h-11 md:w-10 md:text-xl",
        urgent
          ? "border-urgency/60 bg-urgency/10 text-urgency animate-pulse-soft"
          : "border-white/15 bg-luxe-charcoal/80 text-luxe-offwhite"
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={flip ? { rotateX: -90, opacity: 0 } : false}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="block leading-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function DigitPair({
  n,
  urgent,
  size,
}: {
  n: number;
  urgent: boolean;
  size: Size;
}) {
  const s = pad2(n);
  const gap = size === "compact" ? "gap-px" : "gap-1";
  return (
    <div className={cn("flex shrink-0", gap)}>
      <DigitBox value={s[0]!} urgent={urgent} size={size} />
      <DigitBox value={s[1]!} urgent={urgent} size={size} />
    </div>
  );
}

function Sep({ urgent, size }: { urgent: boolean; size: Size }) {
  return (
    <span
      className={cn(
        "flex shrink-0 select-none items-center justify-center font-light leading-none",
        size === "compact"
          ? "h-7 px-px text-xs sm:h-8 sm:text-sm"
          : "h-10 px-0.5 text-base md:h-11 md:text-lg",
        urgent ? "text-urgency" : "text-gold"
      )}
      aria-hidden
    >
      :
    </span>
  );
}

type Props = {
  endDate: Date;
  className?: string;
  labelClassName?: string;
  label?: string;
  urgentWithinMs?: number;
  size?: Size;
};

export function CountdownTimer({
  endDate,
  className,
  labelClassName,
  label = "Closes in",
  urgentWithinMs = 60 * 60 * 1000,
  size = "default",
}: Props) {
  const [now, setNow] = useState(() => Date.now());

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

  const urgent = diff < urgentWithinMs;

  const isCompact = size === "compact";

  const row = (
    <>
      <DigitPair n={days} urgent={urgent} size={size} />
      <Sep urgent={urgent} size={size} />
      <DigitPair n={hours} urgent={urgent} size={size} />
      <Sep urgent={urgent} size={size} />
      <DigitPair n={minutes} urgent={urgent} size={size} />
      <Sep urgent={urgent} size={size} />
      <DigitPair n={seconds} urgent={urgent} size={size} />
    </>
  );

  const ariaTimer = {
    role: "timer" as const,
    "aria-live": "polite" as const,
    "aria-label": `Time remaining: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`,
  };

  return (
    <div className={cn("w-full min-w-0", className)}>
      <span
        className={cn(
          "mb-1.5 block font-medium uppercase tracking-[0.22em] text-luxe-offwhite/50",
          isCompact ? "text-[9px]" : "text-[10px]",
          labelClassName
        )}
      >
        {label}
      </span>
      {isCompact ? (
        <div {...ariaTimer}>
          <FitScaleRow>{row}</FitScaleRow>
        </div>
      ) : (
        <div
          className="flex max-w-full flex-nowrap items-center justify-start gap-0 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          {...ariaTimer}
        >
          {row}
        </div>
      )}
      <p
        className={cn(
          "mt-1.5 uppercase tracking-[0.28em] text-luxe-offwhite/35",
          isCompact ? "text-center text-[8px] sm:text-[9px]" : "text-[9px]"
        )}
      >
        JJ : HH : MM : SS
      </p>
    </div>
  );
}
