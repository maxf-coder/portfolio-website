import { getTranslations } from "next-intl/server";
import { SECTION_IDS } from "@/lib/sections";

export default async function Home() {
  const t = await getTranslations("Navigation");

  return (
    <main className="flex flex-1 flex-col">
      {SECTION_IDS.map((id) => (
        <section
          key={id}
          id={id}
          className="flex min-h-screen items-center justify-center px-6"
        >
          <h2 className="text-2xl font-semibold text-cream">{t(id)}</h2>
        </section>
      ))}
    </main>
  );
}