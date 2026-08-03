export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || 'YOUR_PIXEL_ID_HERE';

// Global declaration for fbq function on window
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

/**
 * Log PageView event.
 */
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Send event to Meta Conversions API (CAPI) server-side route.
 */
export const sendToCAPI = async (
  eventName: string,
  eventId?: string,
  userData: { email?: string; phone?: string; firstName?: string; lastName?: string } = {},
  customData: { value?: number; contentIds?: string[]; contentName?: string; contentType?: string; orderId?: string } = {}
) => {
  try {
    // Attempt to pull user info from localStorage if not explicitly passed
    let userDetails = { ...userData };
    if (typeof window !== 'undefined' && (!userDetails.email || !userDetails.phone)) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          userDetails.email = userDetails.email || parsed.email;
          userDetails.phone = userDetails.phone || parsed.phone;
          if (parsed.name) {
            const parts = parsed.name.split(' ');
            userDetails.firstName = userDetails.firstName || parts[0];
            userDetails.lastName = userDetails.lastName || parts.slice(1).join(' ');
          }
        } catch (_) {}
      }
    }

    fetch('/api/fb-conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventId,
        userData: userDetails,
        customData,
        sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
      }),
    });
  } catch (err) {
    console.warn('CAPI dispatch failed:', err);
  }
};

/**
 * Log custom or standard Meta Pixel events (fires both client and server-side).
 * @param name Event name (e.g., 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase')
 * @param options Event options (value, currency, content_name, content_ids, etc.)
 * @param eventId Optional event ID for server-side deduplication (CAPI)
 * @param userData Optional user details for matching enhancement
 */
export const event = (
  name: string,
  options: any = {},
  eventId?: string,
  userData?: any
) => {
  // 1. Client-Side tracking (Pixel)
  if (typeof window !== 'undefined' && window.fbq) {
    if (eventId) {
      window.fbq('track', name, options, { eventID: eventId });
    } else {
      window.fbq('track', name, options);
    }
  }

  // 2. Server-Side tracking (CAPI)
  const capiCustomData = {
    value: options.value,
    contentIds: options.content_ids,
    contentName: options.content_name,
    contentType: options.content_type,
    orderId: options.order_id,
  };
  sendToCAPI(name, eventId, userData, capiCustomData);
};

// Reusable standard event helpers:

/**
 * Track ViewContent when a user views a product detail page.
 */
export const trackViewContent = (product: { id: string; name: string; price: number }, eventId?: string) => {
  event('ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'INR'
  }, eventId);
};

/**
 * Track AddToCart when a user clicks the Add to Cart button.
 */
export const trackAddToCart = (product: { id: string; name: string; price: number; quantity?: number }, eventId?: string) => {
  event('AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price * (product.quantity || 1),
    currency: 'INR'
  }, eventId);
};

/**
 * Track InitiateCheckout when a user starts checking out.
 */
export const trackInitiateCheckout = (cartItems: { id: string; price: number; quantity: number }[], totalValue: number, eventId?: string) => {
  event('InitiateCheckout', {
    content_ids: cartItems.map(item => item.id),
    content_type: 'product',
    value: totalValue,
    currency: 'INR',
    num_items: cartItems.reduce((acc, item) => acc + item.quantity, 0)
  }, eventId);
};

/**
 * Track Purchase when the order is successfully completed.
 */
export const trackPurchase = (
  order: { id: string; total: number; items: { id: string }[]; email?: string; phone?: string; name?: string },
  eventId?: string
) => {
  const userDetails: any = {};
  if (order.email) userDetails.email = order.email;
  if (order.phone) userDetails.phone = order.phone;
  if (order.name) {
    const parts = order.name.split(' ');
    userDetails.firstName = parts[0];
    userDetails.lastName = parts.slice(1).join(' ');
  }

  event('Purchase', {
    content_ids: order.items.map(item => item.id),
    content_type: 'product',
    value: order.total,
    currency: 'INR',
    order_id: order.id
  }, eventId || order.id, userDetails);
};
