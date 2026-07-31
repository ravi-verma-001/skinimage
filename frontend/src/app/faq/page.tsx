import { Metadata } from 'next';
import FaqClient from './FaqClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Skinimage Skincare',
  description: 'Find answers to common questions about Skinimage dermatologist-recommended skincare products, ordering, shipping, payments, and return policies in India.',
  keywords: 'skincare FAQ, Skinimage support, dermatologist recommended skincare India, shipping policy, returns policy, skin suitability',
  openGraph: {
    title: 'Frequently Asked Questions | Skinimage Skincare',
    description: 'Find answers to common questions about Skinimage dermatologist-recommended skincare products, ordering, shipping, payments, and return policies in India.',
    type: 'website',
  }
};

export default function FaqPage() {
  return <FaqClient />;
}
