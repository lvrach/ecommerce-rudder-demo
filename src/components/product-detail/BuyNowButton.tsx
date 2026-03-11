'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/shared/Button';
import type { TeaProduct } from '@/data/schema';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';
import {
  toProductPayload,
  trackBuyNowClicked,
  useRudderAnalytics,
} from '@/lib/analytics';

interface BuyNowButtonProps {
  product: TeaProduct;
  quantity: number;
}

export function BuyNowButton({
  product,
  quantity,
}: BuyNowButtonProps): React.JSX.Element {
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const analytics = useRudderAnalytics();

  const handleBuyNow = useCallback((): void => {
    if (!isLoggedIn) {
      router.push('/account');
      return;
    }

    if (analytics) {
      trackBuyNowClicked(analytics, {
        ...toProductPayload(product),
        quantity,
      });
    }

    addItem(product, quantity);
    router.push('/checkout?flow=instant');
  }, [addItem, analytics, isLoggedIn, product, quantity, router]);

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
