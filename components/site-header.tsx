"use client";

import { useTranslations } from "next-intl";
import { useBackground } from "./background-provider";
import { Logo } from "./logo";

export function SiteHeader() {
  const t = useTranslations("Navigation");
  const { toggle } = useBackground();

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            toggle();
            window.scrollTo({ top: 0 });
          }}
          aria-label={t("logoLabel")}
          className="glass-pill rounded-2xl p-1.5 shadow-glow transition-transform duration-300 hover:scale-[1.04] active:scale-95"
        >
          <Logo />
        </button>
      </div>
    </header>
  );
}