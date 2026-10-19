import type { TechKey } from "./tech";

export const SKILL_GROUPS = [
  { id: "backend", tech: ["python", "django", "drf", "fastapi", "postgresql", "redis", "celery"] },
  { id: "frontend", tech: ["react", "nextjs", "typescript", "javascript", "tailwind"] },
  { id: "deployment", tech: ["docker", "nginx", "linux", "git", "github"] },
  { id: "automation", tech: ["scrapy", "selenium", "pandas", "numpy"] },
] as const satisfies readonly { id: string; tech: readonly TechKey[] }[];

export type SkillGroupId = (typeof SKILL_GROUPS)[number]["id"];
