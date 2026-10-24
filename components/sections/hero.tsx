"use client";

import { m } from "motion/react";
import { useTranslations } from "next-intl";
import { fadeUpHero, heroItem, heroLcp, riseUpHero, staggerHero } from "@/lib/motion";
import { ScrollHint } from "@/components/ui/scroll-hint";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section id="home" className="relative flex min-h-svh items-center justify-center px-4 pb-16 pt-24">
      <m.div
        className="mx-auto max-w-4xl text-center"
        variants={staggerHero}
        initial="hidden"
        animate="visible"
      >
        <m.h1
          variants={riseUpHero}
          transition={heroLcp}
          className="gradient-text mb-4 pb-1 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          {t("name")}
        </m.h1>

        <m.p
          variants={fadeUpHero}
          transition={heroItem}
          className="mb-10 text-xl font-light text-cream/70 sm:text-2xl"
        >
          {t("role")}
        </m.p>

        <m.a
          variants={fadeUpHero}
          transition={heroItem}
          href="#contact"
          className="focus-ring group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 shadow-glow-cream transition-transform duration-300 hover:scale-105 active:scale-[0.97]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-cream to-cream-deep" />
          <span className="absolute inset-0 bg-gradient-to-r from-cream to-cream-deep opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
          <span className="relative text-base font-semibold text-navy-950">{t("cta")}</span>
        </m.a>

        <m.div variants={fadeUpHero} transition={heroItem}>
          <ScrollHint label={t("scroll")} />
        </m.div>
      </m.div>
    </section>
  );
}