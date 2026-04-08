'use client';

import { LoginForm } from '@/components/account/LoginForm';
import { NewsletterPreferences } from '@/components/account/NewsletterPreferences';
import { usePageTracking } from '@/lib/analytics';

export default function AccountPage(): React.JSX.Element {
  usePageTracking('Account');

  return (
    <section className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center gap-6 px-4 py-12">
      <LoginForm />
      <NewsletterPreferences />
    </section>
  );
}
