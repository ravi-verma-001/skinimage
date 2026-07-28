'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  url: string;
  isCurrent: boolean;
}

interface BreadcrumbsProps {
  /**
   * Custom label overrides for dynamic route segments (e.g., { 'p1': 'Oil Cleanser' })
   */
  customLabels?: Record<string, string>;
  /**
   * Hide breadcrumbs on specific paths
   */
  hideOnPaths?: string[];
}

// Map of standard path segments to user-friendly titles
const STANDARD_SEGMENT_MAP: Record<string, string> = {
  shop: 'Shop',
  blog: 'Journal',
  'our-story': 'About Us',
  contact: 'Contact',
  faq: 'FAQ',
  'privacy-policy': 'Privacy Policy',
  'shipping-policy': 'Shipping Policy',
  'refund-policy': 'Refund Policy',
  login: 'Login',
  register: 'Register',
  dashboard: 'Dashboard',
  cart: 'Shopping Cart',
  checkout: 'Checkout',
  verify: 'Payment Verification',
};

export function Breadcrumbs({ customLabels = {}, hideOnPaths = ['/'] }: BreadcrumbsProps) {
  const pathname = usePathname();

  // If current route is in hideOnPaths (e.g., Homepage), render nothing
  if (hideOnPaths.includes(pathname)) {
    return null;
  }

  // Generate breadcrumb list dynamically from URL pathname
  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    const paths = pathname.split('/').filter((p) => p !== '');
    
    // Check if we are on a dynamic product page: /product/[id]
    // We want to transform the breadcrumb list to: Home -> Shop -> Product Name
    const isProductPage = paths[0] === 'product' && paths.length >= 2;
    // Check if we are on a dynamic blog page: /blog/[slug]
    // We want to transform the breadcrumb list to: Home -> Journal (blog) -> Blog Title
    const isBlogDetailPage = paths[0] === 'blog' && paths.length >= 2;

    if (isProductPage) {
      const productId = paths[1];
      const productName = customLabels[productId] || productId;
      return [
        { label: 'Shop', url: '/shop', isCurrent: false },
        { label: productName, url: `/product/${productId}`, isCurrent: true },
      ];
    }

    if (isBlogDetailPage) {
      const blogSlug = paths[1];
      const blogTitle = customLabels[blogSlug] || blogSlug.replace(/-/g, ' ');
      return [
        { label: 'Journal', url: '/blog', isCurrent: false },
        { label: blogTitle, url: `/blog/${blogSlug}`, isCurrent: true },
      ];
    }

    // Default dynamic breadcrumbs generation
    return paths.map((segment, index) => {
      const url = `/${paths.slice(0, index + 1).join('/')}`;
      const isCurrent = index === paths.length - 1;
      
      // Resolve label: custom label -> standard mapping -> capitalize slug segment
      let label = customLabels[segment] || STANDARD_SEGMENT_MAP[segment];
      if (!label) {
        label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      }

      return {
        label,
        url,
        isCurrent,
      };
    });
  }, [pathname, customLabels]);

  const websiteUrl = 'https://skinimage.in';

  // Generate JSON-LD BreadcrumbList Schema dynamically
  const jsonLdSchema = useMemo(() => {
    const itemListElement = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: websiteUrl,
      },
      ...breadcrumbItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: `${websiteUrl}${item.url}`,
      })),
    ];

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    };
  }, [breadcrumbItems]);

  return (
    <>
      {/* JSON-LD Schema Injector */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Visual Breadcrumbs Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 bg-transparent text-xs"
      >
        <ol className="flex items-center space-x-2 text-stone-500 font-medium overflow-x-auto whitespace-nowrap">
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-emerald-800 transition-colors duration-200"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only">Home</span>
            </Link>
          </li>

          {breadcrumbItems.map((item, index) => (
            <li key={item.url} className="flex items-center">
              <ChevronRight className="h-3.5 w-3.5 text-stone-400 mx-1 flex-shrink-0" />
              {item.isCurrent ? (
                <span
                  aria-current="page"
                  className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-xs"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-emerald-800 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
