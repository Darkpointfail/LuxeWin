import { notFound } from "next/navigation";
import { LOTS, getLotBySlug } from "@/lib/data";
import { serializeLot } from "@/lib/lot-serde";
import { ConcoursLotView } from "@/components/concours-lot-view";

export function generateStaticParams() {
  return LOTS.map((c) => ({ slug: c.id }));
}

export default function ConcoursPage({
  params,
}: {
  params: { slug: string };
}) {
  const lot = getLotBySlug(params.slug);
  if (!lot) notFound();
  return <ConcoursLotView serialized={serializeLot(lot)} />;
}
