import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Refund & Exchange Policy | Skinimage",
  description: "Read the Skinimage Refund and Exchange Policy. Learn about correct product delivery, exchange eligibility, and our contact details.",
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-stone-200 pb-8 mb-10">
          <h1 className="font-serif text-3.5xl sm:text-5.5xl font-normal text-stone-900 tracking-tight mb-2">
            Refund & Exchange Policy
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm">
            Effective Date: July 26, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-stone max-w-none text-stone-600 text-sm sm:text-base leading-relaxed space-y-8">
          <p>
            We strive to deliver the correct products in perfect condition. Due to the nature of skincare products, all sales are generally final, and we do not offer refunds after a product has been delivered successfully.
          </p>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              No Refund Policy
            </h2>
            <p>
              Once an order has been delivered successfully, it is not eligible for a refund unless the issue is caused by our mistake or required by applicable law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              Wrong Product Received
            </h2>
            <p>
              If you receive a product different from what you ordered (for example, you ordered a Toner but received a Sunscreen), please contact us within <strong>48 hours</strong> of delivery with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your Order ID</li>
              <li>Photos of the product received</li>
              <li>Photos of the package and shipping label</li>
            </ul>
            <p className="text-stone-500 text-xs italic">
              * Our support team will investigate the issue before approving any request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              Exchange Eligibility
            </h2>
            <p>
              If our investigation confirms that the wrong product was sent by our team:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You may request an exchange for the correct product.</li>
              <li>The incorrect product must be unused, unopened, and returned in its original packaging.</li>
              <li>The returned product will be inspected before the exchange is approved.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              Alternative Offer
            </h2>
            <p>
              If you choose not to exchange the incorrectly delivered product (subject to our approval), we may offer <strong>50% OFF</strong> on the incorrectly delivered product, and we will send your originally ordered product separately.
            </p>
            <p className="text-stone-500 text-xs italic">
              * This option is available only after verification and approval by our support team.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              Products Not Eligible for Exchange
            </h2>
            <p>Exchange requests will not be accepted if:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The product has been opened or used.</li>
              <li>The original packaging is damaged or missing.</li>
              <li>The product has been intentionally damaged.</li>
              <li>The request is made after the specified reporting period.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              Return Shipping
            </h2>
            <p>
              If the mistake is confirmed to be from our side, we will arrange the return process or provide return instructions.
            </p>
          </section>

          <section className="space-y-3 pb-6">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900">
              Contact Us
            </h2>
            <p>For any exchange-related queries, please contact us through:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Email:</strong> <a href="mailto:support@skinimage.com" className="text-emerald-700 hover:underline">support@skinimage.com</a></li>
              <li><strong>Phone/WhatsApp:</strong> +1 (800) 555-SKIN</li>
            </ul>
            <p className="text-stone-500 text-xs italic">
              * Our team will respond as soon as possible and guide you through the process.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
