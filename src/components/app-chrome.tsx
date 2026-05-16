"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { cn } from "@/lib/utils";

const NAV_PATHS = new Set([
  "/",
  "/categories",
  "/comment-ca-marche",
  "/gagnants",
  "/mes-tickets",
  "/profil",
]);

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname || "/";
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = normalizePathname(usePathname() ?? "/");
  const showNav = NAV_PATHS.has(pathname);

  return (
    <>
      <main
        className={cn(
          showNav && "min-h-[100dvh] pb-app-nav"
        )}
      >
        {children}
      </main>
      {showNav && <BottomNav />}
    </>
  );
}
