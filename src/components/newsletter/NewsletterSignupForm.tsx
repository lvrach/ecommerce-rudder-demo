'use client';

import { type FormEvent, useState } from 'react';

import { trackNewsletterSignup, useRudderAnalytics } from '@/lib/analytics';

export function NewsletterSignupForm(): React.JSX.Element {
  const analytics = useRudderAnalytics();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (analytics) {
      trackNewsletterSignup(analytics, {
        email,
        signup_location: 'footer',
        signup_method: 'form',
      });
    }
    setSubmitted(true);
    setEmail('');
  }

  if (submitted) {
    return (
      <p className="text-sm text-matcha-dark">
        ✓ You&apos;re subscribed! Thanks for joining.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 rounded-lg border border-sage bg-steam/40 px-3 py-2 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-matcha focus:outline-none focus:ring-2 focus:ring-matcha/20"
      />
      <button
        type="submit"
        className="rounded-lg bg-matcha px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-matcha-dark"
      >
        Subscribe
      </button>
    </form>
  );
}
