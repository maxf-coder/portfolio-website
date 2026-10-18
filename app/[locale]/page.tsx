import { getTranslations } from "next-intl/server";
import { RevealItem, RevealGroup } from "@/components/reveal";

export default async function Home() {
  const t = await getTranslations("Hero");

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
  <RevealGroup className="flex flex-col items-center gap-4">
    <RevealItem>
      <h1 className="text-4xl font-semibold tracking-tight text-cream">{t("name")}</h1>
    </RevealItem>
    <RevealItem>
      <p className="text-lg text-cream/80">Ț ț Ș ș Ă ă Î î Â â</p>
    </RevealItem>
    <RevealItem>
      <p className="max-w-md text-balance text-cream/60">{t("tagline")}</p>
    </RevealItem>
    <RevealItem>
      <div className="w-20 h-20 bg-navy-900 border-10 border-navy-800" />
    </RevealItem>
  </RevealGroup>
</main>
  );
}