import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 text-luxe-offwhite">
      <h1 className="font-serif text-3xl italic text-[#faf8f3]">Privacy Policy</h1>
      <p className="mt-6 text-sm leading-relaxed text-white/55">
        Gaviom privacy policy, legal copy placeholder for your compliance team.
      </p>
      <Link href="/" className="mt-10 inline-block text-sm text-gold/90 underline-offset-4 hover:underline">
        ← Home
      </Link>
    </div>
  );
}
