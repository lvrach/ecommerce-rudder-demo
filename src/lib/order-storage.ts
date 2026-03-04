import type { CartProductPayload } from '@/lib/analytics';

const SESSION_KEY = 'serene-leaf-last-order';
const COOKIE_NAME = 'serene-leaf-order';
const COOKIE_MAX_AGE = 3600; // 1 hour

export interface StoredOrderData {
  orderId: string;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  currency: string;
  coupon?: string;
  products: CartProductPayload[];
}

/**
 * Persist order data in two places so it survives a confirmation-page refresh:
 *  1. sessionStorage — fastest read, same-tab only
 *  2. Cookie        — survives tab restore, browser crash, and page refresh
 *                     after sessionStorage has been cleared on first load
 */
export function saveOrder(data: StoredOrderData): void {
  const serialized = JSON.stringify(data);

  // 1. sessionStorage
  try {
    sessionStorage.setItem(SESSION_KEY, serialized);
  } catch {
    // Private mode / quota exceeded — non-fatal, cookie is the real fallback
  }

  // 2. Cookie (path=/ so it's readable from /checkout/confirmation)
  try {
    const encoded = encodeURIComponent(serialized);
    document.cookie = [
      `${COOKIE_NAME}=${encoded}`,
      'path=/',
      `max-age=${COOKIE_MAX_AGE}`,
      'SameSite=Strict',
    ].join('; ');
  } catch {
    // document.cookie unavailable — non-fatal
  }
}

/**
 * Read order data for a given orderId.
 * Tries sessionStorage first, then cookie.
 * Returns null if neither source has matching data.
 */
export function loadOrder(orderId: string): StoredOrderData | null {
  // 1. Try sessionStorage
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const data = JSON.parse(raw) as StoredOrderData;
      if (data.orderId === orderId) return data;
    }
  } catch {
    // Unavailable or malformed
  }

  // 2. Fall back to cookie
  try {
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`),
    );
    if (match?.[1]) {
      const data = JSON.parse(decodeURIComponent(match[1])) as StoredOrderData;
      if (data.orderId === orderId) return data;
    }
  } catch {
    // Unavailable or malformed
  }

  return null;
}

/**
 * Delete order data from both storage locations.
 * Call this after the Order Completed event has been fired.
 */
export function clearOrder(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Non-fatal
  }

  try {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
  } catch {
    // Non-fatal
  }
}
