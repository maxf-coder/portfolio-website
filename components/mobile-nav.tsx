"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useTranslations } from "next-intl";
import { SECTION_IDS, type SectionId } from "@/lib/sections";
import { navIndicator, navItem, navItemStart, navItemStep, navPanel } from "@/lib/motion";

const NAV_ICONS: Record<SectionId, string> = {
  home: "M3 12L12 3l9 9M5 10v10h14V10",
  services: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  projects: "M3 7h18M3 12h18M3 17h18",
  skills: "M12 2L2 7v10l10 5 10-5V7l-10-5z",
  about:
    "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  contact: "M22 6l-10 7L2 6M2 6h20v12H2z",
};

export function MobileNav({ activeSection }: { activeSection: SectionId }) {
  const t = useTranslations("Navigation");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
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
          <path d={open ? "M18 6L6 18M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"} />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            key="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={navPanel}
            className="fixed inset-0 -z-10 bg-[#050a1f]/70 md:hidden"
          />
        )}

        {open && (
          <m.div
            key="mobile-nav-panel"
            id="mobile-nav-panel"
            ref={panelRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={navPanel}
            className="fixed inset-x-4 top-20 z-50 mx-auto max-w-sm md:hidden"
          >
            <div className="glass-pill relative overflow-hidden rounded-3xl p-3 shadow-glow">
              {SECTION_IDS.map((id, index) => {
                const isActive = id === activeSection;

                return (
                  <m.a
                    key={id}
                    href={`#${id}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...navItem, delay: navItemStart + index * navItemStep, }}
                    className="focus-ring group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3.5"
                  >
                    {isActive && (
                      <m.span
                        layoutId="nav-active-mobile"
                        className="absolute inset-0 rounded-2xl border border-cream/15 bg-gradient-to-br from-cream/15 to-cream/5"
                        transition={navIndicator}
                      />
                    )}

                    <span
                      className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                        isActive ? "bg-cream/10" : "bg-cream/5"
                      }`}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={isActive ? "text-cream" : "text-cream/50"}
                      >
                        <path d={NAV_ICONS[id]} />
                      </svg>
                    </span>

                    <span
                      className={`relative text-sm font-medium transition-colors ${
                        isActive ? "text-cream" : "text-cream/50 group-hover:text-cream"
                      }`}
                    >
                      {t(id)}
                    </span>

                    {isActive && (
                      <m.span
                        layoutId="nav-dot-mobile"
                        className="relative ml-auto h-2 w-2 rounded-full bg-cream"
                        transition={navIndicator}
                      />
                    )}
                  </m.a>
                );
              })}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}