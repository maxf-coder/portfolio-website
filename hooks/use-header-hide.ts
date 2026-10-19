"use client";

import { useEffect, useRef, useState } from "react";

const HIDE_AFTER = 200;
const MIN_DELTA = 4;
const SETTLE_MS = 140;
const FALLBACK_MS = 600;

export function useHeaderHide(suspended = false) {
  const [hidden, setHidden] = useState(false);
  const linkScroll = useRef(false);
  const release = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let lastY = window.scrollY;
    let queued = false;

    const schedule = (ms: number) => {
      if (release.current) clearTimeout(release.current);
      release.current = setTimeout(() => {
        linkScroll.current = false;
      }, ms);
    };

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      queued = false;

      if (linkScroll.current) {
        schedule(SETTLE_MS);
        return;
      }

      if (suspended) return;

      if (delta > MIN_DELTA && y > HIDE_AFTER) {
        setHidden(true);
      } else if (delta < -MIN_DELTA || y <= HIDE_AFTER) {
        setHidden(false);
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    };

    const markLinkScroll = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;

      linkScroll.current = true;
      schedule(FALLBACK_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", markLinkScroll, { passive: true });
    document.addEventListener("click", markLinkScroll);
    document.addEventListener("click", markLinkScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", markLinkScroll);
      document.removeEventListener("click", markLinkScroll);
      document.removeEventListener("click", markLinkScroll);
    };
  }, [suspended]);

  return hidden && !suspended;
}