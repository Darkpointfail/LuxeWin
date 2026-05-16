export type LotCategory = "experience" | "objet" | "vehicule" | "digital";

export type LotPartner = {
  nom: string;
  logo: string;
  description: string;
  note: number;
};

export type LotMedia = {
  /** Absent = hero photo only (Tesla, MacBook, etc.). */
  videoUrl?: string;
  photos: string[];
  posterUrl: string;
  /** 1 = vitesse normale ; valeur plus basse = ralenti (ex. 0.65). */
  playbackRate?: number;
};

export type LotLocation = {
  ville: string;
  pays: string;
  lat: number;
  lng: number;
};

export type LeaderboardEntry = {
  pseudo: string;
  tickets: number;
};

/** Prize category for conditional UI (e.g. travel credit card). */
export type LotContestType =
  | "travel"
  | "watch"
  | "dining"
  | "experience"
  | "other";

export interface Lot {
  id: string;
  titre: string;
  tagline: string;
  categorie: LotCategory;
  partenaire: LotPartner;
  valeur: number;
  ticketPrice: number;
  ticketsTotal: number;
  ticketsSold: number;
  endDate: Date;
  publishedAt: Date;
  media: LotMedia;
  location?: LotLocation;
  description: string;
  journeeType?: string[];
  desirabiliteScore: number;
  membres_only: boolean;
  leaderboard: LeaderboardEntry[];
  /** When `"travel"`, show travel prize details if `travelCredit` is set. */
  contestType?: LotContestType;
  /** USD credit for travel drops; use with `contestType === "travel"`. */
  travelCredit?: number | null;
}

export type LotRaw = Omit<Lot, "endDate" | "publishedAt"> & {
  endDate: string;
  publishedAt: string;
};
