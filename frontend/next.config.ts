import type { NextConfig } from "next";

// Production CSP (enforces upgrade-insecure-requests on production servers)
const cspHeaderProd = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://accounts.google.com;
  style-src 'self' 'unsafe-inline' https://accounts.google.com;
  img-src 'self' blob: data: https://res.cloudinary.com https://images.unsplash.com https://www.google-analytics.com https://www.googletagmanager.com;
  media-src 'self' https://res.cloudinary.com;
  connect-src 'self' https://skinimage.onrender.com https://www.google-analytics.com https://stats.g.doubleclick.net https://accounts.google.com;
  frame-src 'self' https://accounts.google.com;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

// Development CSP (omits upgrade-insecure-requests so local HTTP development on port 3000 doesn't crash)
const cspHeaderDev = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://accounts.google.com;
  style-src 'self' 'unsafe-inline' https://accounts.google.com;
  img-src 'self' blob: data: https://res.cloudinary.com https://images.unsplash.com https://www.google-analytics.com https://www.googletagmanager.com;
  media-src 'self' https://res.cloudinary.com;
  connect-src 'self' https://skinimage.onrender.com https://www.google-analytics.com https://stats.g.doubleclick.net https://accounts.google.com http://localhost:* ws://localhost:* wss://localhost:*;
  frame-src 'self' https://accounts.google.com;
  font-src 'self' data:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`.replace(/\s{2,}/g, ' ').trim();

const securityHeadersDev = [
  {
    key: 'Content-Security-Policy',
    value: cspHeaderDev,
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
          headers: securityHeadersDev,
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
    ],
  },
};

export default nextConfig;
