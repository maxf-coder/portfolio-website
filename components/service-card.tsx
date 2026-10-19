import type { IconType } from "react-icons";
import { LuCheck } from "react-icons/lu";

type ServiceCardProps = {
  icon: IconType;
  title: string;
  description: string;
  facts: string[];
};

export function ServiceCard({ icon: Icon, title, description, facts }: ServiceCardProps) {
  return (
    <article className="glass group relative h-full overflow-hidden rounded-3xl p-8 shadow-glow transition-transform duration-300 hover:-translate-y-2">
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-navy-800/30 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="glass-strong relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl">
        <Icon size={26} className="text-cream" />
      </div>

      <h3 className="relative mb-3 text-xl font-bold text-cream">{title}</h3>
      <p className="relative mb-6 text-sm leading-relaxed text-cream/70">{description}</p>

      <ul className="relative space-y-3">
        {facts.map((fact) => (
          <li key={fact} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cream/10">
              <LuCheck size={12} className="text-cream" />
            </span>
            <span className="text-sm leading-relaxed text-cream/70">{fact}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}