"use client";

import { useEffect } from "react";
import { LOTS } from "@/lib/data";
import { preloadLotMedia } from "@/lib/feed-media";
import { lotUsesVideo } from "@/lib/lot-media";

/** Warms CDN connections + hero media (videos cached for fast play). */
export function FeedMediaWarmup() {
  useEffect(() => {
    LOTS.slice(0, 3).forEach(preloadLotMedia);
    LOTS.filter(lotUsesVideo).forEach(preloadLotMedia);
  }, []);

  return null;
}
