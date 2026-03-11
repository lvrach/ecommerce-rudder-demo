'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/shared/Button';
import type { TeaProduct } from '@/data/schema';
import {
  toProductPayload,
  trackProductAdded,
  trackInstantCheckoutInitiated,
  useRudderAnalytics,
} from '@/lib/analytics';
import { useCart } from '@/lib/cart';

interface BuyNowButtonProps {
  product: TeaProduct;
  quantity: number;
}

export function BuyNowButton({
  product,
  quantity,
}: BuyNowButtonProps): React.JSX.Element {
  const analytics = useRudderAnalytics();
  const { addItem } = useCart();
  const router = useRouter();

  const handleBuyNow = useCallback((): void => {
    addItem(product, quantity);

    if (analytics) {
      const productPayload = { ...toProductPayload(product), quantity };
      trackProductAdded(analytics, productPayload);
      trackInstantCheckoutInitiated(analytics, productPayload);
    }

    router.push('/checkout');
  }, [analytics, addItem, product, quantity, router]);

  return (
    <Button
      variant="secondary"
      size="lg"
      disabled={!product.in_stock}
      onClick={handleBuyNow}
      className="flex-1"
    >
      Buy Now
    </Button>
  );
}
