import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service | Skinimage",
  description: "Read the Skinimage Terms of Service. Learn about order placement, cancellations, refunds, shipping, and liability for skincare e-commerce.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-white min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-stone-900 tracking-tight mb-8">
          Terms of Service
        </h1>
        
        <div className="prose prose-stone max-w-none text-stone-600 text-sm sm:text-base leading-relaxed space-y-6">
          <p className="text-xs text-stone-400 italic">Last updated: July 29, 2026</p>
          
          <p>
            Welcome to Skinimage. These Terms of Service (&quot;Terms&quot;) govern your use of our website <a href="https://skinimage.in" className="text-emerald-800 hover:underline">skinimage.in</a> (the &quot;Site&quot;) and the purchase of any products from our online store. By accessing the Site or placing an order, you agree to be bound by these Terms.
          </p>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">1. Business Operations &amp; Jurisdiction</h2>
          <p>
            Skinimage is owned and operated by Skinimage Skincare Pvt. Ltd., with registered offices in New Delhi, India. All purchases and contracts made through the Site are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi.
          </p>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">2. Product Information &amp; Efficacy</h2>
          <p>
            We strive to display our skincare formulations (ingredients, descriptions, and packaging) as accurately as possible. However, please note:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Skin results can vary significantly depending on individual skin types, genetics, diet, and climate conditions.</li>
            <li>Our products are not intended to diagnose, treat, cure, or prevent any severe medical skin disease. If you experience severe acne, rosacea, or dermatitis, we advise consulting a licensed dermatologist.</li>
          </ul>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">3. Order Acceptance &amp; Pricing</h2>
          <p>
            All prices listed on the Site are in Indian Rupees (INR) and are inclusive of applicable taxes (GST) unless stated otherwise. We reserve the right to refuse or cancel any order at our discretion due to pricing errors, product unavailability, or suspected fraudulent activity. In the event of a cancellation after payment, a full refund will be processed to the original payment method.
          </p>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">4. Shipping, Delivery &amp; Cancellations</h2>
          <p>
            We deliver to most serviceable pin codes across India. Orders are typically dispatched within 24–48 hours and delivered within 3–7 business days depending on the location.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cancellations:</strong> You may cancel your order before it is dispatched by contacting us at support@skinimage.in. Once dispatched, orders cannot be canceled.</li>
            <li><strong>Damaged Shipments:</strong> If you receive a product that is damaged or leaked during transit, please contact us within 24 hours of delivery with unboxing photos/videos, and we will arrange a free replacement.</li>
          </ul>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">5. Intellectual Property</h2>
          <p>
            All content on the Site—including text, graphics, logos, images, code, and design—is the intellectual property of Skinimage Skincare Pvt. Ltd. You may not copy, reproduce, or distribute any part of this Site without our prior written consent.
          </p>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">6. Changes to Terms</h2>
          <p>
            We reserve the right to update or modify these Terms of Service at any time without prior notice. The updated version will be effective immediately upon posting on this page.
          </p>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">7. Contact Information</h2>
          <p>
            For any queries regarding these Terms, please email us at <a href="mailto:support@skinimage.in" className="text-emerald-800 hover:underline">support@skinimage.in</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
