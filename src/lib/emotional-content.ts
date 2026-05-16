/** Storytelling & emotional conversion copy (not product data). */

export const HERO_EMOTIONAL_LINES = [
  {
    line1: "Someone’s claiming this Michelin night.",
    line2: "Why not you?",
  },
  {
    line1: "Luxury has never felt this close.",
    line2: "An ordinary life. An extraordinary win.",
  },
  {
    line1: "This life isn’t reserved for other people anymore.",
    line2: "A few dollars can rewrite your summer.",
  },
  {
    line1: "What if this time, it’s your name?",
    line2: "People like you win, every single week.",
  },
];

export type HeroDreamScene = {
  id: string;
  /** Poster / fallback while video loads */
  image: string;
  /** Full-bleed video (Pexels or your CDN) */
  video: string;
};

/**
 * Dream scenes in video, places, cars, yacht, hotels (royalty-free Pexels).
 * Swap in your own footage when ready.
 */
export const HERO_DREAM_SCENES: HeroDreamScene[] = [
  {
    id: "monaco",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=85",
    video:
      "https://videos.pexels.com/video-files/4763824/4763824-hd_1920_1080_24fps.mp4",
  },
  {
    id: "tesla",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1920&q=85",
    video:
      "https://videos.pexels.com/video-files/3044167/3044167-hd_1920_1080_30fps.mp4",
  },
  {
    id: "yacht",
    image:
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1920&q=85",
    video:
      "https://videos.pexels.com/video-files/1916785/1916785-hd_1920_1080_30fps.mp4",
  },
  {
    id: "suite",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=85",
    video:
      "https://videos.pexels.com/video-files/3214448/3214448-hd_1920_1080_25fps.mp4",
  },
  {
    id: "fine-dining",
    image:
      "https://images.unsplash.com/photo-1578472976974-ee036274c769?w=1920&q=85",
    video: "https://assets.mixkit.co/videos/4385/4385-1080.mp4",
  },
  {
    id: "vip",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=85",
    video:
      "https://videos.pexels.com/video-files/3773485/3773485-hd_1920_1080_25fps.mp4",
  },
];

export const CONTEST_CATEGORY_PILLS = [
  { id: "cars", label: "Cars" },
  { id: "watches", label: "Watches" },
  { id: "travel", label: "Travel" },
  { id: "vip", label: "VIP experiences" },
  { id: "cash", label: "Cash prizes" },
  { id: "accessible", label: "Attainable luxury" },
  { id: "flash", label: "Flash drops" },
  { id: "tiktok", label: "Trending now" },
  { id: "under10", label: "Under $10" },
  { id: "soldout", label: "Almost sold out" },
] as const;

export const LIVE_TICKER_MESSAGES = [
  "Alex from Miami just secured entries on the Tesla drop",
  "Two members locked spots 12 seconds ago",
  "Monaco weekend, people are watching this one",
  "Jordan in NYC just stacked 3 entries",
  "Only 149 spots left on a private VIP experience",
  "Heavy traffic on the Michelin dining drop this week",
  "Final hours, palace weekend closing soon",
  "Sam just joined the fine dining drop",
];

export type SevenEuroStory = {
  id: string;
  name: string;
  before: string;
  after: string;
  detail: string;
  photo: string;
};

export const STORIES_7_EURO: SevenEuroStory[] = [
  {
    id: "s1",
    name: "Marcus, 34, transit operator",
    before: "Five-star dining was always someone else’s reservation.",
    after: "We still talk about every course, months later.",
    detail: "Michelin tasting for two, about $120 in entries total.",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    id: "s2",
    name: "Jordan, 28, nurse",
    before: "I’d never checked into a five-star on my own dime.",
    after: "Our Monaco weekend felt like a film. My mom cried on FaceTime.",
    detail: "Two-night stay, a handful of $7 entries.",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
  },
  {
    id: "s3",
    name: "David, 41, contractor",
    before: "The Tesla was the dream we joked about in the driveway.",
    after: "I plugged it in at home. The whole block came out.",
    detail: "Model 3, he’d entered a few times before it hit.",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
  },
];
