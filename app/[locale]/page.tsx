import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("Hero");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">{t("name")}</h1>
      <p className="text-lg text-cream/80">{t("role")}</p>
      <p className="max-w-md text-balance text-cream/60">{t("tagline")}</p>
    </main>
  );
}