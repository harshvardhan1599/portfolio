export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-foreground/10 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-sm text-muted">
          Designed + Built by Harsh and Claude.
        </p>
        <a
          href="mailto:harshvardhan1599@gmail.com"
          className="font-mono text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
        >
          Contact me
        </a>
      </div>
    </footer>
  );
}
