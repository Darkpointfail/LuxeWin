import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-void px-6 pb-24 pt-20 text-center">
      <p className="font-display text-xs font-medium uppercase tracking-[0.2em] text-gold">404</p>
      <h1 className="mt-4 font-serif text-3xl font-normal italic text-[var(--white)]">This page isn’t here.</h1>
      <p className="mt-3 max-w-md font-display text-sm text-[var(--muted)]">
        The drop you’re looking for may have moved, closed, or never shipped to this URL.
      </p>
      <Link
        href="/"
        className="mt-8 touch-manipulation rounded-2xl border border-gold/40 bg-gold/12 px-6 py-3 font-display text-sm font-medium text-gold transition-colors duration-100 hover:bg-gold/20"
      >
        Back to the feed
      </Link>
    </div>
  );
}
