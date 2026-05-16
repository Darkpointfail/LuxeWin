import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { BRAND } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-luxe-black py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:flex-row md:justify-between">
        <div>
          <BrandMark
            variant="stacked"
            nameClassName="text-2xl font-bold italic text-luxe-offwhite"
            taglineClassName="mt-1 text-luxe-offwhite/45"
          />
          <p className="mt-3 max-w-xs text-sm text-luxe-offwhite/50">
            The experiences everyone talks about, verified draws, limited entries, member support.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 text-sm text-luxe-offwhite/60">
          <Link href="/privacy" className="hover:text-gold">
            Privacy
          </Link>
          <Link href="/comment-ca-marche" className="hover:text-gold">
            How it works
          </Link>
          <Link href="/corpo" className="hover:text-gold">
            {BRAND.corpo}
          </Link>
          <Link href="/contact" className="hover:text-gold">
            Member support
          </Link>
        </div>
        <div className="flex gap-4 text-xs text-luxe-offwhite/40">
          <span>Instagram</span>
          <span>TikTok</span>
          <span>X</span>
        </div>
      </div>
    </footer>
  );
}
