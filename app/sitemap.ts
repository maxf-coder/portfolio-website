import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const LAST_MODIFIED = new Date("2026-10-23");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/en`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: `${SITE_URL}/en`,
          ro: `${SITE_URL}/ro`,
          "x-default": `${SITE_URL}/en`,
        },
      },
    },
    {
      url: `${SITE_URL}/ro`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: `${SITE_URL}/en`,
          ro: `${SITE_URL}/ro`,
          "x-default": `${SITE_URL}/en`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/privacy`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          en: `${SITE_URL}/en/privacy`,
          ro: `${SITE_URL}/ro/privacy`,
          "x-default": `${SITE_URL}/en/privacy`,
        },
      },
    },
    {
      url: `${SITE_URL}/ro/privacy`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          en: `${SITE_URL}/en/privacy`,
          ro: `${SITE_URL}/ro/privacy`,
          "x-default": `${SITE_URL}/en/privacy`,
        },
      },
    },
  ];
}