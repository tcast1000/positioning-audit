export default function Footer() {
  return (
    <footer className="pt-8 border-t border-border">
      <p className="text-xs text-muted">
        Built by{" "}
        <a
          href="https://teddycastro.me"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          Teddy Castro
        </a>
        . Powered by Claude and April Dunford&apos;s positioning framework.
      </p>
    </footer>
  );
}
