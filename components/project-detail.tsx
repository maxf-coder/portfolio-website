"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { m } from "motion/react";
import { useTranslations } from "next-intl";
import { LuExternalLink, LuX } from "react-icons/lu";
import { SiGithub } from "react-icons/si";
import type { Project } from "@/lib/projects";
import { TechChip } from "@/lib/tech-icon";

type ProjectDetailProps = {
  project: Project;
  returnFocusTo: HTMLElement | null;
  onClose: () => void;
};

export function ProjectDetail({ project, returnFocusTo, onClose }: ProjectDetailProps) {
  const t = useTranslations("Projects");
  const description = t.raw(`items.${project.id}.description`) as string[];
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
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
      returnFocusTo?.focus();
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
        aria-labelledby={`project-${project.id}-title`}
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="glass-strong shadow-glow-cream max-h-[calc(100dvh-4rem)] w-full max-w-3xl overflow-y-auto rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex h-14 items-center justify-end bg-gradient-to-b from-navy-900/90 to-transparent px-4 backdrop-blur-sm">
          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label={t("close")}
            className="glass-strong focus-ring flex h-10 w-10 items-center justify-center rounded-full text-cream transition-transform hover:scale-110"
          >
            <LuX size={20} aria-hidden="true" />
          </button>
        </div>

        {project.cover ? (
          <div className="relative -mt-14 aspect-video overflow-hidden">
            <Image
              src={project.cover}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent" />
          </div>
        ) : null}

        <div className="space-y-6 p-6 sm:p-8">
          <div>
            <h3 id={`project-${project.id}-title`} className="text-2xl font-bold text-cream sm:text-3xl">
              {t(`items.${project.id}.title`)}
            </h3>
            <p className="mt-2 text-cream/70">{t(`items.${project.id}.summary`)}</p>
          </div>

          <div className="space-y-3">
            {description.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-cream/70 sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>

          <div>
            <h4 className="mb-2 text-xs uppercase tracking-wider text-cream/50">{t("role")}</h4>
            <p className="text-sm font-medium text-cream">{t(`items.${project.id}.role`)}</p>
          </div>

          <div>
            <h4 className="mb-3 text-xs uppercase tracking-wider text-cream/50">{t("stack")}</h4>
            <ul className="flex flex-wrap gap-2">
              {project.tech.map((key) => (
                <li key={key}>
                  <TechChip tech={key} />
                </li>
              ))}
            </ul>
          </div>

          {project.live || project.github ? (
            <div className="flex flex-wrap gap-3">
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-navy-950 transition-transform hover:scale-105"
                >
                  <LuExternalLink size={16} aria-hidden="true" />
                  {t("live")}
                </a>
              ) : null}

              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass focus-ring inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:scale-105"
                >
                  <SiGithub size={16} aria-hidden="true" />
                  {t("github")}
                </a>
              ) : null}
            </div>
          ) : null}
          {project.images.length > 0 ? (
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-cream/50">{t("gallery")}</h4>
              {project.images.map((image) => (
                <Image
                  key={image.src}
                  src={image.src}
                  alt=""
                  width={image.width}
                  height={image.height}
                  unoptimized
                  sizes="(min-width: 768px) 704px, 100vw"
                  className="h-auto w-full rounded-2xl"
                />
              ))}
            </div>
          ) : null}
        </div>
      </m.div>
    </m.div>,
    document.body,
  );
}