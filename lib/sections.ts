export const SECTION_IDS = ["home", "services", "projects", "skills", "about", "contact"] as const;

export type SectionId = (typeof SECTION_IDS)[number];