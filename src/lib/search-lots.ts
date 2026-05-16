import type { Lot } from "@/lib/types";
import { categorieLabel } from "@/lib/data";

function fold(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Recherche dans titres, accroches, catégorie, partenaire, lieu, extrait de description. */
export function searchLots(lots: readonly Lot[], rawQuery: string): Lot[] {
  const q = rawQuery.trim();
  if (!q) return [];

  const needle = fold(q);
  const words = needle.split(/\s+/).filter(Boolean);

  return lots.filter((lot) => {
    const hay = fold(
      [
        lot.titre,
        lot.tagline,
        categorieLabel(lot.categorie),
        lot.partenaire.nom,
        lot.description.slice(0, 320),
        lot.id.replace(/-/g, " "),
        lot.location?.ville,
        lot.location?.pays,
      ]
        .filter(Boolean)
        .join(" ")
    );

    if (words.length <= 1) return hay.includes(needle);
    return words.every((w) => hay.includes(w));
  });
}
