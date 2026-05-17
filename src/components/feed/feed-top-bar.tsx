"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleHelp, Search, User } from "lucide-react";
import { LuxewinSearchOverlay } from "@/components/feed/luxewin-search-overlay";
import { BrandMark } from "@/components/brand-mark";

export function FeedTopBar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-40 grid min-h-[4.75rem] grid-cols-[1fr_auto_1fr] items-center gap-2 pl-[max(1rem,calc(env(safe-area-inset-left,0px)+0.5rem))] pr-[max(1rem,calc(env(safe-area-inset-right,0px)+0.5rem))] pt-[max(1rem,env(safe-area-inset-top,0px))] pb-2.5">
        <div className="pointer-events-auto flex justify-start self-center">
          <button
            type="button"
            className="flex h-12 w-12 touch-manipulation items-center justify-center rounded-full border border-[var(--border)]/50 bg-[var(--surface)]/90 text-[var(--white)] shadow-sm backdrop-blur-md transition-[background-color,opacity,transform,border-color] duration-100 ease-out hover:border-gold/25 hover:bg-[var(--surface-raised)] active:scale-95"
            aria-label="Search experiences"
            aria-expanded={searchOpen}
            aria-haspopup="dialog"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5 text-gold/90" aria-hidden />
          </button>
        </div>

        <Link
          href="/"
          className="pointer-events-auto touch-manipulation justify-self-center px-1 text-center drop-shadow-md transition-opacity duration-100 active:opacity-70"
        >
          <BrandMark
            variant="stacked"
            showTagline={false}
            showSubTagline
            nameClassName="text-[1.35rem] font-semibold leading-none text-[var(--white)] sm:text-[1.45rem]"
            subTaglineClassName="text-[9px] font-medium tracking-[0.14em] text-gold/90 sm:text-[10px]"
          />
        </Link>

        <div className="pointer-events-auto flex items-center justify-end gap-2 self-center">
          <Link
            href="/comment-ca-marche"
            className="flex h-12 touch-manipulation items-center gap-1.5 rounded-full border border-[var(--border)]/50 bg-[var(--surface)]/90 px-3 text-[var(--white)] shadow-sm backdrop-blur-md transition-[background-color,opacity,transform,border-color] duration-100 ease-out hover:border-gold/25 hover:bg-[var(--surface-raised)] active:scale-95 min-[400px]:px-3.5"
          >
            <CircleHelp className="h-4 w-4 shrink-0 text-gold/90" aria-hidden />
            <span className="hidden font-display text-[10px] font-semibold uppercase tracking-[0.12em] min-[400px]:inline">
              How draws work
            </span>
          </Link>
          <Link
            href="/profil"
            className="flex h-12 w-12 touch-manipulation items-center justify-center rounded-full border border-[var(--border)]/50 bg-[var(--surface)]/90 text-[var(--white)] shadow-sm backdrop-blur-md transition-[background-color,opacity,transform,border-color] duration-100 ease-out hover:border-gold/25 hover:bg-[var(--surface-raised)] active:scale-95"
            aria-label="Profile"
          >
            <User className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </header>
      <LuxewinSearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
