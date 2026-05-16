"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function ScrollProgress() {
  const progress = useMotionValue(0);
  const spring = useSpring(progress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const next = height > 0 ? scrollTop / height : 0;
      spring.set(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [spring]);

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-[2px] bg-luxe-smoke/50">
      <motion.div
        className="h-full origin-left bg-gold-gradient"
        style={{ scaleX: spring, width: "100%" }}
      />
    </div>
  );
}
