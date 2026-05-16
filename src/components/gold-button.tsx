"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const goldButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-wide touch-manipulation transition-transform duration-100 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-luxe-black",
  {
    variants: {
      variant: {
        primary:
          "bg-gold text-luxe-black shimmer-hover shadow-gold-glow hover:bg-gold-light",
        secondary:
          "border border-gold/60 bg-transparent text-gold hover:bg-gold/10 shimmer-hover",
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
