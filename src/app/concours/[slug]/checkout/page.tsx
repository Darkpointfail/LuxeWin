import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOTS, getLotBySlug } from "@/lib/data";
import { ContestCheckoutPage } from "@/components/contest-checkout-page";

export function generateStaticParams() {
  return LOTS.map((c) => ({ slug: c.id }));
}

export const metadata: Metadata = {
  title: "Checkout · Gaviom",
  description: "Secure payment for your draw entries.",
};

function parseQty(raw: string | string[] | undefined): number {
  const s = Array.isArray(raw) ? raw[0] : raw;
  const n = Number.parseInt(s ?? "1", 10);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(99, n));
}

export default function ContestCheckoutRoutePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const lot = getLotBySlug(params.slug);
  if (!lot) notFound();
  const qty = parseQty(searchParams.qty);

  return (
    <ContestCheckoutPage
      contestSlug={lot.id}
      contestTitle={lot.titre}
      ticketPrice={lot.ticketPrice}
      ticketsTotal={lot.ticketsTotal}
      ticketsSold={lot.ticketsSold}
      endDateIso={lot.endDate.toISOString()}
      initialQty={qty}
    />
  );
}
