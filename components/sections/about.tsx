"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "motion/react";
import { useTranslations } from "next-intl";
import { FiBriefcase, FiCode, FiDownload, FiFileText, FiGlobe, FiMapPin } from "react-icons/fi";
import { LuX } from "react-icons/lu";
import {
  fadeUpHeading,
  revealSlow,
  slideFromLeft,
  slideFromRight,
  viewCard,
  viewOnce,
  viewSection,
} from "@/lib/motion";

const FACTS = [
  { id: "location", Icon: FiMapPin },
  { id: "languages", Icon: FiGlobe },
  { id: "focus", Icon: FiCode },
  { id: "experience", Icon: FiBriefcase },
] as const;

const CVS = [
  { id: "backend", href: "/cv/Maxim_Furculita_Backend_CV.pdf" },
  { id: "fullstack", href: "/cv/Maxim_Furculita_Fullstack_CV.pdf" },
] as const;

export function About() {
  const t = useTranslations("About");
  const [cvOpen, setCvOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeCv = useCallback(() => setCvOpen(false), []);

  return (
    <>
      <section id="about" className="relative overflow-x-clip px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
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

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <m.div
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={viewCard}
              transition={revealSlow}
            >
              <div className="glass rounded-3xl p-8 shadow-glow">
                <p className="text-base leading-relaxed text-cream sm:text-lg">{t("text")}</p>

                <m.button
                  ref={triggerRef}
                  type="button"
                  onClick={() => setCvOpen(true)}
                  aria-haspopup="dialog"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-navy-950 shadow-glow-cream"
                >
                  <FiDownload aria-hidden="true" size={18} />
                  {t("cv.button")}
                </m.button>
              </div>
            </m.div>

            <m.div
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewCard}
              transition={revealSlow}
            >
              <div className="glass space-y-1 rounded-3xl p-8 shadow-glow">
                {FACTS.map(({ id, Icon }, index) => (
                  <m.div
                    key={id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewOnce}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 border-b border-cream/10 py-4 last:border-0"
                  >
                    <span className="glass-strong flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
                      <Icon aria-hidden="true" size={18} className="text-cream" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-cream/50">
                        {t(`facts.${id}.label`)}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-cream">
                        {t(`facts.${id}.value`)}
                      </p>
                    </div>
                  </m.div>
                ))}
              </div>
            </m.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {cvOpen && <CvDialog onClose={closeCv} returnFocusTo={triggerRef} />}
      </AnimatePresence>
    </>
  );
}

function CvDialog({
  onClose,
  returnFocusTo,
}: {
  onClose: () => void;
  returnFocusTo: RefObject<HTMLButtonElement | null>;
}) {
  const t = useTranslations("About");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const returnTarget = returnFocusTo.current;
    const previousOverflow = document.body.style.overflow;
    const behind = Array.from(document.body.children).filter((element) => element !== overlay);

    document.body.style.overflow = "hidden";
    behind.forEach((element) => element.setAttribute("inert", ""));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      behind.forEach((element) => element.removeAttribute("inert"));
      window.removeEventListener("keydown", onKeyDown);
      returnTarget?.focus();
    };
  }, [onClose, returnFocusTo]);

  return createPortal(
    <m.div
      ref={overlayRef}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-md sm:p-8"
    >
      <m.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cv-dialog-title"
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="glass-strong shadow-glow-cream w-full max-w-md rounded-3xl p-8"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 id="cv-dialog-title" className="text-xl font-bold text-cream">
            {t("cv.title")}
          </h3>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label={t("cv.close")}
            className="glass focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cream transition-transform hover:scale-110"
          >
            <LuX size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-3">
          {CVS.map(({ id, href }) => (
            <m.a
              key={id}
              href={href}
              download
              type="application/pdf"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass focus-ring flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-cream/30"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cream/10">
                <FiFileText size={22} className="text-cream" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-cream">{t(`cv.${id}`)}</span>
                <span className="mt-0.5 block text-xs text-cream/50">{t("cv.format")}</span>
              </span>
              <FiDownload size={18} className="text-cream/50" aria-hidden="true" />
            </m.a>
          ))}
        </div>
      </m.div>
    </m.div>,
    document.body,
  );
}