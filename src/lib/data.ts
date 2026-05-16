import type { Lot } from "@/lib/types";

const HOUR_MS = 60 * 60 * 1000;

function tHours(n: number) {
  return new Date(Date.now() + n * HOUR_MS);
}

function tPublished(hoursAgo: number) {
  return new Date(Date.now() - hoursAgo * HOUR_MS);
}

/** Full drops, vertical feed + narrative detail pages. */
export const LOTS: Lot[] = [
  {
    id: "vegas-travel-credit",
    titre: "48 hours in Vegas you'll never forget.",
    tagline: "Neon, suites, and the version of you that only exists after midnight.",
    categorie: "experience",
    contestType: "travel",
    travelCredit: 5500,
    partenaire: {
      nom: "Gaviom Travel Desk",
      logo: "",
      description: "Booking guidance for suites, shows, dining, and nightlife in Las Vegas.",
      note: 4.92,
    },
    valeur: 5500,
    ticketPrice: 39,
    ticketsTotal: 650,
    ticketsSold: 318,
    endDate: tHours(36),
    publishedAt: tPublished(18),
    media: {
      posterUrl:
        "https://images.unsplash.com/photo-1623107935331-7164fb0d6978?w=2400&q=92",
      photos: [
        "https://images.unsplash.com/photo-1623107935331-7164fb0d6978?w=2400&q=92",
        "https://images.unsplash.com/photo-1755875341361-73fc174ecc51?w=2400&q=92",
        "https://images.unsplash.com/photo-1668261929011-4ade8c225292?w=2400&q=92",
      ],
    },
    location: {
      ville: "Las Vegas",
      pays: "USA",
      lat: 36.1699,
      lng: -115.1398,
    },
    description:
      "This is the montage: skyline turning pink over the Strip, a suite that feels borrowed from a movie, pool mornings like private cinema, dinners where the room notices you arrived. If life interrupts the fantasy, take the cash equivalent, same moment of possibility, your timeline.",
    journeeType: [
      "Arrival that feels like a hard cut to the good part",
      "Strip nights, reservations, velvet ropes, zero filler",
      "Slow pool morning, then another round of main-character energy",
      "Last-call neon walk before you float home",
    ],
    desirabiliteScore: 4.88,
    membres_only: false,
    leaderboard: [
      { pseudo: "J***n · Austin", tickets: 14 },
      { pseudo: "M***e · NYC", tickets: 11 },
      { pseudo: "T***s · Miami", tickets: 8 },
    ],
  },
  {
    id: "iphone-17-pro-max",
    titre: "The pocket upgrade everyone's filming on.",
    tagline: "Pro optics. All-night stamina. Notifications that feel expensive.",
    categorie: "digital",
    partenaire: {
      nom: "Apple",
      logo: "",
      description: "Latest Pro iPhone tier at time of fulfillment.",
      note: 4.95,
    },
    valeur: 1400,
    ticketPrice: 19,
    ticketsTotal: 1200,
    ticketsSold: 892,
    endDate: tHours(24),
    publishedAt: tPublished(6),
    media: {
      posterUrl:
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1920&q=90",
      photos: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1920&q=90",
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1920&q=90",
      ],
    },
    description:
      "It’s the device your camera roll has been begging for, glass-calm UI, batteries that outlast the afterparty, optics that make golden hour look unfair. Factory-sealed when it ships. Already locked into another ecosystem? Swap for the cash equivalent and fund your own upgrade.",
    desirabiliteScore: 4.7,
    membres_only: false,
    leaderboard: [
      { pseudo: "D***a · SF", tickets: 31 },
      { pseudo: "O***n · NYC", tickets: 21 },
      { pseudo: "I***a · Portland", tickets: 15 },
    ],
  },
  {
    id: "luxury-cruise-two",
    titre: "The kind of trip people post for years.",
    tagline: "Seven nights where the only agenda is horizon, deck, repeat.",
    categorie: "experience",
    partenaire: {
      nom: "Gaviom Voyages",
      logo: "",
      description: "Premium ocean itineraries with balcony assurance.",
      note: 4.9,
    },
    valeur: 12500,
    ticketPrice: 59,
    ticketsTotal: 480,
    ticketsSold: 276,
    endDate: tHours(96),
    publishedAt: tPublished(120),
    media: {
      posterUrl:
        "https://images.unsplash.com/photo-1663783755373-3b4e67a4202c?w=2400&q=92",
      photos: [
        "https://images.unsplash.com/photo-1663783755373-3b4e67a4202c?w=2400&q=92",
        "https://images.unsplash.com/photo-1692735678510-03d976e6565e?w=2400&q=92",
      ],
    },
    location: {
      ville: "Miami",
      pays: "USA",
      lat: 25.7617,
      lng: -80.1918,
    },
    description:
      "Balcony mornings with salt on the wind, dinners that taste like passport stamps, sea days that actually earn their slow motion. Two chairs on the rail, zero guilt about doing nothing beautifully. Can’t sail this chapter yet? The cash equivalent keeps the win honest.",
    journeeType: [
      "Embark like you upgraded reality",
      "Sea days, spa, tastings, golden-hour decks",
      "Ports curated like a highlight reel",
      "Final glam night before reality texts you back",
    ],
    desirabiliteScore: 4.86,
    membres_only: false,
    leaderboard: [
      { pseudo: "R***d · Chicago", tickets: 19 },
      { pseudo: "S***a · SF", tickets: 14 },
      { pseudo: "H***o · Dallas", tickets: 9 },
    ],
  },
  {
    id: "supercar-experience",
    titre: "One drive. Main character energy.",
    tagline:
      "Circuit metal. Instructor pace. The lap you'll replay behind closed eyes.",
    categorie: "experience",
    partenaire: {
      nom: "Gaviom Motorsport",
      logo: "",
      description: "Circuit partners across North America and EU hubs.",
      note: 4.93,
    },
    valeur: 3200,
    ticketPrice: 45,
    ticketsTotal: 420,
    ticketsSold: 301,
    endDate: tHours(12),
    publishedAt: tPublished(48),
    media: {
      posterUrl:
        "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1920&q=90",
      photos: [
        "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1920&q=90",
        "https://images.unsplash.com/photo-1681869916819-cb81574a02e7?w=1920&q=90",
      ],
    },
    location: {
      ville: "Las Vegas",
      pays: "USA",
      lat: 36.2725,
      lng: -115.0063,
    },
    description:
      "Pick your villain arc, Porsche 911 GT3, Ferrari, or Lamborghini, on a closed circuit with briefing, lead-follow heat, and that holy stretch where tires talk back. Helmet cam optional, goosebumps mandatory. Rather spectate? Pocket the cash equivalent and watch from the luxury of restraint.",
    journeeType: [
      "Suit up, safety, telemetry, respect for the machine",
      "Warm laps until your hands stop shaking",
      "Open segments where speed stops being theoretical",
      "Cooldown, certificate flex, photo proof it happened",
    ],
    desirabiliteScore: 4.91,
    membres_only: false,
    leaderboard: [
      { pseudo: "R***y · Seattle", tickets: 17 },
      { pseudo: "T***a · Dallas", tickets: 13 },
      { pseudo: "M***k · Toronto", tickets: 10 },
    ],
  },
];

