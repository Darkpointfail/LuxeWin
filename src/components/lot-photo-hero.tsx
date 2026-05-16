"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  /** Ken Burns when true (feed active slide, detail hero). */
  animate?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
};

/** Full-bleed photo hero: relative container + slight overscale so Ken Burns never reveals black. */
export function LotPhotoHero({
  src,
  animate = false,
  priority = false,
  sizes = "100vw",
  className,
  imageClassName,
}: Props) {
  const [useNativeImg, setUseNativeImg] = useState(false);

  const imgClass = cn(
    "absolute inset-0 h-full w-full object-cover object-center scale-[1.12]",
    imageClassName
  );

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div
        className={cn(
          "relative h-full w-full",
          animate && "animate-ken-burns-slow will-change-transform"
        )}
      >
        {useNativeImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className={imgClass} decoding="async" />
        ) : (
          <Image
            src={src}
            alt=""
            fill
            priority={priority}
            sizes={sizes}
            unoptimized
            className={imgClass}
            onError={() => setUseNativeImg(true)}
          />
        )}
      </div>
    </div>
  );
}
