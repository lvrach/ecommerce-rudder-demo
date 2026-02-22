'use client';

import { useCallback, useState } from 'react';

import { Button } from '@/components/shared/Button';
import { QuantitySelector } from '@/components/shared/QuantitySelector';
import type { TeaProduct } from '@/data/schema';
import {
  toProductPayload,
  trackProductAdded,
  useRudderAnalytics,
} from '@/lib/analytics';
import { useCart } from '@/lib/cart';

interface AddToCartButtonProps {
  product: TeaProduct;
}

export function AddToCartButton({
  product,
}: AddToCartButtonProps): React.JSX.Element {
  const analytics = useRudderAnalytics();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleAddToCart = useCallback((): void => {
    addItem(product, quantity);

    if (analytics) {
      trackProductAdded(analytics, {
        ...toProductPayload(product),
        quantity,
      });
    }

    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  }, [analytics, product, quantity, addItem]);

  return (
    <div className="flex items-center gap-4">
      <QuantitySelector quantity={quantity} onChange={setQuantity} />
      <Button
        variant="primary"
        size="lg"
        disabled={!product.in_stock}
        onClick={handleAddToCart}
        className="flex-1"
      >
        {showConfirmation ? 'Added!' : 'Add to Cart'}
      </Button>
    </div>
  );
}
