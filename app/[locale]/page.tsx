import { getTranslations } from "next-intl/server";
import type { SectionId } from "@/lib/sections";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Projects } from "@/components/projects";

const PENDING: SectionId[] = ["skills", "about", "contact"];

export default async function Home() {
  const t = await getTranslations("Navigation");

  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Services />
      <Projects />
      {PENDING.map((id) => (
        <section key={id} id={id} className="flex min-h-screen items-center justify-center px-6">
          <h2 className="text-2xl font-semibold text-cream">{t(id)}</h2>
        </section>
      ))}
    </main>
  );
}