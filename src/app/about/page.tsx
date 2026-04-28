import type { Metadata } from "next";
import { AboutBody } from "@/components/AboutBody";

export const metadata: Metadata = {
  title: "About",
  description: "About Harsh Vardhan Singh — product designer and builder.",
};

export default function AboutPage() {
  return <AboutBody />;
}
