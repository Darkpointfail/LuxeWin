"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Lock, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { formatUsd, formatShortDateUS } from "@/lib/format-display";
import { buildPaidEntryPayload, writeEntryConfirmation } from "@/lib/entry-confirmation";
import { useSimulatedTickets } from "@/hooks/use-simulated-tickets";
import { burstGold } from "@/lib/confetti-burst";
import { useFeedStore } from "@/stores/feed-store";
import { cn } from "@/lib/utils";

const QUANTITIES = [1, 3, 5, 10] as const;

type PaymentMethodId = "card" | "apple_pay" | "google_pay" | "paypal";

const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  description: string;
  Icon: typeof CreditCard;
}[] = [
  {
    id: "card",
    label: "Card",
    description: "Visa, Mastercard, Amex",
    Icon: CreditCard,
  },
  {
    id: "apple_pay",
    label: "Apple Pay",
    description: "Face ID or Touch ID",
    Icon: Smartphone,
  },
  {
    id: "google_pay",
    label: "Google Pay",
    description: "Saved on this device",
    Icon: Smartphone,
  },
  {
    id: "paypal",
    label: "PayPal",
    description: "Balance or linked card",
    Icon: CreditCard,
  },
];

function labelForMethod(id: PaymentMethodId): string {
  return PAYMENT_METHODS.find((m) => m.id === id)?.label ?? id;
}

export type ContestCheckoutPageProps = {
  contestSlug: string;
  contestTitle: string;
  ticketPrice: number;
  ticketsTotal: number;
  ticketsSold: number;
  endDateIso: string;
  initialQty: number;
};

