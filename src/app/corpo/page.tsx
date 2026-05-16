import type { Metadata } from "next";
import { CorpoCorporatePage } from "@/components/corpo-corporate-page";

export const metadata: Metadata = {
  title: "Gaviom Corpo, Luxury drops for teams",
  description:
    "Tiered company packs, email-delivered entries, secure online participation. From ~$25 per employee per year. Book a walkthrough.",
};

export default function CorpoPage() {
  return <CorpoCorporatePage />;
}
