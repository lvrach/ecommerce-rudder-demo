export interface ProductPayload {
  product_id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  variant: string;
  price: number;
  currency: string;
  url: string;
  image_url: string;
}

export interface CartProductPayload extends ProductPayload {
  quantity: number;
  checkout_flow?: string;
}

/**
 * Payload for the "Product Added" event.
 * Extends CartProductPayload with tea_type, which is required for
 * cart analysis segmented by tea variety.
 * Allowed values: 'green' | 'black' | 'herbal' | 'oolong'
 */
export interface ProductAddedPayload extends CartProductPayload {
  tea_type: 'green' | 'black' | 'herbal' | 'oolong';
}

export interface ProductListPayload {
  list_id: string;
  category: string;
  products: ProductPayload[];
}

export interface CartViewedPayload {
  cart_id: string;
  products: CartProductPayload[];
  value: number;
  currency: string;
}

export interface CheckoutStartedPayload {
  order_id: string;
  value: number;
  currency: string;
  products: CartProductPayload[];
  coupon?: string;
  checkout_flow?: string;
}

export interface CheckoutStepPayload {
  checkout_id: string;
  step: number;
  step_name: string;
}

export interface PaymentInfoPayload {
  checkout_id: string;
  order_id: string;
  step: number;
  payment_method: string;
}

export interface OrderCompletedPayload {
  order_id: string;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  currency: string;
  products: CartProductPayload[];
  coupon?: string;
  checkout_flow?: string;
  email?: string;
}

export interface CouponPayload {
  coupon_id: string;
  coupon_name: string;
  discount: number;
  reason?: string;
}

export interface PromotionPayload {
  promotion_id: string;
  name: string;
  creative: string;
  position: string;
}

export interface SearchPayload {
  query: string;
}

export interface IdentifyTraits {
  email: string;
  name: string;
  first_name: string;
  last_name: string;
}

/**
 * Payload for the "newsletter_signup" event.
 * Fired when a user successfully submits a newsletter signup form.
 */
export interface NewsletterSignupPayload {
  /** Email address being subscribed to the newsletter. */
  email: string;
  /** UI location where the signup form was submitted. */
  signup_location: 'footer' | 'popup' | 'checkout' | 'product_page' | 'account_settings';
  /** The mechanism through which the user signed up. Omit when using the standard form. */
  signup_method?: 'form' | 'checkout_opt_in' | 'social';
}

/**
 * Payload for the "newsletter_unsubscribe" event.
 * Fired when a user successfully unsubscribes from the newsletter.
 */
export interface NewsletterUnsubscribePayload {
  /** Email address being unsubscribed from the newsletter. */
  email: string;
  /** Where the unsubscribe action was triggered. */
  unsubscribe_location: 'email_link' | 'account_settings' | 'preference_center';
  /** Optional reason provided by the user for unsubscribing. Omit when no reason was selected. */
  unsubscribe_reason?: string;
}
