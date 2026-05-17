"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, LayoutGrid, Trophy, Ticket, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Draws", icon: Clapperboard },
  { href: "/categories", label: "Explore", icon: LayoutGrid },
  { href: "/gagnants", label: "Winners", icon: Trophy },
  { href: "/mes-tickets", label: "Entries", icon: Ticket },
  { href: "/profil", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[55] border-t border-[var(--border)] bg-[var(--void)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-2xl min-h-[3.5rem] items-stretch justify-between gap-0.5 px-1 sm:justify-around sm:px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-[44px] min-w-0 flex-1 touch-manipulation select-none flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium leading-tight transition-colors duration-100 ease-out sm:text-[11px] active:opacity-70",
                active ? "text-gold" : "text-[var(--muted)] hover:text-[var(--white)]"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span className="max-w-[4.2rem] truncate text-center leading-tight sm:max-w-none">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
