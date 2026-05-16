/** US premium display, single source for money, dates, counts. */

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** e.g. $1,500 USD for prize copy blocks. */
export function formatTravelCreditUsd(amount: number): string {
  return `${formatUsd(amount)} USD`;
}

export function formatNumberEn(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatDrawDateUS(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function formatShortDateUS(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}
