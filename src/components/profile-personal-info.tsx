"use client";

import { useCallback, useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import type { UserPersonalInfo } from "@/stores/user-profile-store";
import { useUserProfileStore } from "@/stores/user-profile-store";
import { cn } from "@/lib/utils";

/** Fields shown when the section is expanded (Country / State as requested). */
const EXPAND_FIELDS: { key: keyof UserPersonalInfo; label: string; optionalHint?: string }[] = [
  { key: "prenom", label: "First name" },
  { key: "nom", label: "Last name" },
  { key: "email", label: "Email" },
  { key: "telephone", label: "Phone", optionalHint: "Optional" },
  { key: "pays", label: "Country" },
  { key: "region", label: "State / province" },
];

function summaryPart(v: string) {
  const t = v.trim();
  return t.length > 0 ? t : "-";
}

export function ProfilePersonalInfo() {
  const personal = useUserProfileStore((s) => s.personal);
  const setPersonal = useUserProfileStore((s) => s.setPersonal);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<UserPersonalInfo>(personal);
  const [savedPulse, setSavedPulse] = useState(false);

  useEffect(() => {
    setDraft(personal);
  }, [personal]);

  const onChange = useCallback((key: keyof UserPersonalInfo, value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
  }, []);

  const onSave = useCallback(() => {
    setPersonal(draft);
    setSavedPulse(true);
    window.setTimeout(() => setSavedPulse(false), 1600);
  }, [draft, setPersonal]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(personal);

  const summaryLine = `${summaryPart(personal.prenom)} · ${summaryPart(personal.nom)} · ${summaryPart(personal.email)}`;

  return (
    <section
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-5 sm:px-5"
      aria-labelledby="personal-info-heading"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold/5 text-gold">
          <UserCircle className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="personal-info-heading" className="font-display text-sm font-medium text-[var(--white)]">
            Personal information
          </h2>
          <p className="mt-2 font-display text-xs leading-relaxed text-[var(--muted)]">{summaryLine}</p>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="personal-info-panel"
            onClick={() => setOpen((o) => !o)}
            className="mt-3 font-display text-[11px] font-medium tracking-wide text-[var(--muted)] underline decoration-white/15 underline-offset-4 transition-colors hover:text-gold hover:decoration-gold/40"
          >
            {open ? "Collapse section" : "Expand section"}
          </button>
        </div>
      </div>

      {open && (
        <div id="personal-info-panel" className="mt-6 border-t border-[var(--border)] pt-6">
          <p className="font-display text-xs leading-relaxed text-[var(--muted)]">
            Stored on this device for the demo. When accounts go live, we will sync this to your secure Gaviom profile
            for faster checkout and winner verification.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {EXPAND_FIELDS.map(({ key, label, optionalHint }) => (
              <label key={key} className="block">
                <span className="font-display text-[10px] font-semibold uppercase tracking-[0.14em] text-gold/90">
                  {label}
                  {optionalHint ? (
                    <span className="ml-1.5 font-normal normal-case tracking-normal text-[var(--muted)]">
                      ({optionalHint})
                    </span>
                  ) : null}
                </span>
                <input
                  type={key === "email" ? "email" : key === "telephone" ? "tel" : "text"}
                  name={key}
                  autoComplete={
                    key === "prenom"
                      ? "given-name"
                      : key === "nom"
                        ? "family-name"
                        : key === "email"
                          ? "email"
                          : key === "telephone"
                            ? "tel"
                            : key === "pays"
                              ? "country-name"
                              : "address-level1"
                  }
                  value={draft[key]}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 font-display text-sm text-[var(--white)] outline-none transition-colors placeholder:text-[var(--muted)]/60 focus:border-gold/35 focus:ring-1 focus:ring-gold/20"
                  placeholder={
                    key === "telephone"
                      ? "Optional"
                      : key === "pays"
                        ? "United States"
                        : key === "region"
                          ? "State or province"
                          : `Your ${label.toLowerCase()}`
                  }
                />
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p
              className={cn(
                "min-h-[1rem] font-display text-xs transition-opacity",
                savedPulse ? "text-gold" : "text-[var(--muted)]"
              )}
              role="status"
            >
              {savedPulse ? "Saved." : dirty ? "Unsaved changes." : ""}
            </p>
            <button
              type="button"
              disabled={!dirty}
              onClick={onSave}
              className={cn(
                "rounded-xl px-6 py-3 font-display text-sm font-medium transition-colors",
                dirty
                  ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light text-void hover:opacity-95"
                  : "cursor-not-allowed border border-white/10 bg-white/[0.04] text-[var(--muted)]"
              )}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
