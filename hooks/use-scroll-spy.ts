"use client";

import { useEffect, useState } from "react";
import { SECTION_IDS, type SectionId } from "@/lib/sections";

export function useScrollSpy() {
  const [activeSection, setActiveSection] = useState<SectionId>("home");

  useEffect(() => {
    const visible = new Set<SectionId>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }

        if (visible.size === 0) return;

        let best: SectionId | null = null;
        let bestTop = -Infinity;

        for (const id of visible) {
          const top = document.getElementById(id)?.getBoundingClientRect().top ?? 0;
          if (top > bestTop) {
            bestTop = top;
            best = id;
          }
        }

        if (best) setActiveSection(best);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    for (const id of SECTION_IDS) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return activeSection;
}