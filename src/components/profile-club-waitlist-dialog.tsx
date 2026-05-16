"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BRAND } from "@/lib/brand";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProfileClubWaitlistDialog({ open, onOpenChange }: Props) {
  const [email, setEmail] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setEmail("");
    }
    onOpenChange(next);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Enter your email to join the waitlist.");
      return;
    }
    toast.success("You’re on the list. We’ll email you when Gaviom Club opens.");
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-[var(--border)] bg-[var(--surface)] shadow-none">
        <DialogTitle className="font-display text-lg font-medium italic text-[var(--white)]">
          Join {BRAND.membership}
        </DialogTitle>
        <p className="font-display text-sm font-light leading-relaxed text-[var(--muted)]">
          Leave your email and we’ll notify you when memberships open.
        </p>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <label className="block">
            <span className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-gold/90">
              Email
            </span>
            <input
              type="email"
              name="waitlist-email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 font-display text-sm text-[var(--white)] outline-none transition-colors focus:border-gold/35 focus:ring-1 focus:ring-gold/20"
              placeholder="you@example.com"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light py-3 font-display text-sm font-medium text-void hover:opacity-95"
          >
            Submit
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
