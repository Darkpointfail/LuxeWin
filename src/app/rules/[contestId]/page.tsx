import Link from "next/link";

export default function OfficialRulesPage({ params }: { params: { contestId: string } }) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 text-luxe-offwhite">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold/80">Gaviom</p>
      <h1 className="mt-4 font-serif text-3xl italic text-[#faf8f3]">Official Rules</h1>
      <p className="mt-4 text-sm text-white/50">
        Experience drop: <span className="text-white/80">{decodeURIComponent(params.contestId)}</span>
      </p>
      <p className="mt-8 text-sm leading-relaxed text-white/55">
        Full legal rules live here, your counsel drops the final PDF. This URL is the official reference linked from
        entry confirmations so members always have a single source of truth.
      </p>
      <Link href="/" className="mt-10 inline-block text-sm text-gold/90 underline-offset-4 hover:underline">
        ← Back home
      </Link>
    </div>
  );
}
