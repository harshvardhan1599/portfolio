import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Airbase",
  description:
    "Case study: designing the modern finance stack at Airbase.",
};

type SectionImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  background?: boolean;
  noBleed?: boolean;
};

type Section = {
  id: string;
  eyebrow?: string;
  title?: string;
  body: string[];
  quote?: { text: string; author: string };
  highlight?: string;
  bodyAfter?: string[];
  images?: SectionImage[];
};

const sections: Section[] = [
  {
    id: "abstract",
    body: [
      "Airbase unified bill payments, expense management, and corporate cards into a single platform — giving finance teams complete visibility and control over every dollar leaving the company.",
      "Before Airbase, companies stitched together three or four tools to do what one platform should. Approvals lived in email. Reconciliation was a monthly fire drill. Nobody trusted the numbers until the books closed.",
    ],
    highlight:
      "We designed Airbase to be the single source of truth for all non-payroll spend.",
    bodyAfter: [
      "As a product designer, I focused on the workflows that finance teams repeat hundreds of times a month — approvals, reconciliation, reporting. Every interaction had to feel fast and trustworthy, because in finance, confidence in the tool is confidence in the numbers.",
      "The challenge was making a powerful system feel simple. Airbase handled complex multi-entity accounting, custom approval chains, and real-time budget tracking — but the interface had to stay out of the way and let people move quickly.",
    ],
    images: [
      {
        src: "/work/airbase-project-1.png",
        alt: "Airbase — project overview",
        width: 3162,
        height: 1974,
      },
      {
        src: "/work/airbase-project-2.png",
        alt: "Airbase — project detail",
        width: 3162,
        height: 1926,
        background: true,
      },
      {
        src: "/work/airbase-project-3.png",
        alt: "Airbase — project detail 2",
        width: 3162,
        height: 1974,
      },
      {
        src: "/work/airbase-project-4.png",
        alt: "Airbase — project detail 3",
        width: 3162,
        height: 1974,
        background: true,
      },
      {
        src: "/work/airbase-project-5.png",
        alt: "Airbase — project detail 4",
        width: 3162,
        height: 1974,
        background: true,
      },
    ],
  },
];

export default function AirbasePage() {
  return (
    <article className="surface-light flex-1">
      <section className="mx-auto w-full max-w-4xl">
        <div className="px-6 md:px-16 pb-8 pt-10 md:pt-12">
          <p className="text-alt text-muted">
            Airbase · Acquired by Paylocity
          </p>
          <h1 className="text-heading mt-2 text-foreground">
            Designing the modern finance stack
          </h1>
        </div>

        <div className="w-full rounded-none bg-fill">
          <Image
            src="/work/airbase-banner.png"
            alt="Airbase — product hero"
            width={3162}
            height={1200}
            className="w-full object-center"
            priority
          />
        </div>

        <div className="pb-16 pt-4">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="pt-4 scroll-mt-20"
            >
              {section.eyebrow ? (
                <p className="text-alt text-muted uppercase px-6 md:px-16">{section.eyebrow}</p>
              ) : null}
              {section.title ? (
                <h2 className="text-heading-md mt-2 text-foreground px-6 md:px-16">
                  {section.title}
                </h2>
              ) : null}
              <div className="group">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-body text-foreground mt-4 px-6 md:px-16">
                    {paragraph}
                  </p>
                ))}
                {section.quote ? (
                  <figure className="mt-6 border-l border-border pl-6 mx-6 md:mx-16">
                    <p className="text-body font-medium text-foreground">
                      {section.quote.text}
                    </p>
                    <figcaption className="text-body text-muted mt-2">
                      {section.quote.author}
                    </figcaption>
                  </figure>
                ) : null}
                {section.highlight ? (
                  <div className="mt-6 px-6 md:px-16">
                    <p className="text-body font-medium text-foreground -mx-2 -my-1 link-hover w-fit group-hover:text-accent group-hover:bg-hover-accent">
                      {section.highlight}
                    </p>
                  </div>
                ) : null}
                {section.bodyAfter?.map((paragraph, i) => (
                  <p key={i} className="text-body text-foreground mt-4 px-6 md:px-16">
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.images?.map((image, i) =>
                image.src.endsWith(".svg") ? (
                  <div
                    key={image.src}
                    className={`${i === 0 ? "mt-12" : "mt-8"} border-y border-dashed border-border rounded-none bg-fill-secondary py-12`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="block mx-auto w-full max-w-md h-auto"
                    />
                  </div>
                ) : (
                  <div
                    key={image.src}
                    className={`${i === 0 ? "mt-12" : "mt-8"} border-y border-dashed border-border ${
                      image.background
                        ? `bg-fill-secondary ${image.noBleed ? "p-8" : ""}`
                        : ""
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="block w-full h-auto"
                    />
                  </div>
                )
              )}
            </section>
          ))}
        </div>
      </section>
    </article>
  );
}
