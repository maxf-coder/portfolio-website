import type { TechKey } from "./tech";

export type Project = {
  id: string;
  tech: readonly TechKey[];
  live?: string;
  github?: string;
  images: readonly string[];
};

export const PROJECTS = [
  {
    id: "fiesta",
    tech: [],
    live: "https://fiestagastro.dev",
    images: [],
  },
  {
    id: "vm-ai",
    tech: [],
    images: [],
  },
] as const satisfies readonly Project[];

export type ProjectId = (typeof PROJECTS)[number]["id"];