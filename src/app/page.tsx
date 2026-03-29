import Image from "next/image";
import { Greeting } from "@/components/Greeting";
import { experiences } from "@/data/experience";

export default function Home() {
  return (
    <div className="flex-1">
      <section className="max-w-4xl pb-16 pt-10 md:pt-12">
        {/* Greeting */}
        <div className="flex items-center gap-2">
          <Greeting />
        </div>

        {/* Headline */}
        <h1 className="text-heading mt-4 text-foreground">
          I&apos;m Harsh, a product designer with 5+ years experience building
          products, brands, and teams.
        </h1>

        {/* Bio */}
        <p className="text-body mt-4 text-muted">
          I build AI agents for developers and own design, brand, and research.
          If it shapes how the product feels, it&apos;s on me.
        </p>

        {/* Experience table */}
        <div className="mt-6">
          <table className="w-full">
            <tbody>
              {experiences.map((exp) => (
                <tr
                  key={exp.year + exp.company}
                >
                  <td className="text-alt py-2 pr-8 text-muted whitespace-nowrap">
                    {exp.year}
                  </td>
                  <td className="text-body py-2 pr-8 font-medium text-foreground">
                    {exp.url ? (
                      <a href={exp.url} target="_blank" rel="noopener noreferrer" className="link-hover">
                        {exp.company}
                      </a>
                    ) : (
                      exp.company
                    )}
                  </td>
                  <td className="text-body py-2 text-muted">
                    {exp.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <p className="text-body mt-8 text-muted">
          Currently leading design and product at{" "}
          <span className="font-medium text-foreground underline">
            Sensei Agent
          </span>
          , an agentic sales CRM incubated at Suttor Hill Ventures.
        </p>

        {/* Project screenshots */}
        <div className="mt-16">
          <div className="w-full rounded-lg bg-fill p-6">
            <Image
              src="/work/sensei-hero.webp"
              alt="Sensei Agent — Deal overview with AI-powered action items"
              width={1312}
              height={912}
              className="w-full rounded-lg"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
}
