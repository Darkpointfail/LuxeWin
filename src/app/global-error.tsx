"use client";

/**
 * Temporarily replaces the root layout on critical errors.
 * Must define <html> and <body> (Next.js App Router convention).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-void font-sans text-[#f5f3ee] antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <p
            style={{ color: "#c8a951" }}
            className="text-xs font-medium uppercase tracking-[0.2em]"
          >
            Gaviom
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/40">
            Premium prize draws
          </p>
          <h1 className="mt-4 text-2xl font-normal italic text-white">Something went wrong</h1>
          <p className="mt-3 max-w-md text-sm opacity-70">
            {error.digest
              ? `Ref. ${error.digest}`
              : "We couldn’t render the app. Your session is safe, try a refresh."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-8 rounded-2xl px-6 py-3 text-sm font-medium"
            style={{
              background: "linear-gradient(90deg, #8B6914, #C8A951, #F0D080)",
              color: "#0F0E0C",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
