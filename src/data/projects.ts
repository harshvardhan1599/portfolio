export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  /** Path under `public/`, e.g. `/work/example/cover.jpg` */
  coverImage?: string;
  featured?: boolean;
  /** Short case-study body; replace with MDX later if you like */
  body: string[];
};

export const projects: Project[] = [
  {
    slug: "brand-refresh-studio",
    title: "Studio brand refresh",
    summary:
      "Visual identity, typography, and web art direction for an independent creative studio.",
    tags: ["Branding", "Web", "Typography"],
    featured: true,
    body: [
      "Led a full visual refresh anchored in a warm, editorial palette and a custom type pairing that scales from social to large-format print.",
      "Delivered component guidelines and page templates so the in-house team could ship consistent marketing pages without design bottlenecks.",
    ],
  },
  {
    slug: "product-onboarding",
    title: "Product onboarding experience",
    summary:
      "End-to-end UX and UI for a SaaS onboarding flow focused on clarity and time-to-value.",
    tags: ["Product design", "UX", "UI"],
    featured: true,
    body: [
      "Mapped the jobs-to-be-done for new teams and reduced steps in the critical path while preserving trust and compliance checkpoints.",
      "Shipped a flexible layout system and illustration style that stayed lightweight in engineering scope but felt bespoke in the product.",
    ],
  },
  {
    slug: "editorial-lookbook",
    title: "Editorial lookbook",
    summary:
      "Digital lookbook and motion studies for a seasonal fashion drop.",
    tags: ["Editorial", "Motion", "Art direction"],
    featured: false,
    body: [
      "Art-directed photography and grid systems that let product imagery breathe while keeping commerce paths obvious.",
      "Explored scroll-linked motion that reinforced the collection narrative without hurting performance on mobile.",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
