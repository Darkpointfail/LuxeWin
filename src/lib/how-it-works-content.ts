/** Shared copy for /comment-ca-marche and lightweight “how it works” hints elsewhere. */
export type HowItWorksStep = {
  title: string;
  body: string;
};

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    title: "Explore the prize",
    body: "Cinematic visuals, line-by-line itinerary, estimated value, you know exactly what you’re entering for.",
  },
  {
    title: "Choose your entries",
    body: "Stack transparently. Every entry is numbered, tracked, and reflected live as the drop fills.",
  },
  {
    title: "Secure checkout",
    body: "Encrypted transactions, trusted processors, no data hoarding beyond what fulfillment requires.",
  },
  {
    title: "Close & verified draw",
    body: "When the countdown ends, our supervised protocol runs, timestamped, auditable, published.",
  },
  {
    title: "Winner announced",
    body: "Direct outreach, ID verification, then white-glove delivery or experience coordination.",
  },
];

/** Ultra-short rhythm for feed / chips (same order as steps 1→3 highlights). */
export const HOW_IT_WORKS_MICRO_LINE = "Pick a drop · Pay securely · Verified draw";
