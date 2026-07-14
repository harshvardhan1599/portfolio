import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sensei Agent",
  description:
    "Case study: building the system of action for sales at Sensei Agent.",
};

type SectionImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  background?: boolean;
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
      "There comes a time in every startup’s life when it is time to pick a CRM.",
      "For more than twenty years, the default has been Salesforce, usually after teams outgrow Notion tables or get lost across spreadsheets. Things slip. Ownership blurs. Chaos creeps in. Salesforce arrives to restore order.",
      "CRMs became systems that capture noise, not signal.",
      "Every deal generates forms, fields, and every data point needs a human to translate it into a dropdown selection",    
    ],
    highlight:
      "We built Sensei to be the AI native platform that replaces legacy CRM and becomes a system of action.",
    bodyAfter: [
      "As founding designer, my job was to understand the reps. Their pipeline reviews, their forecast calls, the hours they lost translating conversations into dropdowns. The goal was simple. Build a CRM that worked for reps, not the other way around. Sales reps deserved better than busy work.",
      "Agentic AI sat at the core of the product, which meant we got to build from first principles. No legacy patterns to inherit. No dropdowns to defend. Just the question: what should this actually feel like?",
      "Craft lives in what gets ignored. I raised PRs on hierarchy, copy, defaults, the edge cases others shipped past. The small things. Invisible when right. Unforgivable when wrong.",
      ],
    images: [
      // {
      //   src: "/work/sensei-02.svg",
      //   alt: "Sensei Agent — problem supporting illustration",
      //   width: 705,
      //   height: 464,
      // },
      {
        src: "/work/sensei-alt-01.png",
        alt: "Sensei Agent — alt 1",
        width: 3162,
        height: 1926,
      },
      {
        src: "/work/sensei-2.png",
        alt: "Sensei Agent — alt 2",
        width: 3162,
        height: 1936,
      },
      {
        src: "/work/sensei-meeting-3.png",
        alt: "Sensei Agent — alt 3",
        width: 3162,
        height: 1974,
      },
      {
        src: "/work/sensei-4.png",
        alt: "Sensei Agent — alt 4",
        width: 3162,
        height: 1974,
      },
      {
        src: "/work/sensei-5.png",
        alt: "Sensei Agent — alt 5",
        width: 3162,
        height: 1637,
      },
      {
        src: "/work/sensei-6.png",
        alt: "Sensei Agent — alt 6",
        width: 3162,
        height: 1974,
      },
      {
        src: "/work/sensei-7.png",
        alt: "Sensei Agent — alt 7",
        width: 3162,
        height: 1974,
      },
    ],
  },
];

export default function SenseiAgentPage() {
  return (
    <article className="surface-light flex-1">
      <section className="mx-auto w-full max-w-4xl">
        <div className="px-6 md:px-16 pb-8 pt-32 md:pt-40">
          <p className="text-alt text-muted">
            Sensei Agent  
          </p>
          <h1 className="text-heading mt-2 text-foreground">
            Building the system of action for sales
          </h1>
        </div>

        <div className="w-full rounded-none bg-fill">
          <Image
            src="/work/sensei-01.webp"
            alt="Sensei Agent — product hero"
            width={3162}
            height={1263}
            sizes="(min-width: 896px) 896px, 100vw"
            className="w-full object-center "
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
                      image.background ? "bg-fill-secondary py-2" : ""
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(min-width: 896px) 896px, 100vw"
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