export function getLotBySlug(slug: string): Lot | undefined {
  return LOTS.find((l) => l.id === slug);
}

export function categorieLabel(c: Lot["categorie"]): string {
  const map: Record<Lot["categorie"], string> = {
    experience: "Escape",
    objet: "Artifact",
    vehicule: "Machine",
    digital: "Signal",
  };
  return map[c];
}

/** Feed / Explore mood chip, cinematic, not categorical inventory. */
export function feedMoodForLot(lot: Lot): string {
  const moods: Record<string, string> = {
    "vegas-travel-credit": "Neon escape",
    "iphone-17-pro-max": "Status hit",
    "luxury-cruise-two": "Sea dream",
    "supercar-experience": "Pure adrenaline",
  };
  return moods[lot.id] ?? "Experience";
}

export type ExploreMoodPreset = {
  id: string;
  label: string;
  hint: string;
  /** Narrow the runway without sounding like SKU filters. */
  filter: (lot: Lot) => boolean;
};

export const EXPLORE_MOOD_PRESETS: ExploreMoodPreset[] = [
  { id: "all", label: "Full runway", hint: "Everything playing now", filter: () => true },
  {
    id: "trending",
    label: "Trending tonight",
    hint: "What timelines want",
    filter: (l) => ["vegas-travel-credit", "iphone-17-pro-max"].includes(l.id),
  },
  {
    id: "escapes",
    label: "Luxury escapes",
    hint: "Skyline · swell · suite life",
    filter: (l) => ["vegas-travel-credit", "luxury-cruise-two"].includes(l.id),
  },
  {
    id: "adrenaline",
    label: "Adrenaline",
    hint: "Rubber · horsepower · heartbeat",
    filter: (l) => l.id === "supercar-experience",
  },
  {
    id: "status",
    label: "Status symbols",
    hint: "What stops thumbs mid-scroll",
    filter: (l) => l.id === "iphone-17-pro-max",
  },
];

