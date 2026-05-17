"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const goldButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold uppercase tracking-[0.12em] touch-manipulation transition-[transform,box-shadow,background-color] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-void",
  {
    variants: {
      variant: {
        primary:
          "bg-gold text-void shimmer-hover shadow-gold-glow hover:bg-gold-light hover:shadow-gold-glow-lg",
        secondary:
          "border border-gold/50 bg-navy-card/80 text-gold shadow-gold-glow hover:bg-gold/10 shimmer-hover",
        ghost: "text-gold hover:bg-gold/10",
      },
      size: {
        default: "h-12 px-8",
        sm: "h-10 px-5 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface GoldButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof goldButtonVariants> {
  asChild?: boolean;
}

const GoldButton = React.forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(goldButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GoldButton.displayName = "GoldButton";

export { GoldButton, goldButtonVariants };
