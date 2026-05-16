import Link from "next/link";
import { GoldButton } from "@/components/gold-button";
import { BrandMark } from "@/components/brand-mark";

const links = [
  { href: "/#concours", label: "Drops" },
  { href: "/gagnants", label: "Winners" },
  { href: "/comment-ca-marche", label: "How it works" },
];

export function SiteHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-luxe-black/92 px-4 py-2.5 backdrop-blur-md md:px-6 md:py-3">
      <div className="mx-auto flex max-w-6xl flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <BrandMark
          href="/"
          variant="inline"
          nameClassName="text-lg text-white group-hover:text-gold md:text-xl"
          taglineClassName="hidden sm:inline text-white/50"
        />

        <nav className="flex flex-nowrap items-center gap-x-5 overflow-x-auto text-[13px] font-normal text-white/80 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-1 sm:justify-center sm:gap-x-7 sm:text-sm md:gap-x-8 [&::-webkit-scrollbar]:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 whitespace-nowrap transition-colors hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 sm:justify-end">
          <GoldButton
            asChild
            size="sm"
            className="w-full px-5 text-xs font-medium tracking-wide sm:w-auto sm:px-5 sm:text-[13px]"
          >
            <Link href="/#concours">Enter the moment</Link>
          </GoldButton>
        </div>
      </div>
    </header>
  );
}
