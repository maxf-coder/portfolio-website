import type { TechKey } from "./tech";

export type SkillGroup = {
  id: "backend" | "frontend" | "devops" | "scraping" | "ml";
  items: readonly TechKey[];
};

export const SKILL_GROUPS = [
  {
    id: "backend",
    items: ["python", "django", "drf", "fastapi", "sqlalchemy", "postgresql", "mysql", "sqlite"],
  },
  {
    id: "frontend",
    items: ["react", "typescript", "javascript", "nextjs", "tailwind", "html5", "css3", "vite", "figma"],
  },
  {
    id: "devops",
    items: ["docker", "linux", "git", "github", "render", "cloudflare"],
  },
  {
    id: "scraping",
    items: ["scrapy", "pandas", "numpy"],
  },
  {
    id: "ml",
    items: ["pytorch", "huggingface", "scikitlearn", "xgboost"],
  },
] as const satisfies readonly SkillGroup[];