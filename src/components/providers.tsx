"use client";

import { Toaster } from "sonner";
import { ScrollProgress } from "@/components/scroll-progress";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      {children}
      <Toaster
        position="top-center"
        theme="dark"
        closeButton
        offset="4.5rem"
        toastOptions={{
          duration: 2200,
          classNames: {
            toast:
              "!border-white/[0.08] !bg-black/65 !text-white/70 !shadow-none backdrop-blur-md border font-sans text-[13px]",
            closeButton:
              "!border-white/10 !bg-transparent !text-white/35 hover:!text-white/55",
          },
        }}
      />
    </>
  );
}
