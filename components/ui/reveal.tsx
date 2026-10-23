"use client";

import type { ReactNode } from "react";
import { m } from "motion/react";
import { fadeUpHeading, revealSlow, staggerCards, viewSection } from "@/lib/motion";

export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      variants={staggerCards}
      initial="hidden"
      whileInView="visible"
      viewport={viewSection}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <m.div className={className} variants={fadeUpHeading} transition={revealSlow}>
      {children}
    </m.div>
  );
}