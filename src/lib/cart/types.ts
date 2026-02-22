import type { CartItem, Coupon } from '@/data/schema';

export interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { product_id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { product_id: string; quantity: number } }
  | { type: 'APPLY_COUPON'; payload: Coupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR_CART' };
