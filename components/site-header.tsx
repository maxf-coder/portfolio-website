"use client";

import { useCallback, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useBackground, type BackgroundVariant } from "./background-provider";
import { NavPill } from "./nav-pill";
import { MobileNav } from "./mobile-nav";
import { Logo } from "./logo";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { useHeaderHide } from "@/hooks/use-header-hide";
import { headerHide } from "@/lib/motion";
import { LanguageToggle } from "./language-toggle";

const PULSE: Record<BackgroundVariant, string> = {
  aurora: "rgba(252, 241, 208, 0.9)",
  particles: "rgba(64, 130, 200, 0.9)",
};

export function SiteHeader() {
  const t = useTranslations("Navigation");
  const { toggle, variant } = useBackground();
  const activeSection = useScrollSpy();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileNav = useCallback(() => setMobileOpen(false), []);
  const hidden = useHeaderHide(mobileOpen);
  const reduceMotion = useReducedMotion();

  return (
    <>
      <m.header
        animate={{ y: hidden ? -120 : 0 }}
        transition={headerHide}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="justify-self-start">
            <button
              type="button"
              onClick={() => {
                toggle();
                window.scrollTo({ top: 0 });
              }}
              aria-label={t("logoLabel")}
              className="focus-ring glass-pill relative block transform-gpu rounded-2xl p-1.5 shadow-glow transition-transform duration-300 will-change-transform hover:scale-[1.04] active:scale-95"
            >
              <m.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{ boxShadow: `0 0 28px 6px ${PULSE[variant]}` }}
                initial={{ opacity: 0.15 }}
                animate={{ opacity: reduceMotion ? 0.6 : [0.15, 1, 0.15] }}
                transition={reduceMotion ? { duration: 0 } : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <Logo />
            </button>
          </div>

          <NavPill activeSection={activeSection} />

          <div className="col-start-3 flex items-center gap-2 justify-self-end">
            <LanguageToggle />
            <button
              id="mobile-nav-trigger"
              type="button"
              onClick={() => setMobileOpen((current) => !current)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              aria-label={t("menu")}
              className="focus-ring glass-pill rounded-full p-2.5 text-cream shadow-glow transition-transform active:scale-95 md:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path
                  d={mobileOpen ? "M18 6L6 18M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"}
                />
              </svg>
            </button>
          </div>
        </div>
      </m.header>

      <MobileNav open={mobileOpen} onClose={closeMobileNav} activeSection={activeSection} />
    </>
  );
}