import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://res.cloudinary.com https://images.unsplash.com https://www.facebook.com https://connect.facebook.net;
  media-src 'self' https://res.cloudinary.com;
  connect-src 'self' https://connect.facebook.net https://www.facebook.com http://localhost:* ws://localhost:* wss://localhost:*;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspHeader,
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
];

const nextConfig: NextConfig = {
  // Use headers in development; use static export in production to avoid Next.js build errors
  ...(process.env.NODE_ENV === 'development' ? {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: securityHeaders,
        },
      ];
    }
  } : {
    output: 'export' as const,
  }),
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'connect.facebook.net',
      },
      {
        protocol: 'https',
        hostname: 'www.facebook.com',
      },
    ],
  },
};

export default nextConfig;
