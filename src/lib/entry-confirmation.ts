export type EntryMethod = "paid" | "free";

export type EntryConfirmationPayload = {
  method: EntryMethod;
  entryNumber: string;
  contestName: string;
  /** ISO date YYYY-MM-DD */
  closeDate: string;
  totalEntries: number;
  maxEntries: number;
  userGuess: string;
  /** Paid checkout only */
  ticketQty?: number;
  amountPaidUsd?: number;
  paymentMethod?: string;
};

export const ENTRY_CONFIRMATION_STORAGE_KEY = "gaviom_entry_confirmation";

/** Valeurs de démo / repli si aucune donnée URL ni localStorage */
export const ENTRY_CONFIRMATION_DEFAULTS: EntryConfirmationPayload = {
  method: "paid",
  entryNumber: "LW-2026-04821",
  contestName: "Ferrari 296 GTB · Track experience",
  closeDate: "2026-06-15",
  totalEntries: 847,
  maxEntries: 2000,
  userGuess: "Point D-7",
};

function parseIntSafe(v: string | undefined, fallback: number): number {
  if (v === undefined || v === "") return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseMethod(v: string | undefined): EntryMethod | undefined {
  if (v === "paid" || v === "free") return v;
  return undefined;
}

export function parseEntryFromSearchParams(sp: URLSearchParams): Partial<EntryConfirmationPayload> {
  const out: Partial<EntryConfirmationPayload> = {};
  const m = parseMethod(sp.get("method") ?? undefined);
  if (m) out.method = m;
  if (sp.get("entryNumber")) out.entryNumber = sp.get("entryNumber")!;
  if (sp.get("contestName")) out.contestName = sp.get("contestName")!;
  if (sp.get("closeDate")) out.closeDate = sp.get("closeDate")!;
  if (sp.get("totalEntries") != null && sp.get("totalEntries") !== "")
    out.totalEntries = parseIntSafe(sp.get("totalEntries") ?? undefined, ENTRY_CONFIRMATION_DEFAULTS.totalEntries);
  if (sp.get("maxEntries") != null && sp.get("maxEntries") !== "")
    out.maxEntries = parseIntSafe(sp.get("maxEntries") ?? undefined, ENTRY_CONFIRMATION_DEFAULTS.maxEntries);
  if (sp.get("userGuess")) out.userGuess = sp.get("userGuess")!;
  return out;
}

export function readEntryFromLocalStorage(): Partial<EntryConfirmationPayload> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ENTRY_CONFIRMATION_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, unknown>;
    const partial: Partial<EntryConfirmationPayload> = {};
    if (data.method === "paid" || data.method === "free") partial.method = data.method;
    if (typeof data.entryNumber === "string") partial.entryNumber = data.entryNumber;
    if (typeof data.contestName === "string") partial.contestName = data.contestName;
    if (typeof data.closeDate === "string") partial.closeDate = data.closeDate;
    if (typeof data.totalEntries === "number") partial.totalEntries = data.totalEntries;
    if (typeof data.maxEntries === "number") partial.maxEntries = data.maxEntries;
    if (typeof data.userGuess === "string") partial.userGuess = data.userGuess;
    if (typeof data.ticketQty === "number") partial.ticketQty = data.ticketQty;
    if (typeof data.amountPaidUsd === "number") partial.amountPaidUsd = data.amountPaidUsd;
    if (typeof data.paymentMethod === "string") partial.paymentMethod = data.paymentMethod;
    return partial;
  } catch {
    return null;
  }
}

export function mergeEntryPayload(
  slug: string,
  sp: URLSearchParams,
  stored: Partial<EntryConfirmationPayload> | null
): EntryConfirmationPayload {
  const fromUrl = parseEntryFromSearchParams(sp);
  const merged: EntryConfirmationPayload = {
    ...ENTRY_CONFIRMATION_DEFAULTS,
    ...(stored ?? {}),
    ...fromUrl,
  };
  if (fromUrl.contestName) {
    merged.contestName = decodeURIComponentSafe(fromUrl.contestName) ?? merged.contestName;
  }
  if (
    slug &&
    merged.contestName === ENTRY_CONFIRMATION_DEFAULTS.contestName &&
    !fromUrl.contestName &&
    !stored?.contestName
  ) {
    merged.contestName = humanizeSlug(slug);
  }
  merged.totalEntries = Math.max(0, Math.min(merged.totalEntries, merged.maxEntries));
  return merged;
}

function decodeURIComponentSafe(s: string | undefined): string | undefined {
  if (!s) return undefined;
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatCloseDateUS(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Numéro d’entrée affiché (côté client / démo, remplacer par la réponse API). */
export function generateEntryNumber(): string {
  const y = new Date().getFullYear();
  const n = Math.floor(10000 + Math.random() * 90000);
  return `LW-${y}-${n}`;
}

export function writeEntryConfirmation(payload: EntryConfirmationPayload): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ENTRY_CONFIRMATION_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

/** Après achat simulé, sans mini-jeu Spot the Detail, la « réponse » est un tiret jusqu’à branchement réel. */
export function buildPaidEntryPayload(
  input: {
    titre: string;
    endDate: Date;
    ticketsTotal: number;
    newSold: number;
    ticketQty?: number;
    ticketPrice?: number;
    paymentMethod?: string;
    userGuess?: string;
  }
): EntryConfirmationPayload {
  const close = input.endDate.toISOString().slice(0, 10);
  const ticketQty = Math.max(1, input.ticketQty ?? 1);
  const amountPaidUsd =
    input.ticketPrice != null ? Math.round(input.ticketPrice * ticketQty * 100) / 100 : undefined;
  return {
    method: "paid",
    entryNumber: generateEntryNumber(),
    contestName: input.titre,
    closeDate: close,
    totalEntries: Math.max(0, Math.min(input.newSold, input.ticketsTotal)),
    maxEntries: input.ticketsTotal,
    userGuess: input.userGuess?.trim() ? input.userGuess : ",",
    ticketQty,
    amountPaidUsd,
    paymentMethod: input.paymentMethod,
  };
}
