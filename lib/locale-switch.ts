import { MotionGlobalConfig } from "motion/react";

const WINDOW_MS = 1000;
let timer: ReturnType<typeof setTimeout> | undefined;

export function beginLocaleSwitch() {
  MotionGlobalConfig.skipAnimations = true;

  clearTimeout(timer);
  timer = setTimeout(() => {
    MotionGlobalConfig.skipAnimations = false;
  }, WINDOW_MS);
}