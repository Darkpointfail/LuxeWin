import type { Lot, PrizeCarouselItem } from "@/lib/types";
import { feedMediaUrl } from "@/lib/feed-media";

const Q = "w=1200&q=85&auto=format";

function img(url: string, alt: string, label?: string, caption?: string): PrizeCarouselItem {
  const base = url.includes("?") ? url.split("?")[0]! : url;
  return {
    type: "image",
    src: feedMediaUrl(`${base}?${Q}`),
    alt,
    label,
    caption,
  };
}

/** Resolved carousel items for the feed hero (always ≥1). */
export function getLotCarouselItems(lot: Lot): PrizeCarouselItem[] {
  if (lot.media.carousel?.length) {
    return lot.media.carousel.map((item) => ({
      ...item,
      src: item.type === "image" ? feedMediaUrl(item.src) : item.src,
    }));
  }

  const fromPhotos = lot.media.photos.map((src, i) =>
    img(src, `${lot.titre} — view ${i + 1}`, i === 0 ? "Prize" : "Lifestyle")
  );
  if (fromPhotos.length > 0) return fromPhotos;

  return [img(lot.media.posterUrl, lot.titre, "Prize")];
}

export function preloadCarouselItems(items: PrizeCarouselItem[], fromIndex = 0): void {
  if (typeof window === "undefined") return;
  const len = items.length;
  for (let offset = 0; offset <= 2; offset++) {
    const item = items[(fromIndex + offset) % len];
    if (!item || item.type !== "image") continue;
    const im = new window.Image();
    im.src = item.src;
  }
}
