import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

type Props = {
  /** Stacked: name over tagline. Inline: name · tagline on one row (wraps on narrow screens). */
  variant?: "stacked" | "inline" | "nameOnly";
  href?: string;
  className?: string;
  nameClassName?: string;
  taglineClassName?: string;
};

export function BrandMark({
  variant = "stacked",
  href,
  className,
  nameClassName,
  taglineClassName,
}: Props) {
  const inner =
    variant === "nameOnly" ? (
      <span className={cn("font-display font-semibold tracking-tight", nameClassName)}>
        {BRAND.name}
      </span>
    ) : variant === "inline" ? (
      <span className={cn("flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
        <span className={cn("font-display font-semibold tracking-tight", nameClassName)}>
          {BRAND.name}
        </span>
        <span
          className={cn(
            "text-[10px] font-medium uppercase tracking-[0.16em] text-white/45",
            taglineClassName
          )}
        >
          {BRAND.tagline}
        </span>
      </span>
    ) : (
      <span className={cn("flex flex-col gap-0.5", className)}>
        <span className={cn("font-display font-semibold tracking-tight", nameClassName)}>
          {BRAND.name}
        </span>
        <span
          className={cn(
            "text-[10px] font-medium uppercase tracking-[0.18em] text-white/45",
            taglineClassName
          )}
        >
          {BRAND.tagline}
        </span>
      </span>
    );

  if (href) {
    return (
      <Link href={href} className="group transition-colors hover:text-gold">
        {inner}
      </Link>
    );
  }

  return inner;
}
