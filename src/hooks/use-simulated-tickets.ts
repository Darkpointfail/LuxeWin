"use client";

import { useEffect, useState, useCallback } from "react";

export function useSimulatedTickets(initialSold: number, total: number) {
  const [sold, setSold] = useState(initialSold);

  const tick = useCallback(() => {
    setSold((s) => {
      const delta = Math.floor(Math.random() * 3) + 1;
      const sign = Math.random() > 0.15 ? 1 : -1;
      const next = Math.min(total, Math.max(0, s + sign * delta));
      return next;
    });
  }, [total]);

  useEffect(() => {
    const schedule = () =>
      8000 + Math.floor(Math.random() * 7000);
    let id: ReturnType<typeof setTimeout>;
    const loop = () => {
      id = setTimeout(() => {
        tick();
        loop();
      }, schedule());
    };
    loop();
    return () => clearTimeout(id);
  }, [tick]);

  return [sold, setSold] as const;
}
