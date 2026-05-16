"use client";

import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import { formatTravelCreditUsd } from "@/lib/format-display";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
});

export type TravelPrizeDetailsProps = {
  travelCredit: number;
};

export function TravelPrizeDetails({ travelCredit }: TravelPrizeDetailsProps) {
  const amountDisplay = formatTravelCreditUsd(travelCredit);

  return (
    <aside
      className={`my-6 rounded-lg border border-[rgba(201,168,76,0.2)] bg-[#1A1A1A] p-6 ${dmSans.className}`}
      aria-labelledby="travel-prize-details-heading"
    >
      <h2
        id="travel-prize-details-heading"
        className="mb-4 text-[11px] font-medium uppercase tracking-[0.1em] text-[rgba(250,250,248,0.4)]"
      >
        Prize details
      </h2>

      <div className="space-y-4">
        <p className={`text-[28px] font-medium leading-tight text-[#C9A84C] ${cormorant.className}`}>
          Travel Credit: {amountDisplay}
        </p>

        <ul className="space-y-2 border-t border-[rgba(255,255,255,0.08)] pt-4 text-[13px] leading-[1.8] text-[rgba(250,250,248,0.7)]">
          <li className="pl-3">
            → Winner receives a {amountDisplay} travel credit redeemable on Expedia, Booking.com, or equivalent
            platform
          </li>
          <li className="pl-3">
            → Credit covers flights, hotel, or both, winner&apos;s choice
          </li>
          <li className="pl-3">→ Valid for 12 months from winner notification date</li>
          <li className="pl-3">→ Winner books their own travel from their city of choice</li>
          <li className="pl-3">→ No fixed departure city required</li>
        </ul>

        <div className="my-4 border-t border-[rgba(255,255,255,0.08)]" />

        <div className="space-y-2 text-[13px] leading-[1.8] text-[rgba(250,250,248,0.7)]">
          <p className="font-medium text-[rgba(250,250,248,0.82)]">What&apos;s included:</p>
          <ul className="space-y-1.5 pl-1">
            <li className="flex gap-2 pl-2">
              <span className="shrink-0 text-[#C9A84C]">✦</span>
              <span>
                {amountDisplay} travel credit (digital delivery within 48h of winner verification)
              </span>
            </li>
            <li className="flex gap-2 pl-2">
              <span className="shrink-0 text-[#C9A84C]">✦</span>
              <span>No blackout dates</span>
            </li>
            <li className="flex gap-2 pl-2">
              <span className="shrink-0 text-[#C9A84C]">✦</span>
              <span>Redeemable worldwide</span>
            </li>
          </ul>
        </div>

        <div className="my-4 border-t border-[rgba(255,255,255,0.08)]" />

        <div className="space-y-2 text-[13px] leading-[1.8] text-[rgba(250,250,248,0.7)]">
          <p className="font-medium text-[rgba(250,250,248,0.82)]">What&apos;s not included:</p>
          <ul className="space-y-1.5 pl-1">
            <li className="flex gap-2 pl-2">
              <span className="shrink-0 text-[#C9A84C]">✦</span>
              <span>Travel insurance (recommended)</span>
            </li>
            <li className="flex gap-2 pl-2">
              <span className="shrink-0 text-[#C9A84C]">✦</span>
              <span>Visa fees if applicable</span>
            </li>
            <li className="flex gap-2 pl-2">
              <span className="shrink-0 text-[#C9A84C]">✦</span>
              <span>Meals and personal expenses</span>
            </li>
          </ul>
        </div>

        <p className="mt-4 border-t border-[rgba(255,255,255,0.08)] pt-4 text-[12px] italic leading-relaxed text-[rgba(250,250,248,0.4)]">
          ⚠ Gaviom is not responsible for flight cancellations, delays, or any travel disruptions. Winner is
          responsible for all booking arrangements.
        </p>
      </div>
    </aside>
  );
}
