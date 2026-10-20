import type { TechKey } from "./tech";

export type Project = {
  id: string;
  tech: readonly TechKey[];
  cover?: string;
  live?: string;
  github?: string;
  images: readonly string[];
};

export const PROJECTS = [
  {
    id: "fiesta",
    tech: ["python", "django", "drf", "postgresql", "react", "typescript", "tailwind", "docker", "r2"],
    cover: "/projects/fiesta/cover.webp",
    live: "https://fiestagastro.dev",
    github: "https://github.com/maxf-coder/Cafe_site",
    images: ["/projects/fiesta/1.webp",],
  },
  {
    id: "vm-ai",
    tech: ["python", "pandas", "numpy", "fastapi", "docker"],
    images: [],
  },
] as const satisfies readonly Project[];

export type ProjectId = (typeof PROJECTS)[number]["id"];