import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { getFeaturedProjects } from "@/data/projects";

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <div className="flex-1">
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14 md:pt-20">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Designer
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight tracking-tight text-foreground md:text-6xl md:leading-[1.05]">
          I craft thoughtful brands and digital experiences.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          This is your portfolio shell—swap in your bio, add project imagery
          under{" "}
          <code className="rounded bg-foreground/5 px-1.5 py-0.5 text-sm">
            public/work/
          </code>
          , and link your real email and social profiles in the header and
          footer.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/work"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            View work
          </Link>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Get in touch
          </a>
        </div>
      </section>
      <section className="border-t border-foreground/10 bg-surface/50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-2xl tracking-tight text-foreground md:text-3xl">
                Featured work
              </h2>
              <p className="mt-2 max-w-xl text-muted">
                Highlights from recent collaborations. Mark projects with{" "}
                <code className="rounded bg-foreground/5 px-1.5 py-0.5 text-sm">
                  featured: true
                </code>{" "}
                in your data file.
              </p>
            </div>
            <Link
              href="/work"
              className="text-sm font-semibold text-accent hover:underline"
            >
              See all projects
            </Link>
          </div>
          <ul className="mt-12 grid gap-8 md:grid-cols-2">
            {featured.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
