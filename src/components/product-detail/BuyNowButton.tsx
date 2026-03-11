'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/shared/Button';
import type { TeaProduct } from '@/data/schema';
import {
  toProductPayload,
  trackProductAdded,
  useRudderAnalytics,
} from '@/lib/analytics';
import { useAuth } from '@/lib/auth';
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
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleBuyNow = useCallback((): void => {
    if (!isLoggedIn) {
      router.push('/account');
      return;
    }

    addItem(product, quantity);

    if (analytics) {
      trackProductAdded(analytics, {
        ...toProductPayload(product),
        quantity,
      });
    }

    try {
      sessionStorage.setItem('checkout-flow', 'instant');
    } catch {
      // sessionStorage may be unavailable
    }

    router.push('/checkout');
  }, [analytics, addItem, isLoggedIn, product, quantity, router]);

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
