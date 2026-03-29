import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";

import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const themeScript = `(function(){try{if(localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}})();`;

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground">
        <header className="fixed top-0 left-0 right-0 z-10 border-b border-dashed border-border mx-12 px-5 py-4 flex items-center justify-between">
          <p className="text-alt text-muted flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0"><g clipPath="url(#clip0_73_30618)"><path fillRule="evenodd" clipRule="evenodd" d="M3.00275 5.0832C3.27351 4.81244 3.7125 4.81244 3.98326 5.0832L6.4099 7.50983C6.68066 7.78059 6.68066 8.21958 6.4099 8.49034L3.98326 10.917C3.7125 11.1877 3.27351 11.1877 3.00275 10.917L0.576117 8.49034C0.305357 8.21958 0.305357 7.78059 0.576117 7.50983L3.00275 5.0832Z" fill="var(--accent)"/><path fillRule="evenodd" clipRule="evenodd" d="M7.50959 0.576605C7.78035 0.305845 8.21934 0.305845 8.4901 0.576605L10.9167 3.00324C11.1875 3.274 11.1875 3.71299 10.9167 3.98375L8.4901 6.41039C8.21934 6.68115 7.78035 6.68115 7.50959 6.41039L5.08295 3.98375C4.81219 3.71299 4.81219 3.274 5.08295 3.00324L7.50959 0.576605Z" fill="var(--accent)"/><path fillRule="evenodd" clipRule="evenodd" d="M12.0164 5.0832C12.2872 4.81244 12.7262 4.81244 12.9969 5.0832L15.4236 7.50983C15.6943 7.78059 15.6943 8.21958 15.4236 8.49034L12.9969 10.917C12.7262 11.1877 12.2872 11.1877 12.0164 10.917L9.58979 8.49034C9.31903 8.21958 9.31903 7.78059 9.58979 7.50983L12.0164 5.0832Z" fill="var(--accent)"/><path fillRule="evenodd" clipRule="evenodd" d="M7.50959 9.58979C7.78035 9.31903 8.21934 9.31903 8.4901 9.58979L10.9167 12.0164C11.1875 12.2872 11.1875 12.7262 10.9167 12.9969L8.4901 15.4236C8.21934 15.6943 7.78035 15.6943 7.50959 15.4236L5.08295 12.9969C4.81219 12.7262 4.81219 12.2872 5.08295 12.0164L7.50959 9.58979Z" fill="var(--accent)"/></g><defs><clipPath id="clip0_73_30618"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>
            <span>HARSH VARDHAN SINGH</span>
          </p>
          <ThemeToggle />
        </header>
        <div className="mx-auto flex w-full max-w-4xl pt-16 px-8 md:h-screen bg-background border border-dashed border-border">
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
