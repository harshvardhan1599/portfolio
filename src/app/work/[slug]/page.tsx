import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  projects,
} from "@/data/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="flex-1">
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-10 md:pt-14">
        <Link
          href="/work"
          className="text-sm font-medium text-muted transition-colors hover:text-accent"
        >
          ← Back to work
        </Link>
        <header className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-foreground/5 px-3 py-0.5 text-xs font-medium text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
          <h1 className="mt-6 font-display text-4xl tracking-tight text-foreground md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {project.summary}
          </p>
        </header>
        {project.coverImage ? (
          <div className="relative mt-12 aspect-video overflow-hidden rounded-2xl border border-foreground/10">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 48rem"
              priority
            />
          </div>
        ) : (
          <div
            className="mt-12 flex aspect-video items-center justify-center rounded-2xl border border-foreground/10 bg-gradient-to-br from-accent/15 via-background to-muted/30"
            aria-hidden
          >
            <span className="font-display text-5xl text-foreground/20">
              {project.title.slice(0, 1)}
            </span>
          </div>
        )}
        <div className="mt-12">
          {project.body.map((paragraph, i) => (
            <p
              key={i}
              className="mb-6 text-base leading-8 text-foreground/90 last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
