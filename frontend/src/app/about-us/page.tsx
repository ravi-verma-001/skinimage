import React from 'react';
import type { Metadata } from 'next';
import AboutUsClient from './AboutUsClient';

export const metadata: Metadata = {
  title: "About Us | Skinimage – A Dermatologist-Recommended Skincare Brand in India",
  description: "Discover Skinimage, a dermatologist-recommended skincare brand in India built on clinical science and clean actives. Learn our story, philosophy, and promise.",
  keywords: ["dermatologist recommended skincare brand", "science backed skincare brand in India", "about skinimage", "clean luxury skincare", "active ingredient skincare"],
  alternates: {
    canonical: "https://skinimage.in/about-us/",
  },
  openGraph: {
    title: "About Us | Skinimage – A Dermatologist-Recommended Skincare Brand",
    description: "Discover Skinimage, a dermatologist-recommended skincare brand in India built on clinical science and clean actives.",
    type: "website",
    url: "https://skinimage.in/about-us/",
  }
};

export default function AboutUsPage() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Skinimage",
    "url": "https://skinimage.in/about-us/",
    "description": "Skinimage is a dermatologist-recommended skincare brand in India, combining clinical science with clean, active botanicals.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Skinimage",
      "url": "https://skinimage.in/",
      "logo": "https://skinimage.in/skinimagelogo.png",
      "description": "A science-backed skincare brand in India offering dermatologist-recommended formulations enriched with active ingredients like Niacinamide, Vitamin C, Hyaluronic Acid, AHA and BHA.",
      "sameAs": [
        "https://www.instagram.com/skin_image_/"
      ]
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Why is Skinimage considered a dermatologist-recommended skincare brand?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every Skinimage formulation is developed with dermatologist input and built around clinically studied active ingredients at transparent concentrations, which is why the brand is recommended by dermatologists across India."
        }
      },
      {
        "@type": "Question",
        "name": "What makes Skinimage a science-backed skincare brand in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Skinimage formulates every product around proven actives such as Niacinamide, Vitamin C, Hyaluronic Acid, AHA and BHA, at disclosed concentrations, rather than relying on trends or unverified claims."
        }
      },
      {
        "@type": "Question",
        "name": "Is Skinimage suitable for Indian skin and climate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Skinimage formulations are designed to perform in humid, high-UV Indian conditions while remaining gentle enough for sensitive and acne-prone skin types."
        }
      }
    ]
  };

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AboutUsClient />
    </>
  );
}
