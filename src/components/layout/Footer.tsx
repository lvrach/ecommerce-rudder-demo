import { NewsletterSignupForm } from '@/components/newsletter/NewsletterSignupForm';

export function Footer(): React.JSX.Element {
  return (
    <footer className="bg-steam py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 rounded-xl border border-sage/60 bg-white px-6 py-5 shadow-sm">
          <h3 className="mb-1 text-sm font-semibold text-charcoal">
            Join the Tea Leafs Newsletter
          </h3>
          <p className="mb-3 text-xs text-charcoal/60">
            New arrivals, brewing guides, and seasonal picks &mdash; straight to your inbox.
          </p>
          <NewsletterSignupForm />
        </div>
        <div className="text-center">
          <p className="text-sm text-charcoal/60">
            &copy; 2024 Tea Leafs. Handcrafted teas from around the world.
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
            {' · '}
            <a
              href="https://github.com/lvrach/ecommerce-rudder-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-matcha"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
