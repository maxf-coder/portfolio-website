"use client";

import { useEffect, useState } from "react";

const HIDE_AFTER = 200;
const MIN_DELTA = 4;

export function useHeaderHide(suspended = false) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let queued = false;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      queued = false;

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

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [suspended]);

  return hidden && !suspended;
}