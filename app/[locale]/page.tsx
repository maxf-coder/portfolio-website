import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/reveal";

export default async function Home() {
  const t = await getTranslations("Hero");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <Reveal>
        <h1 className="text-4xl font-semibold tracking-tight text-cream">{t("name")}</h1>
      </Reveal>
      <p className="text-lg text-cream/80">Ț ț Ș ș Ă ă Î î Â â</p>
      <p className="max-w-md text-balance text-cream/60">{t("tagline")}</p>

      <div className="w-20 h-20 bg-navy-900 border-10 border-navy-800"></div>
      <div className="w-20 h-20 glass-strong"></div>
    </main>
  );
}