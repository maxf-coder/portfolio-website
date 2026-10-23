"use client";

import { m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useScrolled } from "@/hooks/use-scrolled";
import { navIndicator } from "@/lib/motion";

const LOCALES = ["ro", "en"] as const;

export function LanguageToggle() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const scrolled = useScrolled();

  const switchTo = (next: (typeof LOCALES)[number]) => {
    const path = pathname === "/" ? "" : pathname;
    const hash = window.location.hash;

    router.replace(`${path}${hash}` || "/", { locale: next, scroll: false });
  };

  const prefetch = (code: (typeof LOCALES)[number]) => {
    if (code === locale) return;
    router.prefetch(pathname || "/", { locale: code });
  };

  return (
    <nav
      aria-label={t("languageLabel")}
      className={`relative flex items-center rounded-full p-1 shadow-glow transition-colors duration-300 ${
        scrolled ? "glass-strong" : "glass-pill"
      }`}
    >
      {LOCALES.map((code) => {
        const isActive = code === locale;

        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            onMouseEnter={() => prefetch(code)}
            onFocus={() => prefetch(code)}
            aria-current={isActive ? "true" : undefined}
            lang={code}
            className={`focus-ring relative rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${
              isActive ? "text-cream" : "text-cream/50 hover:text-cream"
            }`}
          >
            {isActive && (
              <m.span
                layoutId="locale-active"
                className="absolute inset-0 rounded-full border border-cream/20 bg-gradient-to-br from-cream/15 to-cream/5"
                transition={navIndicator}
              />
            )}
            <span className="relative">{code}</span>
          </button>
        );
      })}
    </nav>
  );
}