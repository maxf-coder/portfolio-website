"use client";

import type { CSSProperties } from "react";
import { TECH, type TechKey } from "@/lib/tech";

type TechIconProps = {
  tech: TechKey;
  size?: number;
  className?: string;
};

export function TechIcon({ tech, size = 22, className = "" }: TechIconProps) {
  const { label, Icon, color } = TECH[tech];

  return (
    <span
      title={label}
      aria-hidden="true"
      style={{ "--brand": color } as CSSProperties}
      className={`flex items-center justify-center text-cream/80 transition duration-300 hover:text-[var(--brand)] motion-safe:hover:-translate-y-1 motion-safe:hover:scale-90 ${className}`}
    >
      <Icon size={size} />
    </span>
  );
}

export function TechChip({ tech, size = 16 }: TechIconProps) {
  const { label, Icon, color } = TECH[tech];

  return (
    <span className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-cream">
      <Icon size={size} color={color} aria-hidden="true" />
      {label}
    </span>
  );
}