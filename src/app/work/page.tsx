import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected design projects and case studies.",
};

export default function WorkPage() {
  return (
    <div className="flex-1">
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 md:pt-16">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Work
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-foreground md:text-5xl">
          Selected projects
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          A curated set of branding, product, and editorial work. Replace
          summaries and add cover images in{" "}
          <code className="rounded bg-foreground/5 px-1.5 py-0.5 text-sm">
            src/data/projects.ts
          </code>
          .
        </p>
        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
