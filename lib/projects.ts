import type { TechKey } from "./tech";

export type Project = {
  id: string;
  tech: readonly TechKey[];
  cover?: string;
  live?: string;
  github?: string;
  images: readonly { src: string; width: number; height: number }[];
};

export const PROJECTS = [
  {
    id: "fiesta",
    tech: ["python", "django", "drf", "postgresql", "react", "typescript", "tailwind", "docker", "r2"],
    cover: "/projects/fiesta/cover.webp",
    live: "https://fiestagastro.dev",
    github: "https://github.com/maxf-coder/Cafe_site",
    images: [
      { src: "/projects/fiesta/1.webp", width: 1286, height: 579 },
      { src: "/projects/fiesta/2.webp", width: 1182, height: 543 },
      { src: "/projects/fiesta/3.webp", width: 1478, height: 540 },
      { src: "/projects/fiesta/4.webp", width: 1595, height: 889 },
      { src: "/projects/fiesta/5.webp", width: 1521, height: 908 },
      { src: "/projects/fiesta/6.webp", width: 1331, height: 898 },
      { src: "/projects/fiesta/7.webp", width: 1919, height: 914 },
      { src: "/projects/fiesta/8.webp", width: 1902, height: 901 },
    ],
  },
  {
    id: "vm-ai",
    tech: ["python", "pytorch", "fastapi", "postgresql", "huggingface", "scikitlearn", "xgboost", "sqlalchemy", "pydantic", "pytest", "git", "pandas", "numpy"],
    cover: "/projects/vm-ai/cover.webp",
    github: "https://github.com/maxf-coder/VM.AI",
    images: [
      { src: "/projects/vm-ai/1.webp", width: 1919, height: 905 },
      { src: "/projects/vm-ai/2.webp", width: 1919, height: 902 },
      { src: "/projects/vm-ai/3.webp", width: 1919, height: 899 },
      { src: "/projects/vm-ai/4.webp", width: 1264, height: 812 },
      { src: "/projects/vm-ai/5.webp", width: 1511, height: 877 },
      { src: "/projects/vm-ai/6.webp", width: 1092, height: 527 },
      { src: "/projects/vm-ai/7.webp", width: 1817, height: 1038 },
    ],
  },
  {
    id: "bookstorescraper",
    tech: ["python", "scrapy", "scrapeops", "mysql"],
    cover: "/projects/bookstorescraper/cover.webp",
    github: "https://github.com/maxf-coder/bookStoreScraper",
    images: [
      { src: "/projects/bookstorescraper/1.webp", width: 1152, height: 928 },
      { src: "/projects/bookstorescraper/2.webp", width: 1847, height: 667 },
      { src: "/projects/bookstorescraper/3.webp", width: 1117, height: 762 },
      { src: "/projects/bookstorescraper/4.webp", width: 1607, height: 1031 },
    ],
  },
] as const satisfies readonly Project[];

export type ProjectId = (typeof PROJECTS)[number]["id"];