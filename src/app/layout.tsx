import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";

import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio — Designer",
    template: "%s — Portfolio",
  },
  description:
    "Designer portfolio showcasing branding, product, and editorial projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <div className="mx-auto flex w-full max-w-4xl pt-16 px-12 md:h-screen bg-background border border-[#EAEAEA]">
          <Sidebar />
          <main className="flex-1 flex flex-col md:overflow-y-auto hide-scrollbar">
            {children}
            <SiteFooter />
          </main>
        </div>
      </body>
    </html>
  );
}
