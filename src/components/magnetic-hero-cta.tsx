"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function MagneticHeroCta({ href, children, className }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = linkRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * 0.22);
    y.set((e.clientY - cy) * 0.22);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="inline-block will-change-transform"
    >
      <Link
        ref={linkRef}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={cn(
          "relative inline-flex min-h-[3.25rem] items-center justify-center overflow-hidden rounded-lg bg-gold px-10 text-base font-medium tracking-wide text-luxe-black",
          "shadow-[0_0_0_1px_rgba(240,208,128,0.4),0_0_40px_rgba(201,168,76,0.35),0_12px_40px_rgba(0,0,0,0.45)]",
          "transition-colors duration-300 hover:bg-gold-light",
          "animate-glow-breathe active:scale-[0.98]",
          "after:pointer-events-none after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent",
          "after:translate-x-[-120%] after:transition-transform after:duration-700 hover:after:translate-x-[120%]",
          className
        )}
      >
        <span className="relative z-[1]">{children}</span>
      </Link>
    </motion.div>
  );
}
