"use client";

import { m } from "motion/react";
import { useTranslations } from "next-intl";
import { SECTION_IDS, type SectionId } from "@/lib/sections";
import { navIndicator } from "@/lib/motion";

export function NavPill({ activeSection }: { activeSection: SectionId }) {
  const t = useTranslations("Navigation");

  return (
    <nav
      aria-label={t("navLabel")}
      className="glass-pill hidden items-center gap-0.5 rounded-full px-2 py-2 shadow-glow md:flex justify-self-center"
    >
      {SECTION_IDS.map((id) => {
        const isActive = id === activeSection;

        return (
          <a
            key={id}
            href={`#${id}`}
            aria-current={isActive ? "location" : undefined}
            className={`focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
              isActive ? "text-cream" : "text-cream/50 hover:text-cream"
            }`}
          >
            {isActive && (
              <m.span
                layoutId="nav-active"
                className="absolute inset-0 rounded-full border border-cream/20 bg-gradient-to-br from-cream/15 to-cream/5"
                transition={navIndicator}
              />
            )}
            <span className="relative">{t(id)}</span>
          </a>
        );
      })}
    </nav>
  );
}