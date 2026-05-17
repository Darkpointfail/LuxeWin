"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

const GOLD = "#C9A84C";
const BG = "#0F0E0C";
const DARK = "#1A1815";
const WHITE = "#FAFAF8";

const CORPO_EMAIL = BRAND.corpoEmail;

/** Fonds & sections, collègues au travail, voyage, expérience premium (Unsplash). */
/** IDs vérifiés (HEAD 200), anciennes URLs Unsplash parfois retirées ou invalides. */
const PHOTO = {
  hero: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=2400&q=80",
  bandTravel: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  bandExperience: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80",
  ctaMood: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=2000&q=80",
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const PACKS = [
  {
    id: "starter",
    name: "Starter",
    employees: "10–50",
    price: "30 $/emp/an",
    note: "Tier 1",
  },
  {
    id: "growth",
    name: "Growth",
    employees: "51–250",
    price: "25 $/emp/an",
    note: "Tiers 1 & 2",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    employees: "250+",
    price: "Custom",
    note: "All tiers",
  },
] as const;

const STEPS = [
  {
    n: "1",
    title: "Pick your tier",
    text: "Choose the package that matches your headcount and prize ambition.",
  },
  {
    n: "2",
    title: "Entries by email",
    text: "Each teammate receives their entries and plays securely on the web.",
  },
  {
    n: "3",
    title: "Verified draw",
    text: "A winner is selected, Gaviom runs the full compliance stack end to end.",
  },
] as const;

const CATEGORIES = [
  {
    id: "cat1",
    level: "Tier 1",
    range: "$500 – $2,000",
    packsLabel: "Starter · Growth · Enterprise",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=82",
    imageAlt: "Team collaborating at the office",
    examples: ["AirPods Max", "Spa weekend", "Premium champagne", "Smartwatch"],
  },
  {
    id: "cat2",
    level: "Tier 2",
    range: "$2,000 – $10,000",
    packsLabel: "Growth · Enterprise",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=82",
    imageAlt: "Ocean-view resort stay",
    examples: ["Luxury watch", "Five-star escape", "Performance e-bike"],
  },
  {
    id: "cat3",
    level: "Tier 3",
    range: "$10,000+",
    packsLabel: "Enterprise only",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80",
    imageAlt: "Performance automobile",
    examples: ["Dream car", "Business-class voyage", "Collectible art", "Yacht experience"],
  },
] as const;

function serifClass() {
  return "font-[family-name:var(--font-corpo-serif),Georgia,serif]";
}

function cardSurfaceClass() {
  return cn(
    "rounded-lg border border-white/[0.08] bg-surface transition-all duration-300",
    "hover:-translate-y-1 hover:border-[#C9A84C]/55"
  );
}

function pillClass() {
  return cn(
    "rounded-lg border border-white/[0.1] bg-void/90 px-2.5 py-1 text-[12px] font-medium leading-none text-white/80",
    "tracking-tight"
  );
}

function DemoForm() {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [headcount, setHeadcount] = useState("10-50");

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const body = [
        `Company: ${company}`,
        `Email: ${email}`,
        `Headcount: ${headcount === "10-50" ? "10–50" : headcount === "51-250" ? "51–250" : "250+"}`,
        "",
        "Gaviom Corpo, demo request",
      ].join("\n");
      window.location.href = `mailto:${CORPO_EMAIL}?subject=${encodeURIComponent(
        "Gaviom Corpo, demo request"
      )}&body=${encodeURIComponent(body)}`;
    },
    [company, email, headcount]
  );

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-md space-y-5 rounded-lg border border-white/[0.1] bg-surface/95 p-6 backdrop-blur-sm sm:p-8"
    >
      <div>
        <label htmlFor="corp-name" className="mb-2 block text-[13px] font-medium text-white/75">
          Company name
        </label>
        <input
          id="corp-name"
          name="company"
          required
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full rounded-lg border border-white/[0.12] bg-void px-3 py-2.5 text-[15px] outline-none ring-0 transition-[border-color] focus:border-[#C9A84C]/70"
        />
      </div>
      <div>
        <label htmlFor="corp-email" className="mb-2 block text-[13px] font-medium text-white/75">
          Work email
        </label>
        <input
          id="corp-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-white/[0.12] bg-void px-3 py-2.5 text-[15px] outline-none focus:border-[#C9A84C]/70"
        />
      </div>
      <div>
        <label htmlFor="corp-headcount" className="mb-2 block text-[13px] font-medium text-white/75">
          Team size
        </label>
        <select
          id="corp-headcount"
          name="headcount"
          value={headcount}
          onChange={(e) => setHeadcount(e.target.value)}
          className="w-full rounded-lg border border-white/[0.12] bg-void px-3 py-2.5 text-[15px] outline-none focus:border-[#C9A84C]/70"
        >
          <option value="10-50">10–50</option>
          <option value="51-250">51–250</option>
          <option value="250+">250+</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-[#C9A84C] py-3 text-[15px] font-medium text-[#111] transition-opacity hover:opacity-90"
      >
        Request a walkthrough
      </button>
    </form>
  );
}

