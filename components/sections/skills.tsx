"use client";

import { m } from "motion/react";
import { useTranslations } from "next-intl";
import { SKILL_GROUPS } from "@/lib/skills";
import { SkillIcon } from "@/lib/tech-icon";
import {
  fadeUpCard,
  fadeUpHeading,
  revealCard,
  revealSlow,
  staggerCards,
  viewCard,
  viewSection,
} from "@/lib/motion";

export function Skills() {
  const t = useTranslations("Skills");

  return (
    <section id="skills" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
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
          {SKILL_GROUPS.map((group) => (
            <m.div
              key={group.id}
              variants={fadeUpCard}
              transition={revealCard}
              className="w-full md:w-[calc((100%_-_1.5rem)/2)] lg:w-[calc((100%_-_3rem)/3)]"
            >
              <div className="@container glass h-full rounded-3xl p-6 shadow-glow">
                <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-cream">
                  {t(`groups.${group.id}`)}
                </h3>
                <div className="grid grid-cols-4 gap-3 @[340px]:grid-cols-5">
                  {group.items.map((tech) => (
                    <SkillIcon key={tech} tech={tech} />
                  ))}
                </div>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}