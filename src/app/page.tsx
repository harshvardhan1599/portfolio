import Image from "next/image";
import Link from "next/link";
import { Greeting } from "@/components/Greeting";
import { HeroAside } from "@/components/HeroAside";
import { DitherSection } from "@/components/DitherSection";
import { DisplayTile } from "@/components/DisplayTile";
import { PhonesTile } from "@/components/PhonesTile";
import { NotetakerTile } from "@/components/NotetakerTile";

export default function Home() {
  return (
    <div className="flex-1">
      <section>
        {/* Hero */}
        <div className="px-6 pb-10 pt-12 md:px-14 md:pt-14">
          <div className="flex flex-col gap-10 md:flex-row md:items-stretch md:justify-between">
            {/* Left: location + time (top), then title (bottom) */}
            <div className="flex flex-col md:justify-between">
              <Greeting />
              <h1 className="text-hero mt-6 text-foreground md:mt-16">
                Harsh Vardhan Singh,
                <br />
                Product Designer
              </h1>
            </div>

            {/* Right: menu (top), then secondary text (bottom) */}
            <HeroAside />
          </div>
        </div>

        {/* Dither transition: dark hero → white work section (animated) */}
        <DitherSection />

        {/* Work */}
        <div className="surface-light px-6 pt-10 md:px-14">
          {/* Project 1 — Sensei Agent (50/50 two-column scaffold) */}
          <div className="pb-16">
            <p className="text-alt text-muted">
              Currently leading design and product at{" "}
              <span className="text-foreground">Sensei Agent</span>, an agentic
              sales CRM incubated at Suttor Hill Ventures.
            </p>

            <Link
              href="/work/sensei-agent"
              data-cursor="case-study"
              className="mt-4 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2"
            >
              {/* Left column — tile heights sum to 1360px (matches right) */}
              <div className="flex flex-col gap-4">
                {/* Studio Display mockup over blurred wallpaper */}
                <DisplayTile />

                {/* Testimonial */}
                <figure className="flex min-h-[300px] flex-1 items-center justify-center rounded-2xl bg-[#F4F4F4] p-8">
                  <div className="flex w-full flex-col gap-8 rounded-xl border border-[#E4E4E4] bg-white p-8">
                    <blockquote className="text-[22px] leading-[135%] text-foreground">
                      Creative, effective, and exceptionally fast. He owns
                      solutions end to end with clear ideas and tight execution.
                    </blockquote>
                    <figcaption className="flex items-center gap-3">
                      <Image
                        src="/work/prannay-khosla.png"
                        alt="Prannay Khosla"
                        width={80}
                        height={80}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                      <span className="text-alt-sm text-muted">
                        Prannay Khosla, CTO
                      </span>
                    </figcaption>
                  </div>
                </figure>

                {/* Orchestration & Observability */}
                <div className="aspect-[660/420] overflow-hidden rounded-2xl bg-fill">
                  <Image
                    src="/work/sensei-orchestration.png"
                    alt="Sensei Agent — Orchestration and Observability: know the current state of every deal"
                    width={2412}
                    height={1623}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>

              {/* Right column — aspect-ratios keep it responsive + equal */}
              <div className="flex flex-col gap-4">
                {/* Elevate Your Game phones */}
                <PhonesTile />

                {/* Deal discovery board */}
                <div className="aspect-[660/440] overflow-hidden rounded-2xl bg-fill-secondary">
                  <Image
                    src="/work/sensei-discovery.png"
                    alt="Sensei Agent — deal discovery board across pipeline stages"
                    width={2412}
                    height={1623}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Meeting notetaker (dev aspect-ratio slider) */}
                <NotetakerTile />
              </div>
            </Link>
          </div>

          {/* Project 2 — Airbase */}
          <div className="pb-16">
            <p className="text-alt text-muted">
              <span className="text-foreground">Airbase</span>, spend management
              platform. Acquired by Paylocity in 2025.
            </p>

            <Link href="/work/airbase" className="block">
              <div
                data-cursor="case-study"
                className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-10"
              >
                <div className="overflow-hidden rounded-none bg-fill-secondary p-4 transition-colors hover:bg-fill-hover md:col-span-4">
                  <Image
                    src="/work/Airbase1.webp"
                    alt="Airbase — Spend via cards, spending by person, and declined transactions dashboards"
                    width={800}
                    height={1400}
                    className="w-full"
                  />
                </div>
                <div className="overflow-hidden rounded-none bg-fill transition-colors hover:bg-fill-hover md:col-span-6">
                  <Image
                    src="/work/Airbase2.webp"
                    alt="Airbase — Ledger entries pending review"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover transition-opacity hover:opacity-80"
                  />
                </div>
              </div>

              <div className="mt-2">
                <div
                  data-cursor="case-study"
                  className="w-full overflow-hidden rounded-none bg-fill px-4 pt-4 pb-0 transition-colors hover:bg-fill-hover"
                >
                  <Image
                    src="/work/Airbase3.webp"
                    alt="Airbase — Reports & Analytics productivity dashboard"
                    width={1536}
                    height={800}
                    className="w-full"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Project 3 — Swadesh */}
          <div className="pb-16">
            <p className="text-alt text-muted">
              Led design and branding at{" "}
              <span className="text-foreground">Swadesh (YC S19)</span>, building
              a cross-border banking solution.
            </p>

            <Link href="/work/swadesh" className="block">
              <div className="mt-4">
                <div
                  data-cursor="case-study"
                  className="w-full overflow-hidden rounded-none bg-fill px-8 py-8 transition-colors hover:bg-fill-hover"
                >
                  <Image
                    src="/work/SwadeshHero.webp"
                    alt="Swadesh — Link account, credit, and cards screens"
                    width={1440}
                    height={800}
                    className="w-full"
                  />
                </div>
              </div>

              <div
                data-cursor="case-study"
                className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2"
              >
                <div className="h-120 overflow-hidden rounded-none bg-fill transition-colors hover:bg-fill-hover">
                  <Image
                    src="/work/SwadeshMock.webp"
                    alt="Swadesh — Phone mockup on green fabric"
                    width={1000}
                    height={1200}
                    className="h-full w-full object-cover transition-opacity hover:opacity-80"
                  />
                </div>
                <div className="h-120 overflow-hidden rounded-none bg-fill-secondary px-4 pt-4 pb-0 transition-colors hover:bg-fill-hover">
                  <Image
                    src="/work/SwadeshMockup.webp"
                    alt="Swadesh — Debit Visa card mockup"
                    width={1024}
                    height={1024}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
