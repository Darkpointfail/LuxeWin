"use client";

import { useEffect, type RefObject } from "react";

type Options = {
  src?: string;
  active: boolean;
  playbackRate?: number;
  onPlaying?: () => void;
};

/** Start playback as soon as the first frames are ready (not after full buffer). */
export function useFastAutoplayVideo(
  ref: RefObject<HTMLVideoElement | null>,
  { src, active, playbackRate = 1, onPlaying }: Options
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;

    el.playbackRate = playbackRate;

    const tryPlay = () => {
      if (!active) return;
      el.playbackRate = playbackRate;
      void el.play().catch(() => {});
    };

    const handlePlaying = () => onPlaying?.();

    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);
    el.addEventListener("playing", handlePlaying);

    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      tryPlay();
    }

    if (active) {
      tryPlay();
    } else {
      el.pause();
      try {
        el.currentTime = 0;
      } catch {
        /* ignore */
      }
    }

    return () => {
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
      el.removeEventListener("playing", handlePlaying);
    };
  }, [ref, src, active, playbackRate, onPlaying]);
}