/** Rotating footer micro-lines on feed slides, emotional, non-transactional. */
export const FEED_WHISPER_LINES = [
  "Tonight could change everything.",
  "Your next story starts here.",
  "Not everyone gets this kind of moment.",
  "This summer could look different.",
  "Someone will wake up in that suite.",
  "What if this becomes your camera roll?",
  "Stay until the drop breathes.",
] as const;

/** UI filters, category order, framed as discovery, not inventory. */
export const CATEGORY_FILTERS: {
  value: Lot["categorie"] | "tous";
  label: string;
}[] = [
  { value: "tous", label: "All worlds" },
  { value: "experience", label: "Escapes & nights" },
  { value: "objet", label: "Artifacts" },
  { value: "vehicule", label: "Machines" },
  { value: "digital", label: "Signals" },
];

/** @deprecated Prefer `Lot` + `LOTS`, kept for legacy components. */
export type Concour = {
  id: string;
  titre: string;
  categorie: string;
  valeur: number;
  ticketPrice: number;
  ticketsTotal: number;
  ticketsSold: number;
  hoursLeft: number;
  image: string;
  description: string;
};

function lotToConcour(lot: Lot): Concour {
  const ms = lot.endDate.getTime() - Date.now();
  const hoursLeft = Math.max(1, Math.ceil(ms / HOUR_MS));
  return {
    id: lot.id,
    titre: lot.titre,
    categorie: categorieLabel(lot.categorie),
    valeur: lot.valeur,
    ticketPrice: lot.ticketPrice,
    ticketsTotal: lot.ticketsTotal,
    ticketsSold: lot.ticketsSold,
    hoursLeft,
    image: lot.media.posterUrl,
    description: lot.description,
  };
}

export const CONCOURS_MOCK: Concour[] = LOTS.map(lotToConcour);

export type Temoignage = {
  id: string;
  nom: string;
  citation: string;
  lot: string;
  date: string;
  photo: string;
};

