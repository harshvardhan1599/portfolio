import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-sm transition-all hover:border-accent/30 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] bg-muted/20">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/15 via-background to-muted/30">
            <span className="font-display text-2xl text-foreground/25">
              {project.title.slice(0, 1)}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h2 className="font-display text-xl tracking-tight text-foreground transition-colors group-hover:text-accent">
          {project.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-foreground/5 px-3 py-0.5 text-xs font-medium text-muted"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
