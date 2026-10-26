import { SITE_NAME, SITE_NAME_ALTERNATES, SITE_URL } from "@/lib/site";

const GITHUB_URL = "https://github.com/maxf-coder";
const LINKEDIN_URL = "https://www.linkedin.com/in/maxim-furculita";

/**
 * Person + WebSite schema. `alternateName` tells search engines that the
 * diacritic spellings refer to the same person as SITE_NAME.
 */
export function structuredData(locale: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: SITE_NAME,
        alternateName: SITE_NAME_ALTERNATES,
        url: SITE_URL,
        jobTitle: "Backend & Full-stack Developer",
        sameAs: [GITHUB_URL, LINKEDIN_URL],
        address: {
          "@type": "PostalAddress",
          addressCountry: "RO",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        alternateName: SITE_NAME_ALTERNATES,
        url: SITE_URL,
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };
}
