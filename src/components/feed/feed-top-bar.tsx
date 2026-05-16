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
      <header className="pointer-events-none fixed left-0 right-0 top-0 z-40 flex items-center justify-between pl-[max(1rem,calc(env(safe-area-inset-left,0px)+0.5rem))] pr-[max(1rem,calc(env(safe-area-inset-right,0px)+0.5rem))] pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
        <button
          type="button"
          className="pointer-events-auto flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-[var(--border)]/50 bg-[var(--surface)]/90 text-[var(--white)] shadow-sm backdrop-blur-md transition-[background-color,opacity,transform,border-color] duration-100 ease-out hover:border-gold/25 hover:bg-[var(--surface-raised)] active:scale-95"
          aria-label="Search experiences"
          aria-expanded={searchOpen}
          aria-haspopup="dialog"
          onClick={() => setSearchOpen(true)}
        >
          <Search className="h-5 w-5 text-gold/90" aria-hidden />
        </button>
        <Link
          href="/"
          className="pointer-events-auto touch-manipulation text-center drop-shadow-md transition-opacity duration-100 active:opacity-70"
        >
          <BrandMark
            variant="stacked"
            nameClassName="text-lg font-medium text-[var(--white)]"
            taglineClassName="text-[8px] tracking-[0.2em] text-[var(--muted)]"
          />
        </Link>
        <div className="pointer-events-auto flex items-center gap-2">
          <Link
            href="/comment-ca-marche"
            className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-[var(--border)]/50 bg-[var(--surface)]/90 text-[var(--white)] shadow-sm backdrop-blur-md transition-[background-color,opacity,transform,border-color] duration-100 ease-out hover:border-gold/25 hover:bg-[var(--surface-raised)] active:scale-95"
            aria-label="How it works"
          >
            <CircleHelp className="h-5 w-5 text-gold/90" aria-hidden />
          </Link>
          <Link
            href="/profil"
            className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-[var(--border)]/50 bg-[var(--surface)]/90 text-[var(--white)] shadow-sm backdrop-blur-md transition-[background-color,opacity,transform,border-color] duration-100 ease-out hover:border-gold/25 hover:bg-[var(--surface-raised)] active:scale-95"
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
