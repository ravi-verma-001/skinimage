import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';
import { rateLimit } from '@/utils/rateLimit';

const FB_PIXEL_ID = process.env.FB_PIXEL_ID;
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

// Validation Schema using Zod
const fbConversionSchema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  eventId: z.string().optional(),
  userData: z.object({
    email: z.string().email('Invalid email format').optional().or(z.literal('')),
    phone: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    clientUserAgent: z.string().optional(),
    clientIpAddress: z.string().optional(),
  }).optional(),
  customData: z.object({
    value: z.number().optional(),
    contentIds: z.array(z.union([z.string(), z.number()])).optional(),
    contentType: z.string().optional(),
    contentName: z.string().optional(),
    orderId: z.string().optional(),
  }).optional(),
  sourceUrl: z.string().optional().or(z.literal('')),
});

// Helper to hash user data using SHA-256 as required by Meta
function sha256(data: string): string {
  if (!data) return '';
  return crypto
    .createHash('sha256')
    .update(data.trim().toLowerCase())
    .digest('hex');
}

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin');
    const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
    if (origin && origin !== allowedOrigin) {
      return NextResponse.json({ success: false, error: 'CORS policy violation' }, { status: 403 });
    }

    // 1. Rate Limiting Check
    const clientIp = 
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
      req.headers.get('x-real-ip') || 
      '127.0.0.1';
    
    // Allow up to 30 requests per minute per IP for Conversions API events
    const rateLimitRes = rateLimit(clientIp, 30, 60000);
    if (!rateLimitRes.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitRes.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '30',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitRes.resetTime.toString()
          }
        }
      );
    }

    if (!FB_PIXEL_ID || !FB_ACCESS_TOKEN) {
      console.warn('Meta CAPI: FB_PIXEL_ID or FB_ACCESS_TOKEN environment variables are missing.');
      return NextResponse.json({ success: false, error: 'Meta integration not configured' }, { status: 500 });
    }

    // 2. Parse and Validate Request Body
    const jsonBody = await req.json();
    const validationResult = fbConversionSchema.safeParse(jsonBody);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: validationResult.error.issues.map(err => `${err.path.join('.')}: ${err.message}`)
      }, { status: 400 });
    }

    const { eventName, eventId, userData = {}, customData = {}, sourceUrl } = validationResult.data;

    // Client user agent and IP address are highly recommended for CAPI matching
    const headers = req.headers;
    const clientUserAgent = headers.get('user-agent') || userData.clientUserAgent || '';
    
    // Get client IP address
    const clientIpAddress = 
      headers.get('x-forwarded-for')?.split(',')[0].trim() || 
      headers.get('x-real-ip') || 
      userData.clientIpAddress || 
      clientIp;

    // Hash user details for privacy and matching compliance
    const hashedUserData: any = {
      client_ip_address: clientIpAddress,
      client_user_agent: clientUserAgent,
    };

    if (userData.email) {
      hashedUserData.em = [sha256(userData.email)];
    }
    if (userData.phone) {
      // Normalize phone number (digits only, including country code if possible)
      const cleanPhone = userData.phone.replace(/\D/g, '');
      hashedUserData.ph = [sha256(cleanPhone)];
    }
    if (userData.firstName) {
      hashedUserData.fn = [sha256(userData.firstName)];
    }
    if (userData.lastName) {
      hashedUserData.ln = [sha256(userData.lastName)];
    }

    const eventPayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId || undefined,
      event_source_url: sourceUrl || headers.get('referer') || '',
      action_source: 'website',
      user_data: hashedUserData,
      custom_data: {
        currency: 'INR', // INR hardcoded as required
        value: customData.value || undefined,
        content_ids: customData.contentIds || undefined,
        content_type: customData.contentType || 'product',
        content_name: customData.contentName || undefined,
        order_id: customData.orderId || undefined,
      },
    };

    const response = await fetch(`https://graph.facebook.com/v19.0/${FB_PIXEL_ID}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [eventPayload],
        access_token: FB_ACCESS_TOKEN,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta Graph API Error:', result);
      return NextResponse.json({ success: false, error: result.error?.message || 'Graph API call failed' }, { status: response.status });
    }

    // Set rate limit and CORS headers in the response
    const res = NextResponse.json({ success: true, result });
    res.headers.set('X-RateLimit-Limit', '30');
    res.headers.set('X-RateLimit-Remaining', (30 - rateLimitRes.count).toString());
    res.headers.set('X-RateLimit-Reset', rateLimitRes.resetTime.toString());
    res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    return res;
  } catch (error: any) {
    console.error('CAPI Server Route Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin');
  const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
  
  if (origin && origin !== allowedOrigin) {
    return new Response(null, { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