export function CorpoCorporatePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BG, color: WHITE }}>
      {/* Hero plein écran : photo équipe + overlay */}
      <div className="relative min-h-[min(92dvh,880px)]">
        <Image
          src={PHOTO.hero}
          alt=""
          fill
          priority
          className="object-cover object-[50%_28%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-void/78" />
        <div className="absolute inset-0 bg-gradient-to-b from-void/55 via-void/20 to-void" />

        <header className="relative z-20 border-b border-white/[0.08] bg-void/25 px-5 py-4 backdrop-blur-md sm:px-8">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <div className="flex flex-col">
              <span className={cn(serifClass(), "text-lg font-medium tracking-wide")} style={{ color: GOLD }}>
                {BRAND.name}
              </span>
              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/45">
                {BRAND.tagline}
              </span>
            </div>
            <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/55">Corpo</span>
            <Link
              href="/"
              className="text-[13px] text-white/70 underline-offset-4 hover:text-[#C9A84C] hover:underline"
            >
              Main site
            </Link>
          </div>
        </header>

        <section className="relative z-10 flex min-h-[calc(min(92dvh,880px)-4.25rem)] flex-col justify-center px-5 pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-12">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className={cn(
                serifClass(),
                "text-[clamp(2rem,5.5vw,3.25rem)] font-light leading-[1.12] tracking-[-0.02em] drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
              )}
            >
              Luxury employee drops, built for teams.
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ delay: 0.08 }}
              className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-white/70 sm:text-[16px]"
            >
              From ~$25 / employee / year · Cars, escapes, watches
            </motion.p>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ delay: 0.16 }}
              className="mt-12"
            >
              <a
                href="#offres"
                className="inline-flex items-center justify-center rounded-lg border border-[#C9A84C]/45 bg-void/50 px-8 py-3 text-[14px] font-medium text-[#C9A84C] backdrop-blur-sm transition-colors hover:border-[#C9A84C]/75 hover:bg-void/70"
              >
                View packages ↓
              </a>
            </motion.div>
          </div>
        </section>
      </div>

      <main>
        {/* 2, Comment ça marche */}
        <section id="comment-ca-marche" className="border-t border-white/[0.06] px-5 py-16 sm:px-8 sm:py-20" style={{ backgroundColor: DARK }}>
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              className="mb-12 text-center sm:mb-16"
            >
              <h2 className={cn(serifClass(), "text-2xl font-light sm:text-3xl")}>How it works</h2>
              <p className="mt-3 text-[14px] text-white/45">Three steps. Entirely on the web.</p>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
              {STEPS.map((step, i) => (
                <motion.article
                  key={step.n}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.06 }}
                  className={cn("p-6 sm:p-7", cardSurfaceClass())}
                >
                  <span className="text-[11px] font-medium uppercase tracking-[0.22em]" style={{ color: GOLD }}>
                    Step {step.n}
                  </span>
                  <h3 className={cn(serifClass(), "mt-4 text-xl font-medium")}>{step.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/50">{step.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Photos voyage + expérience (bandeau) */}
        <section className="border-t border-white/[0.06] px-5 py-12 sm:px-8 sm:py-16" style={{ backgroundColor: BG }}>
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mb-8 text-center"
            >
              <p className={cn(serifClass(), "text-lg font-light text-white/85 sm:text-xl")}>
                Work, travel, peak moments
              </p>
              <p className="mt-2 text-[13px] text-white/40">Same energy as your prizes: tangible, desirable, shareable.</p>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              <motion.figure
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeUp}
                className="overflow-hidden rounded-lg border border-white/[0.1]"
              >
                <div className="relative aspect-[16/11]">
                  <Image
                    src={PHOTO.bandTravel}
                    alt="Travel landscape, sky and terrain"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width:640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#C9A84C]/90">Travel</span>
                    <p className="mt-1 text-[13px] text-white/70">Horizons, mileage, that “elsewhere” feeling.</p>
                  </figcaption>
                </div>
              </motion.figure>
              <motion.figure
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={fadeUp}
                transition={{ delay: 0.06 }}
                className="overflow-hidden rounded-lg border border-white/[0.1]"
              >
                <div className="relative aspect-[16/11]">
                  <Image
                    src={PHOTO.bandExperience}
                    alt="Resort pool, experiential moment"
                    fill
                    className="object-cover object-[50%_60%]"
                    sizes="(max-width:640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#C9A84C]/90">Experiences</span>
                    <p className="mt-1 text-[13px] text-white/70">Stays and moments people replay in conversation.</p>
                  </figcaption>
                </div>
              </motion.figure>
            </div>
          </div>
        </section>

        {/* 3, Packs */}
        <section id="offres" className="scroll-mt-20 border-t border-white/[0.06] px-5 py-16 sm:px-8 sm:py-20" style={{ backgroundColor: DARK }}>
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mb-12 text-center sm:mb-14"
            >
              <h2 className={cn(serifClass(), "text-2xl font-light sm:text-3xl")}>Packages</h2>
              <p className="mt-3 text-[14px] text-white/45">Scaled to your company size</p>
            </motion.div>
            <div className="grid gap-6 lg:grid-cols-3">
              {PACKS.map((pack, i) => (
                <motion.article
                  key={pack.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.05 }}
                  className={cn("flex flex-col p-6 sm:p-8", cardSurfaceClass())}
                >
                  <h3 className={cn(serifClass(), "text-2xl font-medium")}>{pack.name}</h3>
                  <p className="mt-2 text-[13px] uppercase tracking-wider text-white/40">{pack.employees} employees</p>
                  <p className="mt-6 text-2xl font-medium" style={{ color: GOLD }}>
                    {pack.price}
                  </p>
                  <p className="mt-4 text-[13px] text-white/45">{pack.note}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* 4, Catégories : cartes photo + lots en pastilles */}
        <section className="border-t border-white/[0.06] px-5 py-16 sm:px-8 sm:py-24" style={{ backgroundColor: BG }}>
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
            >
              <h2 className={cn(serifClass(), "text-2xl font-light sm:text-3xl")}>Prize tiers</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-white/45">
                Three value bands unlocked by package. Each card shows eligibility, range, and sample drops.
              </p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-5">
              {CATEGORIES.map((cat, ci) => (
                <motion.article
                  key={cat.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.12 }}
                  variants={fadeUp}
                  transition={{ delay: ci * 0.05 }}
                  className={cn(
                    "flex h-full flex-col overflow-hidden rounded-lg border border-white/[0.1] bg-surface transition-all duration-300",
                    "hover:-translate-y-1 hover:border-[#C9A84C]/45 hover:shadow-[0_28px_60px_-28px_rgba(0,0,0,0.85)]"
                  )}
                >
                  <div className="relative h-40 shrink-0 sm:h-44">
                    <Image
                      src={cat.image}
                      alt={cat.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width:1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-lg border border-white/15 bg-void/75 px-2.5 py-1 backdrop-blur-sm">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: GOLD }}>
                        {cat.range}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex flex-wrap items-end justify-between gap-2 border-b border-white/[0.07] pb-4">
                      <h3 className={cn(serifClass(), "text-xl font-medium tracking-tight text-white/95")}>{cat.level}</h3>
                    </div>
                    <p className="mt-3 text-[12px] leading-snug text-white/42">
                      <span className="text-white/55">Packages: </span>
                      {cat.packsLabel}
                    </p>
                    <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">Examples</p>
                    <ul className="mt-2.5 flex flex-wrap gap-2">
                      {cat.examples.map((ex) => (
                        <li key={ex} className={pillClass()}>
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* 5, CTA + formulaire (fond photo discret) */}
        <section id="contact" className="relative scroll-mt-20 border-t border-white/[0.06] px-5 py-16 sm:px-8 sm:py-24">
          <div className="absolute inset-0">
            <Image
              src={PHOTO.ctaMood}
              alt=""
              fill
              className="object-cover object-[50%_35%]"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-void/92" />
            <div className="absolute inset-0 bg-gradient-to-b from-void/40 to-void" />
          </div>
          <div className="relative z-10 mx-auto max-w-lg text-center">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className={cn(serifClass(), "text-2xl font-light sm:text-3xl")}
            >
              Let’s architect your program.
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="mt-4 text-[14px] text-white/45"
            >
              Reply within two business days.
            </motion.p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mt-10 text-left"
            >
              <DemoForm />
            </motion.div>
          </div>
        </section>

        <footer className="border-t border-white/[0.06] px-5 py-8 text-center text-[12px] text-white/35" style={{ backgroundColor: BG }}>
          <p>Gaviom Corpo, {CORPO_EMAIL}</p>
        </footer>
      </main>
    </div>
  );
}
