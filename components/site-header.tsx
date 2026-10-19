"use client";

import { useTranslations } from "next-intl";
import { useBackground } from "./background-provider";
import { NavPill } from "./nav-pill";
import { MobileNav } from "./mobile-nav";
import { Logo } from "./logo";
import { useScrollSpy } from "@/hooks/use-scroll-spy";

export function SiteHeader() {
  const t = useTranslations("Navigation");
  const { toggle } = useBackground();
  const activeSection = useScrollSpy();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="justify-self-start">
          <button
            type="button"
            onClick={() => {
              toggle();
              window.scrollTo({ top: 0 });
            }}
            aria-label={t("logoLabel")}
            className="focus-ring glass-pill block rounded-2xl p-1.5 shadow-glow transition-transform duration-300 hover:scale-[1.04] active:scale-95"
          >
            <Logo />
          </button>
        </div>

        <NavPill activeSection={activeSection} />

        <div className="col-start-3 flex items-center gap-2 justify-self-end">
          {/* language toggle lands here next sitting */}
          <MobileNav activeSection={activeSection} />
        </div>
      </div>
    </header>
  );
}