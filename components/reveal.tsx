"use client"

import type { ReactNode } from "react";
import { m } from "motion/react";
import { fadeUp, revealOnce } from "@/lib/motion";

export function Reveal({ children }: { children: ReactNode}) {
    return (
        <m.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={revealOnce}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {children}
        </m.div>
    );
}