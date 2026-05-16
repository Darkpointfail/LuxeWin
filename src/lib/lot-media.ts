import type { Lot } from "@/lib/types";

export function lotUsesVideo(lot: Pick<Lot, "media">): boolean {
  return Boolean(lot.media.videoUrl?.trim());
}

export function lotHeroPhoto(lot: Pick<Lot, "media">): string {
  return lot.media.photos[0] ?? lot.media.posterUrl;
}
