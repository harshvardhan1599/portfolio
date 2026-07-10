import Image from "next/image";
import Link from "next/link";
import { Greeting } from "@/components/Greeting";
import { HeroAside } from "@/components/HeroAside";
import { DitherSlot } from "@/components/DitherSlot";
import { DisplayTile } from "@/components/DisplayTile";
import { PhonesTile } from "@/components/PhonesTile";
import { NotetakerTile } from "@/components/NotetakerTile";
import { PaddedTile } from "@/components/PaddedTile";

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
              <h1 className="text-hero mt-6 text-3xl text-foreground sm:text-4xl md:mt-16 lg:text-5xl">
                Harsh Vardhan Singh,
                <br />
                Product Designer
              </h1>
            </div>

            {/* Right: menu (top), then secondary text (bottom) */}
            <HeroAside />
          </div>
        </div>

        {/* Dither divider: the shared dither canvas docks into this slot
            (owned by DitherStage; travels between pages on navigation). */}
        <DitherSlot />

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
                    <blockquote className="text-lg leading-[135%] text-foreground md:text-xl">
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

          {/* Project 2 — Airbase (50/50 two-column) */}
          <div className="pb-16 [content-visibility:auto] [contain-intrinsic-size:auto_1400px]">
            <p className="text-alt text-muted">
              <span className="text-foreground">Airbase</span>, spend management
              platform. Acquired by Paylocity in 2025.
            </p>

            <Link
              href="/work/airbase"
              data-cursor="case-study"
              className="mt-4 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2"
            >
              {/* Left column — two large tiles (drive the height) */}
              <div className="flex flex-col gap-4">
                {/* Airbase dashboard */}
                <div className="aspect-[660/520] overflow-hidden rounded-2xl bg-fill transition-colors hover:bg-fill-hover">
                  <Image
                    src="/work/airbase-dashboard.png"
                    alt="Airbase — Analyze Spend dashboard"
                    width={2412}
                    height={1770}
                    className="h-full w-full object-cover object-left-top"
                  />
                </div>
                {/* Airbase ledger / productivity */}
                <div className="aspect-[660/520] overflow-hidden rounded-2xl bg-fill transition-colors hover:bg-fill-hover">
                  <Image
                    src="/work/airbase-ledger.png"
                    alt="Airbase — Productivity reports dashboard on Studio Display"
                    width={2412}
                    height={1911}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              </div>

              {/* Right column — two tiles + testimonial (flexes to match) */}
              <div className="flex flex-col gap-4">
                {/* Spend via cards + spending by person (one tall image) */}
                <div className="aspect-[2412/2358] overflow-hidden rounded-2xl bg-fill transition-colors hover:bg-fill-hover">
                  <Image
                    src="/work/airbase-spend.png"
                    alt="Airbase — spend via cards and spending by person"
                    width={2412}
                    height={2358}
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                {/* Testimonial */}
                <figure className="flex min-h-[240px] flex-1 items-center justify-center rounded-2xl bg-fill-secondary p-8 transition-colors hover:bg-fill-hover">
                  <div className="flex w-full flex-col gap-8 rounded-xl border border-[#E4E4E4] bg-white p-8">
                    <blockquote className="text-lg leading-[135%] text-foreground md:text-xl">
                      Harsh&rsquo;s efforts have paved the way for more innovation
                      and user-friendly experiences for our users, improving their
                      day-to-day workflows significantly.
                    </blockquote>
                    <figcaption className="flex items-center gap-3">
                      <Image
                        src="/work/daru-sim.png"
                        alt="Daru Sim"
                        width={80}
                        height={80}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                      <span className="text-alt-sm text-muted">
                        Daru Sim, Principal Product Designer
                      </span>
                    </figcaption>
                  </div>
                </figure>
              </div>
            </Link>
          </div>

          {/* Project 3 — Swadesh (50/50 two-column) */}
          <div className="pb-16 [content-visibility:auto] [contain-intrinsic-size:auto_1400px]">
            <p className="text-alt text-muted">
              Led design and branding at{" "}
              <span className="text-foreground">Swadesh (YC S19)</span>, building
              a cross-border banking solution.
            </p>

            <Link
              href="/work/swadesh"
              data-cursor="case-study"
              className="mt-4 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2"
            >
              {/* Left column */}
              <div className="flex flex-col gap-4">
                {/* App screens */}
                <PaddedTile
                  src="/work/SwadeshHero.webp"
                  alt="Swadesh — link account, credit, and cards screens"
                  width={1440}
                  height={800}
                  aspect="660 / 440"
                  padding={32}
                />
                {/* What's next — credit & rewards (dev padding slider) */}
                <PaddedTile
                  src="/work/swadesh-project-2.png"
                  alt="Swadesh — no-interest credit card and brand rewards"
                  width={3162}
                  height={1974}
                  aspect="660 / 440"
                  cover
                />
                {/* Globalpay transfer status */}
                <div className="aspect-[660/400] overflow-hidden rounded-2xl bg-fill-secondary transition-colors hover:bg-fill-hover">
                  <Image
                    src="/work/swadesh-project-3.png"
                    alt="Swadesh — Globalpay transfer status"
                    width={3162}
                    height={1974}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-4">
                {/* Testimonial (top) */}
                <figure className="flex min-h-[240px] items-center justify-center rounded-2xl bg-fill-secondary p-8 transition-colors hover:bg-fill-hover">
                  <div className="flex w-full flex-col gap-8 rounded-xl border border-[#E4E4E4] bg-white p-8">
                    <blockquote className="text-lg leading-[135%] text-foreground md:text-xl">
                      What sets Harsh apart is that he thinks like a product
                      owner, not just a designer. He deeply understands users,
                      challenges assumptions, and has a strong instinct for good
                      design.
                    </blockquote>
                    <figcaption className="flex items-center gap-3">
                      <Image
                        src="/work/prateek-swain.png"
                        alt="Prateek Swain"
                        width={80}
                        height={80}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                      />
                      <span className="text-alt-sm text-muted">
                        Prateek Swain, CEO
                      </span>
                    </figcaption>
                  </div>
                </figure>
                {/* Brand color palette */}
                <PaddedTile
                  src="/work/swadesh-project-4.png"
                  alt="Swadesh — brand color palette"
                  width={3162}
                  height={1974}
                  aspect="660 / 300"
                  cover
                />
                {/* Green debit card in hand — fills to balance; gradient
                    darkens on hover. scale-[1.03] crops the baked edge lines. */}
                <div className="card-gradient min-h-[420px] flex-1 overflow-hidden rounded-2xl">
                  <Image
                    src="/work/swadesh-project-6.png"
                    alt="Swadesh — green debit Visa card held in hand"
                    width={3162}
                    height={1974}
                    className="relative z-10 h-full w-full scale-[1.03] object-cover object-bottom"
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
