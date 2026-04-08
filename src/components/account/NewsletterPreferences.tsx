'use client';

import { useState } from 'react';

import { trackNewsletterUnsubscribe, useRudderAnalytics } from '@/lib/analytics';
import { useAuth } from '@/lib/auth/context';

export function NewsletterPreferences(): React.JSX.Element | null {
  const analytics = useRudderAnalytics();
  const auth = useAuth();
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [reason, setReason] = useState('');

  if (!auth.user) return null;

  function handleUnsubscribe(): void {
    if (!auth.user) return;
    if (analytics) {
      trackNewsletterUnsubscribe(analytics, {
        email: auth.user.email,
        unsubscribe_location: 'account_settings',
        ...(reason ? { unsubscribe_reason: reason } : {}),
      });
    }
    setUnsubscribed(true);
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-sage/60 bg-white px-8 py-6 shadow-lg shadow-charcoal/5">
      <h3 className="mb-1 text-base font-semibold text-charcoal">Email Preferences</h3>
      <p className="mb-4 text-sm text-charcoal/60">
        Manage your newsletter subscription.
      </p>

      {unsubscribed ? (
        <p className="text-sm text-matcha-dark">
          ✓ You&apos;ve been unsubscribed from our newsletter.
        </p>
      ) : (
        <div className="space-y-3">
          <div>
            <label
              htmlFor="unsubscribe-reason"
              className="mb-1.5 block text-sm font-medium text-charcoal/80"
            >
              Reason (optional)
            </label>
            <select
              id="unsubscribe-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-lg border border-sage bg-steam/40 px-3 py-2 text-sm text-charcoal focus:border-matcha focus:outline-none focus:ring-2 focus:ring-matcha/20"
            >
              <option value="">Select a reason…</option>
              <option value="too_many_emails">Too many emails</option>
              <option value="not_relevant">Content not relevant</option>
              <option value="never_signed_up">Never signed up</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleUnsubscribe}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Unsubscribe from newsletter
          </button>
        </div>
      )}
    </div>
  );
}
