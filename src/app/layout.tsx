import type { Metadata } from "next";
import { Inter, Geist_Mono, Ovo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteFooter } from "@/components/SiteFooter";

import { Header } from "@/components/Header";
import { CustomCursor } from "@/components/CustomCursor";
import { ProjectTheme } from "@/components/ProjectTheme";
import { DitherStage } from "@/components/DitherStage";
import { SiteMenu } from "@/components/SiteMenu";
import "./globals.css";

const themeScript = `(function(){try{document.documentElement.classList.add("dark")}catch(e){}})();`;

const projectThemeScript = `(function(){try{var t={"/work/swadesh":"theme-swadesh","/work/sensei-agent":"theme-sensei-agent","/about":"theme-about","/playground":"theme-playground"}[location.pathname];if(t)document.documentElement.classList.add(t);}catch(e){}})();`;

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

const ovo = Ovo({
  variable: "--font-ovo",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://harshvardhan.work"),
  title: {
    default: "Portfolio — Designer",
    template: "%s — Portfolio",
  },
  description:
    "Designer portfolio showcasing branding, product, and editorial projects.",
  openGraph: {
    title: "Portfolio — Designer",
    description:
      "Designer portfolio showcasing branding, product, and editorial projects.",
    type: "website",
    url: "https://harshvardhan.work",
    siteName: "Harshvardhan Singh",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio — Designer",
    description:
      "Designer portfolio showcasing branding, product, and editorial projects.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${ovo.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: projectThemeScript }} />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground">
        <ProjectTheme />
        <CustomCursor />
        <DitherStage>
          <Header />
          <SiteMenu />
          <main className="min-h-screen w-full flex flex-col bg-background">
            {children}
            <SiteFooter />
          </main>
        </DitherStage>
        <Analytics />
      </body>
    </html>
  );
}
