import Image from "next/image";
import { LuArrowRight } from "react-icons/lu";
import type { Project } from "@/lib/projects";
import { TECH } from "@/lib/tech";

const MAX_ICONS = 5;

type ProjectCardProps = {
  project: Project;
  title: string;
  summary: string;
  onOpen: (trigger: HTMLButtonElement) => void;
};

export function ProjectCard({ project, title, summary, onOpen }: ProjectCardProps) {
  const visible = project.tech.slice(0, MAX_ICONS);
  const remaining = project.tech.length - visible.length;

  return (
    <article className="glass group relative overflow-hidden rounded-3xl shadow-glow transition-transform duration-300 hover:-translate-y-1.5">
      <button
        type="button"
        onClick={(event) => onOpen(event.currentTarget)}
        aria-label={title}
        className="focus-ring absolute inset-0 z-10 rounded-3xl"
      />

      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-navy-900 to-page">
        {project.cover ? (
          <Image
            src={project.cover}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />

        <span
          aria-hidden="true"
          className="glass-strong absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <LuArrowRight size={16} />
        </span>
      </div>

      <div className="p-5">
        <h3 className="mb-2 text-lg font-bold text-cream">{title}</h3>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-cream/70">{summary}</p>

        <ul className="flex flex-wrap items-center gap-3">
          {visible.map((key) => {
            const { label, Icon } = TECH[key];
            return (
              <li key={key} title={label} className="text-cream/80">
                <Icon size={22} aria-hidden="true" />
              </li>
            );
          })}
          {remaining > 0 ? (
            <li className="rounded-full bg-cream/10 px-2 py-1 text-xs font-medium text-cream/70">
              +{remaining}
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}