export function ContestCheckoutPage({
  contestSlug,
  contestTitle,
  ticketPrice,
  ticketsTotal,
  ticketsSold,
  endDateIso,
  initialQty,
}: ContestCheckoutPageProps) {
  const router = useRouter();
  const registerPurchase = useFeedStore((s) => s.registerPurchase);
  const endDate = useMemo(() => new Date(endDateIso), [endDateIso]);
  const [sold, setSold] = useSimulatedTickets(ticketsSold, ticketsTotal);
  const [qty, setQty] = useState(() => Math.max(1, Math.min(99, initialQty)));
  const [method, setMethod] = useState<PaymentMethodId>("card");
  const [submitting, setSubmitting] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const total = qty * ticketPrice;
  const closesLabel = formatShortDateUS(endDate);

  const validateCard = useCallback((): boolean => {
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 15 || digits.length > 19 || /\D/.test(digits)) {
      toast.error("Enter a valid card number.");
      return false;
    }
    if (!/^\d{2}\s*\/\s*\d{2}$/.test(expiry.trim())) {
      toast.error("Use expiry as MM / YY.");
      return false;
    }
    if (!/^\d{3,4}$/.test(cvc.trim())) {
      toast.error("Enter a valid security code.");
      return false;
    }
    if (cardName.trim().length < 2) {
      toast.error("Enter the name on the card.");
      return false;
    }
    return true;
  }, [cardName, cardNumber, cvc, expiry]);

  const onPay = useCallback(() => {
    if (submitting) return;
    if (method === "card" && !validateCard()) return;

    setSubmitting(true);
    window.setTimeout(() => {
      const newSold = Math.min(ticketsTotal, sold + qty);
      setSold(newSold);
      registerPurchase();
      burstGold();
      if (navigator.vibrate) navigator.vibrate(50);

      writeEntryConfirmation(
        buildPaidEntryPayload({
          titre: contestTitle,
          endDate,
          ticketsTotal,
          newSold,
          ticketQty: qty,
          ticketPrice,
          paymentMethod: labelForMethod(method),
        })
      );

      setSubmitting(false);
      router.push(`/concours/${contestSlug}/confirmation`);
    }, 1100);
  }, [
    contestSlug,
    contestTitle,
    endDate,
    method,
    qty,
    registerPurchase,
    router,
    sold,
    submitting,
    ticketPrice,
    ticketsTotal,
    validateCard,
    setSold,
  ]);

  return (
    <div className="min-h-screen bg-[#030303] pb-[max(2rem,env(safe-area-inset-bottom))] text-[var(--off-white)]">
      <header className="border-b border-white/[0.06] bg-[#030303]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href={`/concours/${contestSlug}`}
            className="inline-flex items-center gap-2 font-display text-[13px] text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Back to drop
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-12 lg:py-12">
        {/* Stripe-style light panel */}
        <section
          className="order-2 rounded-2xl bg-[#f6f9fc] p-6 text-[#0a2540] shadow-[0_30px_60px_-35px_rgba(0,0,0,0.65)] sm:p-8 lg:order-1"
          aria-labelledby="checkout-pay-heading"
        >
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#e6ebf1] pb-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#425466]">
                Pay Gaviom
              </p>
              <h1 id="checkout-pay-heading" className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                {formatUsd(total)}
              </h1>
              <p className="mt-1 text-[13px] text-[#425466]">
                Draw closes {closesLabel} · Demo checkout, no real charge
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[#e6ebf1] bg-white px-3 py-1 text-[11px] font-medium text-[#425466]">
              <Lock className="h-3.5 w-3.5 text-[#635bff]" aria-hidden />
              SSL
            </div>
          </div>

          <p className="mt-6 text-[13px] font-semibold text-[#0a2540]">Payment method</p>
          <div className="mt-3 space-y-2" role="radiogroup" aria-label="Payment method">
            {PAYMENT_METHODS.map(({ id, label, description, Icon }) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={method === id}
                onClick={() => setMethod(id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                  method === id
                    ? "border-[#635bff] bg-white shadow-[0_0_0_1px_#635bff]"
                    : "border-[#e6ebf1] bg-white hover:border-[#c9d4e0]"
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
                    method === id ? "border-[#635bff]/30 bg-[#635bff]/08" : "border-[#e6ebf1] bg-[#f6f9fc]"
                  )}
                >
                  <Icon className="h-5 w-5 text-[#425466]" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium text-[#0a2540]">{label}</span>
                  <span className="block text-[12px] text-[#425466]">{description}</span>
                </span>
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    method === id ? "border-[#635bff] bg-[#635bff]" : "border-[#c9d4e0] bg-white"
                  )}
                  aria-hidden
                >
                  {method === id ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                </span>
              </button>
            ))}
          </div>

          {method === "card" ? (
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-[12px] font-medium text-[#425466]">Card number</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#e6ebf1] bg-white px-3 py-2.5 text-[15px] text-[#0a2540] outline-none ring-[#635bff] placeholder:text-[#8898aa] focus:ring-2"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[12px] font-medium text-[#425466]">Expiry</span>
                  <input
                    type="text"
                    autoComplete="cc-exp"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[#e6ebf1] bg-white px-3 py-2.5 text-[15px] text-[#0a2540] outline-none ring-[#635bff] placeholder:text-[#8898aa] focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] font-medium text-[#425466]">CVC</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[#e6ebf1] bg-white px-3 py-2.5 text-[15px] text-[#0a2540] outline-none ring-[#635bff] placeholder:text-[#8898aa] focus:ring-2"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-[12px] font-medium text-[#425466]">Name on card</span>
                <input
                  type="text"
                  autoComplete="cc-name"
                  placeholder="Jordan Blake"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#e6ebf1] bg-white px-3 py-2.5 text-[15px] text-[#0a2540] outline-none ring-[#635bff] placeholder:text-[#8898aa] focus:ring-2"
                />
              </label>
            </div>
          ) : (
            <p className="mt-6 rounded-xl border border-[#e6ebf1] bg-white px-4 py-3 text-[13px] leading-relaxed text-[#425466]">
              Next step would open {labelForMethod(method)} to authorize this amount. This prototype completes your entry
              immediately when you tap Pay.
            </p>
          )}

          <button
            type="button"
            disabled={submitting}
            onClick={() => void onPay()}
            className={cn(
              "mt-8 flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-[15px] font-semibold text-white transition-opacity",
              "bg-[#635bff] hover:opacity-[0.96] active:opacity-90",
              submitting && "cursor-wait opacity-80"
            )}
          >
            {submitting ? "Processing…" : `Pay ${formatUsd(total)}`}
          </button>
          <p className="mt-4 text-center text-[11px] leading-relaxed text-[#425466]">
            Powered by a Stripe-style flow · Card data never leaves your browser in this demo
          </p>
          <p className="mt-3 text-center text-[11px] text-[#425466]">
            <Link href="/comment-ca-marche" className="font-medium text-[#635bff] underline-offset-2 hover:underline">
              How Gaviom works
            </Link>
          </p>
        </section>

        {/* Order summary */}
        <aside className="order-1 space-y-6 lg:order-2">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-md">
            <p className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/90">
              Order summary
            </p>
            <h2 className="mt-3 font-display text-lg font-medium leading-snug text-[var(--white)]">
              {contestTitle}
            </h2>
            <p className="mt-2 font-display text-[12px] font-light text-[var(--muted)]">
              Entries for the supervised draw. Taxes included where applicable (demo).
            </p>

            <p className="mt-6 font-display text-[12px] font-medium text-[var(--muted)]">
              How many tickets do you want?
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {QUANTITIES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQty(n)}
                  className={cn(
                    "min-h-10 min-w-10 rounded-xl border font-mono text-sm transition-colors",
                    qty === n
                      ? "border-gold/55 bg-gold/12 text-gold-light shadow-[0_0_0_1px_rgba(200,169,81,0.15)]"
                      : "border-white/[0.1] text-[var(--muted)] hover:border-gold/25 hover:text-[var(--white)]"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>

            <dl className="mt-6 space-y-3 border-t border-white/[0.08] pt-6 font-mono text-[13px]">
              <div className="flex justify-between gap-4 text-[var(--muted)]">
                <dt>
                  {qty} × {formatUsd(ticketPrice)}
                </dt>
                <dd className="text-[var(--white)]/90">{formatUsd(total)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-white/[0.06] pt-3 text-[var(--white)]">
                <dt className="font-display text-[11px] font-medium uppercase tracking-wide text-gold/85">Total due</dt>
                <dd className="text-lg font-medium text-gold">{formatUsd(total)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
