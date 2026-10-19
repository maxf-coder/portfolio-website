"use client";

import { useCallback, useSyncExternalStore, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { useTranslations } from "next-intl";
import { PROJECTS, type ProjectId } from "@/lib/projects";
import {
  fadeUpCard,
  fadeUpHeading,
  revealCard,
  revealSlow,
  staggerCards,
  viewCard,
  viewSection,
} from "@/lib/motion";
import { ProjectCard } from "./project-card";
import { ProjectDetail } from "./project-detail";

const HASH_CHANGED = "portfolio:hash-changed";

function readProjectFromHash(): ProjectId | null {
  const id = window.location.hash.slice(1);
  return PROJECTS.some((project) => project.id === id) ? (id as ProjectId) : null;
}

function subscribeToHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener(HASH_CHANGED, onStoreChange);

  return () => {
    window.removeEventListener("hashchange", onStoreChange);
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener(HASH_CHANGED, onStoreChange);
  };
}

function getServerProjectFromHash(): ProjectId | null {
  return null;
}

export function Projects() {
  const t = useTranslations("Projects");
  const openId = useSyncExternalStore(subscribeToHash, readProjectFromHash, getServerProjectFromHash);
  const [returnFocusTo, setReturnFocusTo] = useState<HTMLButtonElement | null>(null);

  const open = useCallback((id: ProjectId, trigger: HTMLButtonElement) => {
    setReturnFocusTo(trigger);
    window.history.pushState({ ...window.history.state, projectId: id }, "", `#${id}`);
    window.dispatchEvent(new Event(HASH_CHANGED));
  }, []);

  const close = useCallback(() => {
    if (window.history.state?.projectId) {
      window.history.back();
      return;
    }

    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new Event(HASH_CHANGED));
  }, []);

  const active = PROJECTS.find((project) => project.id === openId) ?? null;

  return (
    <section id="projects" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-4xl">
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

        <m.div
          className="flex flex-wrap justify-center gap-6"
          variants={staggerCards}
          initial="hidden"
          whileInView="visible"
          viewport={viewCard}
        >
          {PROJECTS.map((project) => (
            <m.div
              key={project.id}
              variants={fadeUpCard}
              transition={revealCard}
              className="w-full md:w-[calc((100%_-_1.5rem)/2)]"
            >
              <ProjectCard
                project={project}
                title={t(`items.${project.id}.title`)}
                summary={t(`items.${project.id}.summary`)}
                onOpen={(trigger) => open(project.id, trigger)}
              />
            </m.div>
          ))}
        </m.div>
      </div>

      <AnimatePresence>
        {active ? (
          <ProjectDetail
            key={active.id}
            project={active}
            returnFocusTo={returnFocusTo}
            onClose={close}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}