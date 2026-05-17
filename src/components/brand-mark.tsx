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
  subTaglineClassName?: string;
  /** Second line under the main tagline (stacked variant only). */
  showSubTagline?: boolean;
  /** Primary tagline under the name (stacked variant only). */
  showTagline?: boolean;
};

export function BrandMark({
  variant = "stacked",
  href,
  className,
  nameClassName,
  taglineClassName,
  subTaglineClassName,
  showSubTagline = false,
  showTagline = true,
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
      <span className={cn("flex flex-col items-center gap-0.5", className)}>
        <span className={cn("font-display font-semibold tracking-tight", nameClassName)}>
          {BRAND.name}
        </span>
        {showTagline ? (
          <span
            className={cn(
              "text-[10px] font-medium uppercase tracking-[0.18em] text-white/45",
              taglineClassName
            )}
          >
            {BRAND.tagline}
          </span>
        ) : null}
        {showSubTagline ? (
          <span
            className={cn(
              "text-[9px] font-normal normal-case tracking-[0.04em] text-white/50",
              subTaglineClassName
            )}
          >
            {BRAND.taglineSecondary}
          </span>
        ) : null}
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
