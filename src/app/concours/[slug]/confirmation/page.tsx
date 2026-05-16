import type { Metadata } from "next";
import { EntryConfirmationPage } from "@/components/entry-confirmation-page";

export const metadata: Metadata = {
  title: "Entry confirmed, Gaviom",
  description:
    "Your luxury draw entry is on file. Entry number, official rules (AMOE), and what happens next.",
};

function firstParam(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default function EntryConfirmationRoutePage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const showAppleDisclaimer = firstParam(searchParams.apple) === "1";
  return (
    <EntryConfirmationPage
      contestId={params.slug}
      searchParams={searchParams}
      showAppleDisclaimer={showAppleDisclaimer}
    />
  );
}
