"use client";

import type { CSSProperties } from "react";
import { SHORT_LABELS, TECH, type TechKey } from "@/lib/tech";

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

type SkillIconProps = {
  tech: TechKey;
  size?: number;
};

export function SkillIcon({ tech, size = 36 }: SkillIconProps) {
  const { label, Icon, color } = TECH[tech];

  return (
    <span
      tabIndex={0}
      style={{ "--brand": color } as CSSProperties}
      className="group/skill focus-ring flex min-h-[60px] flex-col items-center justify-end rounded-lg px-1"
    >
      <span className="flex h-9 items-center justify-center text-cream/80 transition duration-200 ease-out group-hover/skill:text-[var(--brand)] group-focus-visible/skill:text-[var(--brand)] motion-safe:group-hover/skill:-translate-y-1 motion-safe:group-hover/skill:scale-90 motion-safe:group-focus-visible/skill:-translate-y-1 motion-safe:group-focus-visible/skill:scale-90">
        <Icon size={size} aria-hidden="true" />
      </span>

      <span className="mt-1 whitespace-nowrap text-[10px] leading-4 text-cream/60 opacity-0 transition-opacity duration-200 ease-out group-hover/skill:opacity-100 group-focus-visible/skill:opacity-100 [@media(hover:none)]:opacity-100">
        {SHORT_LABELS[tech] ?? label}
      </span>
    </span>
  );
}