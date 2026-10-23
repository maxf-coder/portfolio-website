"use client";

import { useEffect, useLayoutEffect } from "react";
import { m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useScrolled } from "@/hooks/use-scrolled";
import { beginLocaleSwitch } from "@/lib/locale-switch";
import { navIndicator } from "@/lib/motion";

const LOCALES = ["ro", "en"] as const;
const SCROLL_KEY = "locale-scroll";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function LanguageToggle({ layoutId = "locale-active" }: { layoutId?: string }) {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const scrolled = useScrolled();

  useIsomorphicLayoutEffect(() => {
    let stored: string | null = null;
    try {
      stored = sessionStorage.getItem(SCROLL_KEY);
    } catch {
      return;
    }
    if (stored === null) return;

    sessionStorage.removeItem(SCROLL_KEY);
    const top = Number(stored);
    if (!Number.isFinite(top)) return;

    window.scrollTo({ top, behavior: "instant" });
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top, behavior: "instant" });
    });

    return () => cancelAnimationFrame(frame);
  }, [locale]);

  const switchTo = (next: (typeof LOCALES)[number]) => {
    if (next === locale) return;

    beginLocaleSwitch();

    try {
      sessionStorage.setItem(SCROLL_KEY, String(window.scrollY));
    } catch {
      // Private mode without storage: the switch still works, it may scroll.
    }

    router.replace(pathname || "/", { locale: next, scroll: false });
  };

  const prefetch = (code: (typeof LOCALES)[number]) => {
    if (code === locale) return;
    router.prefetch(pathname || "/", { locale: code });
  };

  return (
    <nav
      aria-label={t("languageLabel")}
      className={`relative inline-flex w-fit items-center rounded-full p-1 shadow-glow transition-colors duration-300 ${
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
            onPointerDown={() => prefetch(code)}
            aria-current={isActive ? "true" : undefined}
            lang={code}
            className={`focus-ring relative rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${
              isActive ? "text-cream" : "text-cream/50 hover:text-cream"
            }`}
          >
            {isActive && (
              <m.span
                layoutId={layoutId}
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