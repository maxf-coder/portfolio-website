import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Hero />
        <Services />
        <Projects />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}