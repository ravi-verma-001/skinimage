import type { Metadata } from 'next';
import SkinAnalyzerClient from './SkinAnalyzerClient';

export const metadata: Metadata = {
  title: "Free AI Skin Analyzer - Get Personal Skincare Routine | Skinimage",
  description: "Scan your skin instantly using our advanced AI Vision analysis. Upload a selfie to identify hydration, pore, acne, & redness scores, and receive custom active routines.",
  keywords: ["skin analyzer", "ai skin scanner", "skincare test", "selfie skin analysis", "dermatologist recommendation", "skin routine finder"],
  openGraph: {
    title: "Free AI Skin Analyzer - Get Personal Skincare Routine | Skinimage",
    description: "Scan your skin instantly using our advanced AI Vision analysis. Upload a selfie to check hydration, pore, acne, & redness scores.",
    type: "website",
  }
};

export default function SkinAnalyzerPage() {
  return <SkinAnalyzerClient />;
}