export const TEMOIGNAGES_MOCK: Temoignage[] = [
  {
    id: "1",
    nom: "Sophie M.",
    citation:
      "I didn’t think it was real. Three weeks later the Strip lights were ours. Gaviom is the real thing.",
    lot: "48 hours in Vegas you'll never forget.",
    date: "Mar 2026",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    id: "2",
    nom: "Marcus D.",
    citation:
      "Transparent draw, white-glove team. That balcony at sea still feels unreal.",
    lot: "The kind of trip people post for years.",
    date: "Jan 2026",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    id: "3",
    nom: "Leah R.",
    citation:
      "One entry. One life upgrade. The Pro Max landed sealed exactly as promised.",
    lot: "The pocket upgrade everyone's filming on.",
    date: "Feb 2026",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
];

export type Gagnant = {
  id: string;
  nom: string;
  ville: string;
  lot: string;
  valeurLot: number;
  ticketsAchetes: number;
  dateTirage: string;
  participants: number;
  photo: string;
  temoignage: string;
  experienceVecue: string;
  videoUrl?: string;
  categorie?: Lot["categorie"];
};

export const GAGNANTS_PAGE_STATS = {
  totalWinners: 128,
  totalValueDelivered: 340_000,
  nextDrawInDays: 2,
};

export type TirageTimelineEntry = {
  id: string;
  date: string;
  lot: string;
  gagnantMasque: string;
  ville: string;
  participants: number;
  statut: "remis" | "en_cours";
};

/** Completed draws for a contest title / prize title from LOTS (exact match). */
export function drawTimelineForLotTitle(titre: string): TirageTimelineEntry[] {
  return DRAW_TIMELINE_GAGNANTS.filter((e) => e.lot === titre);
}

export const DRAW_TIMELINE_GAGNANTS: TirageTimelineEntry[] = [
  {
    id: "t1",
    date: "May 12, 2026",
    lot: "The pocket upgrade everyone's filming on.",
    gagnantMasque: "M***e",
    ville: "New York",
    participants: 412,
    statut: "remis",
  },
  {
    id: "t2",
    date: "Apr 28, 2026",
    lot: "One drive. Main character energy.",
    gagnantMasque: "J***n",
    ville: "Austin",
    participants: 500,
    statut: "remis",
  },
  {
    id: "t3",
    date: "Apr 2, 2026",
    lot: "The kind of trip people post for years.",
    gagnantMasque: "D***a",
    ville: "San Francisco",
    participants: 480,
    statut: "remis",
  },
  {
    id: "t4",
    date: "Mar 19, 2026",
    lot: "48 hours in Vegas you'll never forget.",
    gagnantMasque: "K***m",
    ville: "Denver",
    participants: 650,
    statut: "remis",
  },
];

/** Feed marquee; synced with draw timeline so the strip reads as proof, not hype. */
export const FEED_WINNER_TICKER_LINES: string[] = [
  `${GAGNANTS_PAGE_STATS.totalWinners} verified winners · prizes fulfilled`,
  ...DRAW_TIMELINE_GAGNANTS.map((e) => {
    const lotShort =
      e.lot.length > 46 ? `${e.lot.slice(0, 44)}…` : e.lot;
    return `Winner · ${e.gagnantMasque} · ${e.ville} · ${lotShort} · ${e.date}`;
  }),
];

export const GAGNANTS_MOCK: Gagnant[] = [
  {
    id: "g1",
    nom: "Thomas B.",
    ville: "Austin",
    lot: "Palace weekend, Paris",
    valeurLot: 5200,
    ticketsAchetes: 3,
    dateTirage: "Apr 3, 2026",
    participants: 320,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
    temoignage:
      "I grabbed three entries on a whim. The next morning I was calling my partner, we were going.",
    experienceVecue:
      "Two nights in a signature suite over the rooftops, Michelin dinner, private spa access, every beat felt scripted like a film.",
    categorie: "experience",
  },
  {
    id: "g2",
    nom: "Camille V.",
    ville: "Los Angeles",
    lot: "Dior Lady bag",
    valeurLot: 6800,
    ticketsAchetes: 1,
    dateTirage: "Mar 21, 2026",
    participants: 890,
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    temoignage:
      "I hesitated for one second. So glad I didn’t. The package arrived sealed with the full Dior ritual.",
    experienceVecue:
      "Private boutique appointment, try-on, scarf personalization, a day I’ll replay forever.",
    categorie: "objet",
  },
  {
    id: "g3",
    nom: "Julian L.",
    ville: "Miami",
    lot: "Four Seasons escape",
    valeurLot: 7400,
    ticketsAchetes: 5,
    dateTirage: "Feb 8, 2026",
    participants: 210,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
    temoignage:
      "Crystal-clear process, real win. The team walked me to check-in, zero ambiguity.",
    experienceVecue:
      "Ocean-view suite, balcony breakfast, concierge anticipating every ask before I asked.",
    categorie: "experience",
  },
  {
    id: "g4",
    nom: "Amelia K.",
    ville: "New York",
    lot: "Omega Speedmaster",
    valeurLot: 8200,
    ticketsAchetes: 2,
    dateTirage: "Jan 17, 2026",
    participants: 540,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    temoignage:
      "My first entry. My first major win. My family still didn’t believe me on FaceTime.",
    experienceVecue:
      "In-boutique fitting, bracelet adjustment, complimentary engraving, total professionalism.",
    categorie: "objet",
  },
];

export const PARTENAIRES = ["Dior", "Tesla", "Four Seasons", "Eleven Madison Park", "Hermès", "Ritz"];

export const LIVE_NAMES = [
  "Jordan · Austin",
  "Marie · NYC",
  "Thomas · LA",
  "Leah · Miami",
  "Hugo · Chicago",
  "Emma · SF",
  "Lucas · Denver",
  "Chloe · Seattle",
];

export function concoursBySlug(slug: string) {
  return CONCOURS_MOCK.find((c) => c.id === slug);
}

export function serializeConcoursForClient(c: Concour) {
  return {
    ...c,
    endDate: new Date(Date.now() + c.hoursLeft * HOUR_MS).toISOString(),
  };
}

export type ConcourClient = ReturnType<typeof serializeConcoursForClient>;
