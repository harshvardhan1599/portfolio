import Image from "next/image";
import { Greeting } from "@/components/Greeting";
import { experiences } from "@/data/experience";

export default function Home() {
  return (
    <div className="flex-1">
      <section className="max-w-4xl">
        {/* Intro: Greeting, Headline, Bio, Experience */}
        <div className="px-6 pb-8 pt-10 md:px-10 md:pt-12">
          <div className="flex items-center gap-2">
            <Greeting />
          </div>

          <h1 className="text-heading mt-4 text-foreground">
          Harsh is an Interaction Designer building digital products and brands.
          </h1>

          {/* <p className="text-body mt-4 text-muted">
            I build AI agents for developers and own design, brand, and research.
            If it shapes how the product feels, it&apos;s on me.
          </p> */}

          <div className="mt-6">
            <table className="w-full">
              <tbody>
                {experiences.map((exp) => (
                  <tr
                    key={exp.year + exp.company}
                  >
                    <td className="text-alt py-2 pr-2 text-muted whitespace-nowrap">
                      {exp.year}
                    </td>
                    <td className="text-body py-2 pr-2 font-medium text-foreground">
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
        </div>

        {/* Summary & Project screenshots */}
        <div className="pb-16">
          <p className="text-body text-muted px-6 md:px-10">
            Currently leading design and product at{" "}
            <span className="font-medium text-foreground underline">
              Sensei Agent
            </span>
            , an agentic sales CRM incubated at Suttor Hill Ventures.
          </p>

          <div className="mt-2">
            <div data-cursor="case-study" className="w-full rounded-none bg-fill hover:bg-fill-hover transition-colors px-10 py-8">
              <Image
                src="/work/Product.webp"
                alt="Sensei Agent — Deal overview with AI-powered action items"
                width={1312}
                height={912}
                className="w-full border border-border object-center rounded-lg"
                priority
              />
            </div>
          </div>

          {/* Project grid */}
          <div data-cursor="case-study" className="mt-2 grid grid-cols-1 md:grid-cols-5 gap-2">
            <div className="md:col-span-3 rounded-none bg-fill-secondary hover:bg-fill-hover transition-colors h-120 overflow-hidden">
              <Image
                src="/work/Brand1.webp"
                alt="Sensei Agent — Sales is hard brand mockup on tablet"
                width={1400}
                height={934}
                className="h-full w-full object-cover hover:opacity-80 transition-opacity"
              />
            </div>
            <div className="md:col-span-2 py-10 rounded-none bg-fill-secondary hover:bg-fill-hover transition-colors h-120 overflow-hidden">
              <Image
                src="/work/Brand2.webp"
                alt="Sensei Agent — Elevate Your Game brand stories"
                width={1400}
                height={934}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Project 2 */}
        <div className="pb-16">
          <p className="text-body text-muted px-6 md:px-10">
            <span className="text-foreground font-medium">Airbase</span>, spend management platform. Acquired by Paylocity in 2025.
          </p>

          <div data-cursor="case-study" className="mt-2 grid grid-cols-1 md:grid-cols-10 gap-2">
            <div className="md:col-span-4 rounded-none p-4 bg-fill-secondary hover:bg-fill-hover transition-colors overflow-hidden">
              <Image
                src="/work/Airbase1.webp"
                alt="Airbase — Spend via cards, spending by person, and declined transactions dashboards"
                width={800}
                height={1400}
                className="w-full"
              />
            </div>
            <div className="md:col-span-6 rounded-none bg-fill hover:bg-fill-hover transition-colors overflow-hidden">
              <Image
                src="/work/Airbase2.webp"
                alt="Airbase — Ledger entries pending review"
                width={1024}
                height={1024}
                className="h-full w-full object-cover hover:opacity-80 transition-opacity"
              />
            </div>
          </div>

          <div className="mt-2">
            <div data-cursor="case-study" className="w-full rounded-none bg-fill hover:bg-fill-hover transition-colors px-4 pt-4 pb-0 overflow-hidden">
              <Image
                src="/work/Airbase3.webp"
                alt="Airbase — Reports & Analytics productivity dashboard"
                width={1536}
                height={800}
                className="w-full"
              />
            </div>
          </div>

        </div>

        {/* Project 3 */}
        <div className="pb-16">
          <p className="text-body text-muted px-6 md:px-10">
          Led design and branding at <span className="text-foreground font-medium">Swadesh (YC S19)</span>, building a cross-border banking solution.
          </p>

          <div className="mt-2">
            <div data-cursor="case-study" className="w-full rounded-none bg-fill hover:bg-fill-hover transition-colors px-8 py-8 overflow-hidden">
              <Image
                src="/work/SwadeshHero.webp"
                alt="Swadesh — Link account, credit, and cards screens"
                width={1440}
                height={800}
                className="w-full"
              />
            </div>
          </div>

          <div data-cursor="case-study" className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="rounded-none bg-fill hover:bg-fill-hover transition-colors h-120 overflow-hidden">
              <Image
                src="/work/SwadeshMock.webp"
                alt="Swadesh — Phone mockup on green fabric"
                width={1000}
                height={1200}
                className="h-full w-full object-cover hover:opacity-80 transition-opacity"
              />
            </div>
            <div className="rounded-none bg-fill-secondary hover:bg-fill-hover transition-colors h-120 overflow-hidden px-4 pt-4 pb-0">
              <Image
                src="/work/SwadeshMockup.webp"
                alt="Swadesh — Debit Visa card mockup"
                width={1024}
                height={1024}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
