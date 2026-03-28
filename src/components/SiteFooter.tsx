export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-foreground/10 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} — Designer portfolio
        </p>
        <div className="flex gap-6">
          <a
            href="mailto:hello@example.com"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
          >
            Email
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
