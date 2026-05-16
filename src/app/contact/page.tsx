import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 text-luxe-offwhite">
      <h1 className="font-serif text-3xl italic text-[#faf8f3]">Member support</h1>
      <p className="mt-6 text-sm leading-relaxed text-white/55">
        For billing, winner verification, or press, use the channels listed in your confirmation email and in each
        drop’s official rules.
      </p>
      <Link href="/" className="mt-10 inline-block text-sm text-gold/90 underline-offset-4 hover:underline">
        ← Home
      </Link>
    </div>
  );
}
