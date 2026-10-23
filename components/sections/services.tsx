"use client";

import { m } from "motion/react";
import { useTranslations } from "next-intl";
import { SERVICES } from "@/lib/services";
import {
  fadeUpCard,
  fadeUpHeading,
  revealCard,
  revealSlow,
  staggerCards,
  viewCard,
  viewSection,
} from "@/lib/motion";
import { ServiceCard } from "@/components/ui/service-card";

export function Services() {
  const t = useTranslations("Services");

  return (
    <section id="services" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <m.div
          className="mb-16 text-center"
          variants={fadeUpHeading}
          initial="hidden"
          whileInView="visible"
          viewport={viewSection}
          transition={revealSlow}
        >
          <h2 className="gradient-text mb-3 text-4xl font-bold sm:text-5xl">{t("title")}</h2>
          <p className="text-lg text-cream/70">{t("subtitle")}</p>
        </m.div>

        <m.div
          className="flex flex-wrap justify-center gap-6"
          variants={staggerCards}
          initial="hidden"
          whileInView="visible"
          viewport={viewCard}
        >
          {SERVICES.map(({ id, Icon }) => (
            <m.div
              key={id}
              variants={fadeUpCard}
              transition={revealCard}
              className="w-full md:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]"
            >
              <ServiceCard
                icon={Icon}
                title={t(`cards.${id}.title`)}
                description={t(`cards.${id}.desc`)}
                facts={t.raw(`cards.${id}.facts`) as string[]}
              />
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}