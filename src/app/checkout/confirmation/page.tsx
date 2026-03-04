'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  trackOrderCompleted,
  usePageTracking,
  useRudderAnalytics,
} from '@/lib/analytics';
import type { CartProductPayload } from '@/lib/analytics';
import { clearOrder, loadOrder } from '@/lib/order-storage';
import { OrderSuccess } from '@/components/confirmation/OrderSuccess';

// Re-export the type so existing imports from this module keep working
export type { CartProductPayload as StoredProduct };

function ConfirmationContent(): React.JSX.Element {
  usePageTracking('Order Confirmation');

  const searchParams = useSearchParams();
  const analytics = useRudderAnalytics();
  const orderTrackedRef = useRef(false);

  const orderId = searchParams.get('orderId') ?? 'unknown';
  const totalParam = searchParams.get('total') ?? '';

  const parsedTotal = parseFloat(totalParam.replace(/[^0-9.]/g, ''));
  const displayTotal = Number.isNaN(parsedTotal) ? 0 : parsedTotal;

  useEffect(() => {
    if (!analytics || orderTrackedRef.current) return;
    orderTrackedRef.current = true;

    // loadOrder checks sessionStorage first, then falls back to the cookie
    // written by checkout/page.tsx. This means the event fires correctly even
    // if the user refreshes after sessionStorage was cleared on the first load.
    const storedOrder = loadOrder(orderId);

    if (storedOrder) {
      trackOrderCompleted(analytics, {
        order_id: storedOrder.orderId,
        total: storedOrder.total,
        subtotal: storedOrder.subtotal,
        discount: storedOrder.discount,
        shipping: storedOrder.shipping,
        tax: storedOrder.tax,
        currency: storedOrder.currency,
        products: storedOrder.products,
        coupon: storedOrder.coupon,
      });

      // Clear both storage locations now that the event has fired.
      clearOrder();
    } else {
      // Neither sessionStorage nor cookie had order data.
      // This can happen if the user navigates directly to this URL or arrives
      // from a different device/session. Skip the event — corrupted data
      // (e.g. products:[]) would break revenue and product attribution.
      console.warn(
        '[Analytics] Order Completed skipped: no order data found for orderId',
        orderId,
        '— user may have navigated directly to the confirmation URL.',
      );
    }
  }, [analytics, orderId]);

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
          <div className="text-charcoal/50">Loading order details...</div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
