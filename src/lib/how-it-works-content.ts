/** Shared copy for /comment-ca-marche and lightweight “how it works” hints elsewhere. */
export type HowItWorksStep = {
  title: string;
  body: string;
};

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    title: "Pick a prize",
    body: "Each contest lists the exact prize, estimated value, ticket price, and closing date , no surprises at checkout.",
  },
  {
    title: "Buy your tickets",
    body: "Every ticket is numbered and tied to your account. Stack as many as you want before entries close.",
  },
  {
    title: "Pay securely",
    body: "Encrypted checkout through trusted processors. Free postal entry is available where required by law.",
  },
  {
    title: "Verified random draw",
    body: "When the contest closes, we run a certified random draw (Random.org), timestamped and auditable.",
  },
  {
    title: "Winner announced on camera",
    body: "We verify ID, film the announcement, and deliver the prize , or the cash equivalent if you prefer.",
  },
];

/** Ultra-short rhythm for feed / chips. */
export const HOW_IT_WORKS_MICRO_LINE = "Buy tickets · Random draw · One winner";
