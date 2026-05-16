"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-void px-6 text-center">
      <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-gold">Gaviom</p>
      <h1 className="mt-4 font-serif text-2xl font-normal italic text-[var(--white)]">Give us a beat, that stalled.</h1>
      <p className="mt-3 max-w-md font-display text-sm text-[var(--muted)]">
        {error.message || "Unexpected hiccup. Retry or refresh; your cart and entries stay intact."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-8 touch-manipulation rounded-2xl border border-gold/40 bg-gold/15 px-6 py-3 font-display text-sm font-medium text-gold transition-colors duration-100 hover:bg-gold/25"
      >
        Try again
      </button>
    </div>
  );
}
