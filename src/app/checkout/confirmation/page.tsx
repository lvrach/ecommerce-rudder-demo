'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { usePageTracking } from '@/lib/analytics';
import { OrderSuccess } from '@/components/confirmation/OrderSuccess';

function ConfirmationContent(): React.JSX.Element {
  usePageTracking('Order Confirmation');

  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId') ?? 'unknown';
  const totalParam = searchParams.get('total') ?? '';
  const parsedTotal = parseFloat(totalParam.replace(/[^0-9.]/g, ''));
  const displayTotal = Number.isNaN(parsedTotal) ? 0 : parsedTotal;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <OrderSuccess orderId={orderId} total={displayTotal} />
    </div>
  );
}

export default function ConfirmationPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-charcoal/60">Loading order details...</div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
