import type { Lot } from "@/lib/types";

export type LotSerialized = Omit<Lot, "endDate" | "publishedAt"> & {
  endDate: string;
  publishedAt: string;
};

export function serializeLot(lot: Lot): LotSerialized {
  return {
    ...lot,
    endDate: lot.endDate.toISOString(),
    publishedAt: lot.publishedAt.toISOString(),
  };
}

export function hydrateLot(s: LotSerialized): Lot {
  return {
    ...s,
    endDate: new Date(s.endDate),
    publishedAt: new Date(s.publishedAt),
  };
}
