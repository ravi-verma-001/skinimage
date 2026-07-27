import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Shipping Policy | Skinimage",
  description: "Read the Skinimage Shipping Policy. Find out about order processing timelines, delivery times for metro and remote areas, and shipping charges.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-stone-200 pb-8 mb-10">
          <h1 className="font-serif text-3.5xl sm:text-5.5xl font-normal text-stone-900 tracking-tight mb-2">
            Shipping Policy
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm">
            Effective Date: July 26, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-stone max-w-none text-stone-600 text-sm sm:text-base leading-relaxed space-y-8">
          <p>
            Thank you for shopping with us. We are committed to delivering your order safely and on time.
          </p>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              Order Processing
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All orders are processed within <strong>1–2 business days</strong> after successful payment.</li>
              <li>Orders placed on Sundays or public holidays will be processed on the next business day.</li>
              <li>Once your order has been shipped, you will receive a shipping confirmation along with tracking details (if available).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              Delivery Time
            </h2>
            <p>Estimated delivery time:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Metro Cities:</strong> 2–5 business days</li>
              <li><strong>Other Cities & Towns:</strong> 3–7 business days</li>
              <li><strong>Remote Areas:</strong> 5–10 business days</li>
            </ul>
            <p className="text-stone-500 text-xs italic">
              * Delivery times may vary due to weather conditions, courier delays, festivals, or other unforeseen circumstances.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              Shipping Charges
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Shipping charges (if applicable) will be displayed during checkout.</li>
              <li>Any free shipping offers will be clearly mentioned on the website.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              Incorrect Address
            </h2>
            <p>
              Customers are responsible for providing the correct shipping address and contact details. We are not responsible for delays or failed deliveries caused by incorrect or incomplete information provided by the customer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              Damaged Package
            </h2>
            <p>If your package appears damaged at the time of delivery, please:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Take clear photos of the package before opening it.</li>
              <li>Contact our support team within <strong>24 hours</strong> of receiving the order.</li>
            </ol>
            <p className="text-stone-500 text-xs italic">
              * Failure to report shipping damage within the specified time may affect the resolution process.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
