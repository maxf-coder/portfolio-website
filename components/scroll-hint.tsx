"use client";

import { m } from "motion/react";
import { LuChevronsDown } from "react-icons/lu";

export function ScrollHint({ label }: { label: string }) {
  return (
    <div className="mt-20 flex flex-col items-center gap-2">
      <m.a
        href="#services"
        aria-label={label}
        className="focus-ring text-cream/60 transition-colors hover:text-cream"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <LuChevronsDown size={24} strokeWidth={1.5} />
      </m.a>
    </div>
  );
}