import type { Lot } from "@/lib/types";
import { lotHeroPhoto, lotUsesVideo } from "@/lib/lot-media";

const warmedVideos = new Set<string>();

/** Hidden element keeps bytes in cache for faster play(). */
export function warmVideoInCache(url: string): void {
  if (typeof window === "undefined" || warmedVideos.has(url)) return;
  warmedVideos.add(url);
  const v = document.createElement("video");
  v.muted = true;
  v.playsInline = true;
  v.preload = "auto";
  v.src = url;
  v.load();
}

const FEED_CDN_HOSTS = new Set(["images.unsplash.com", "images.pexels.com"]);

/**
 * Réécrit les URLs des CDN du feed pour limiter la largeur réseau (première peinture plus rapide).
 * Unsplash et Pexels : `w=1080`, `q=82`, `auto=format` (remplace un éventuel `w=1920`, etc.).
 *
 * Pour des images hébergées ailleurs (upload manuel, CDN perso), idéal **sans** query de resize :
 * largeur **1080px**, hauteur **1920px** (ratio **9:16**, plein écran vertical), **JPG** ou **WebP**,
 * qualité **80–85%**, poids cible **< 300 ko**.
 */
export function feedMediaUrl(url: string): string {
  try {
    const u = new URL(url);
    if (!FEED_CDN_HOSTS.has(u.hostname)) return url;
    u.searchParams.set("w", "1080");
    u.searchParams.set("q", "82");
    u.searchParams.set("auto", "format");
    return u.toString();
  } catch {
    return url;
  }
}

export function lotFeedPoster(lot: Lot): string {
  return feedMediaUrl(lot.media.posterUrl);
}

export function lotFeedHeroPhoto(lot: Lot): string {
  return feedMediaUrl(lotHeroPhoto(lot));
}

/** Preload hero media for the first slides (runs once on feed mount). */
export function preloadLotMedia(lot: Lot): void {
  if (typeof window === "undefined") return;

  const poster = lotFeedPoster(lot);
  const posterImg = new window.Image();
  posterImg.src = poster;

  if (lotUsesVideo(lot) && lot.media.videoUrl) {
    warmVideoInCache(lot.media.videoUrl);
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "fetch";
    link.href = lot.media.videoUrl;
    link.crossOrigin = "anonymous";
    document.head.append(link);
    return;
  }

  const hero = lotFeedHeroPhoto(lot);
  if (hero !== poster) {
    const heroImg = new window.Image();
    heroImg.src = hero;
  }
}
