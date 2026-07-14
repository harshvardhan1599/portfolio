import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Swadesh",
  description:
    "Case study: designing a cross-border banking solution at Swadesh (YC S19).",
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
      "Swadesh was a cross-border banking solution built for the Indian diaspora — letting people open an account in the country they were moving to before they ever landed, and send money home without the usual friction of wires, markups, and broken apps.",
      "For most immigrants, the first few months in a new country are spent fighting the banking system. You can’t rent without an account. You can’t open an account without a local address. You lose money every time you send rupees home. The stack was broken long before anyone arrived at the airport.",
    ],
    highlight:
      "We designed Swadesh to be the first financial relationship a new immigrant has — before the flight, not after.",
    bodyAfter: [
      "As the design lead, I owned brand and product together. That meant defining how Swadesh felt the first time someone saw a billboard, and how it felt the hundredth time they tapped into the app to pay a bill. Both had to carry the same trust.",
      "Banking for immigrants is not a feature problem. It is an identity problem. Every screen had to feel like it belonged to the person using it — familiar enough to trust with a paycheck, modern enough to feel like a product built for them, not adapted to them.",
    ],
    images: [
      {
        src: "/work/swadesh-project-1.png",
        alt: "Swadesh — project overview",
        width: 3162,
        height: 1926,
        background: true,
      },
      {
        src: "/work/swadesh-project-2.png",
        alt: "Swadesh — project detail",
        width: 3162,
        height: 1974,
        background: true,
      },
      {
        src: "/work/swadesh-project-3.png",
        alt: "Swadesh — project detail 2",
        width: 3162,
        height: 1974,
        background: true,
      },
      {
        src: "/work/swadesh-project-4.png",
        alt: "Swadesh — project detail 3",
        width: 3162,
        height: 1974,
        background: true,
      },
      {
        src: "/work/swadesh-project-5.png",
        alt: "Swadesh — project detail 4",
        width: 3162,
        height: 1974,
        background: true,
      },
      {
        src: "/work/swadesh-project-6.png",
        alt: "Swadesh — project detail 5",
        width: 3162,
        height: 1974,
        background: true,
      },
      {
        src: "/work/swadesh-project-7.png",
        alt: "Swadesh — project detail 6",
        width: 3162,
        height: 1974,
        background: true,
      },
    ],
  },
];

export default function SwadeshPage() {
  return (
    <article className="surface-light flex-1">
      <section className="mx-auto w-full max-w-4xl">
        <div className="px-6 md:px-16 pb-8 pt-32 md:pt-40">
          <p className="text-alt text-muted">
            Swadesh · YC S19
          </p>
          <h1 className="text-heading mt-2 text-foreground">
            Banking for the Indian diaspora
          </h1>
        </div>

        <div className="w-full rounded-none bg-fill">
          <Image
            src="/work/swadesh-banner.png"
            alt="Swadesh — product hero"
            width={3162}
            height={1200}
            sizes="(min-width: 896px) 896px, 100vw"
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
