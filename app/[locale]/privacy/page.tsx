import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "@/i18n/navigation";

const SECTION_IDS = [
  "who",
  "data",
  "why",
  "retention",
  "processors",
  "rights",
  "cookies",
  "sharing",
  "changes",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Privacy");
  const locale = await getLocale();

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        en: "/en/privacy",
        ro: "/ro/privacy",
        "x-default": "/en/privacy",
      },
    },
    openGraph: {
      type: "website",
      url: `/${locale}/privacy`,
      siteName: "Maxim Furculiță",
      locale: locale === "ro" ? "ro_RO" : "en_US",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("Privacy");

  return (
    <main className="flex flex-1 flex-col px-4 pb-24 pt-32 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/"
          className="focus-ring mb-10 inline-flex items-center gap-2 rounded text-sm text-cream/50 transition-colors hover:text-cream"
        >
          <FiArrowLeft size={14} aria-hidden="true" />
          {t("back")}
        </Link>

        <h1 className="gradient-text mb-3 text-3xl font-bold sm:text-4xl">{t("title")}</h1>
        <p className="text-lg text-cream/70">{t("subtitle")}</p>
        <p className="mb-12 mt-2 text-sm text-cream/70">{t("updated")}</p>

        <div className="glass space-y-10 rounded-3xl p-6 sm:p-10">
          {SECTION_IDS.map((id) => (
            <section key={id}>
              <h2 className="mb-3 text-lg font-semibold text-cream">
                {t(`sections.${id}.title`)}
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-cream/70">
                {t(`sections.${id}.body`)}
              </p>
              {id === "who" && (
                <a
                  href="mailto:max@maximf.com"
                  className="focus-ring mt-3 inline-block rounded text-sm text-cream underline decoration-cream/30 underline-offset-4 transition-colors hover:decoration-cream"
                >
                  max@maximf.com
                </a>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}