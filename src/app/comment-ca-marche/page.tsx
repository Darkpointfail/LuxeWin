"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteFooter } from "@/components/site-footer";
import { PageHeaderMinimal } from "@/components/page-header-minimal";
import { pageVariants, containerVariants, cardVariants } from "@/lib/motion";
import { HOW_IT_WORKS_STEPS } from "@/lib/how-it-works-content";

export default function CommentCaMarchePage() {
  return (
    <motion.div
      className="min-h-screen bg-void pb-24 text-luxe-offwhite"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <PageHeaderMinimal title="How prize draws work" />
      <article className="mx-auto max-w-3xl px-6 pb-12 pt-8">
        <p className="text-xs uppercase tracking-[0.35em] text-gold/90">Official rules</p>
        <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-bold italic leading-tight">
          Premium contests. Verified winners.
        </h1>
        <p className="mt-6 text-lg font-light leading-relaxed text-luxe-offwhite/70">
          Gaviom runs legitimate prize draws for luxury experiences and products. Buy tickets, get numbered entries,
          and when the contest closes we draw one verified winner , on camera, every time.
        </p>

        <motion.ol
          className="relative mt-16 space-y-12 border-l border-white/10 pl-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={containerVariants}
        >
          {HOW_IT_WORKS_STEPS.map((s, i) => (
            <motion.li key={s.title} variants={cardVariants} className="relative">
              <span className="absolute -left-[39px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-gold/50 bg-luxe-black text-[10px] text-gold">
                {i + 1}
              </span>
              <h2 className="font-display text-2xl font-bold italic">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-luxe-offwhite/65">{s.body}</p>
            </motion.li>
          ))}
        </motion.ol>

        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold italic">FAQ</h2>
          <Accordion type="single" collapsible className="mt-6 w-full">
            <AccordionItem value="one">
              <AccordionTrigger>Can I verify the draws?</AccordionTrigger>
              <AccordionContent>
                Yes. Every close is timestamped and documented. Official partners and regulators can audit the trail on
                request.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="two">
              <AccordionTrigger>Can I enter from outside the US?</AccordionTrigger>
              <AccordionContent>
                Eligibility depends on residency and local law. Check the rules on each drop before you check out.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="three">
              <AccordionTrigger>What if a drop doesn’t sell out?</AccordionTrigger>
              <AccordionContent>
                The draw still runs on the published date, prizes award per the official rules attached to each
                experience.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold italic">Explainer video</h2>
          <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-luxe-charcoal">
            <video
              className="h-full w-full object-cover"
              controls
              playsInline
              poster="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&q=80"
            >
              <source
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <p className="mt-3 text-xs text-luxe-offwhite/45">
            Placeholder player, swap in your hero film when production wraps.
          </p>
        </section>
      </article>
      <SiteFooter />
    </motion.div>
  );
}
