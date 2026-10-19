"use client";

import { m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useScrolled } from "@/hooks/use-scrolled";
import { navIndicator } from "@/lib/motion";

const LOCALES = ["ro", "en"] as const;
const ONE_YEAR = 60 * 60 * 24 * 365;

function writeLocaleCookie(locale: (typeof LOCALES)[number]) {
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax${secure}`;
}

export function LanguageToggle() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const scrolled = useScrolled();

  const switchTo = (next: (typeof LOCALES)[number]) => {
    if (next === locale) return;

    writeLocaleCookie(next);

    const path = pathname === "/" ? "" : pathname;
    const hash = window.location.hash;

    if (hash) {
      router.replace(`${path}${hash}`, { locale: next });
    } else {
      router.replace(path || "/", { locale: next, scroll: false });
    }
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