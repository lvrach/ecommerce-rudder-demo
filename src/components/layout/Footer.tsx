export function Footer(): React.JSX.Element {
  return (
    <footer className="bg-steam py-8">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-sm text-charcoal/60">
          &copy; 2024 Serene Leaf. Handcrafted teas from around the world.
        </p>
        <p className="mt-2 text-xs text-charcoal/40">
          Powered by{' '}
          <a
            href="https://www.rudderstack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition-colors hover:text-matcha"
          >
            RudderStack
          </a>
        </p>
      </div>
    </footer>
  );
}
