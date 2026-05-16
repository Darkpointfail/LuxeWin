import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = { title: string; backHref?: string };

export function PageHeaderMinimal({ title, backHref = "/" }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-void/90 pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pb-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <Link
          href={backHref}
          className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-gold/40 hover:text-gold"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-sm font-medium text-[var(--white)]">
          {title}
        </h1>
      </div>
    </header>
  );
}
