const tracker = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitResult {
  success: boolean;
  count: number;
  limit: number;
  resetTime: number;
}

/**
 * Basic in-memory rate limiter for Next.js API routes.
 * 
 * @param ip Client IP address
 * @param limit Max number of requests allowed in the window
 * @param windowMs Time window in milliseconds (default: 1 minute)
 */
export function rateLimit(ip: string, limit: number = 60, windowMs: number = 60000): RateLimitResult {
  const now = Date.now();
  const tracking = tracker.get(ip);

  // Clean up old entries occasionally to prevent memory leak
  if (tracker.size > 1000) {
    for (const [key, value] of tracker.entries()) {
      if (now > value.resetTime) {
        tracker.delete(key);
      }
    }
  }

  if (!tracking) {
    const entry = { count: 1, resetTime: now + windowMs };
    tracker.set(ip, entry);
    return { success: true, count: 1, limit, resetTime: entry.resetTime };
  }

  if (now > tracking.resetTime) {
    tracking.count = 1;
    tracking.resetTime = now + windowMs;
    return { success: true, count: 1, limit, resetTime: tracking.resetTime };
  }

  tracking.count += 1;
  if (tracking.count > limit) {
    return { success: false, count: tracking.count, limit, resetTime: tracking.resetTime };
  }

  return { success: true, count: tracking.count, limit, resetTime: tracking.resetTime };
}
