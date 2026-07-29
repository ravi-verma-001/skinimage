import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy | Skinimage",
  description: "Read the Skinimage Privacy Policy. Learn how we collect, protect, and use your personal information on our e-commerce platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-stone-900 tracking-tight mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-stone max-w-none text-stone-600 text-sm sm:text-base leading-relaxed space-y-6">
          <p className="text-xs text-stone-400 italic">Last updated: July 29, 2026</p>
          
          <p>
            At Skinimage (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), we are committed to protecting the privacy and security of our customers and visitors. This Privacy Policy describes how we collect, use, process, and disclose your information when you visit and purchase from <a href="https://skinimage.in" className="text-emerald-800 hover:underline">skinimage.in</a> (the &quot;Site&quot;).
          </p>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect personal information that you provide directly to us when using our Site. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Contact Details:</strong> Your name, email address, shipping address, billing address, and phone number when placing an order or registering for an account.</li>
            <li><strong>Account Information:</strong> Your username, password, order history, and wishlist items.</li>
            <li><strong>Payment Information:</strong> Credit card, debit card, UPI, net banking, or other payment details processed securely via our third-party payment gateways (we do not store raw card numbers on our servers).</li>
            <li><strong>Skin Analysis Data:</strong> Self-reported skin concerns, skin type, age, and habits entered into our digital Skin Analyzer to recommend products.</li>
          </ul>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            We process your personal information for purposes based on legitimate business interests, the fulfillment of our contract with you, and compliance with our legal obligations in India. These include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Processing, packing, and shipping your skincare order to your designated address.</li>
            <li>Sending order confirmations, shipping updates, and tracking details via email, SMS, or WhatsApp.</li>
            <li>Providing custom skincare regimen recommendations using our Skin Analyzer tool.</li>
            <li>Responding to customer service inquiries and resolving complaints.</li>
            <li>Preventing fraudulent transactions and ensuring website security.</li>
          </ul>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">3. Data Transfer and Third-Party Sharing</h2>
          <p>
            We do not sell or rent your personal data to third parties. We share information only with trusted service providers essential to running our business operations under strict data privacy agreements:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Courier and Logistics Partners:</strong> To deliver physical orders to your address in India.</li>
            <li><strong>Payment Processing Gateways:</strong> To authorize and process payments securely.</li>
            <li><strong>Analytics Providers:</strong> (e.g., Google Analytics) to monitor website performance and traffic.</li>
          </ul>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies to enhance your browsing experience, remember your cart items, and understand how you interact with our website. You can choose to disable cookies in your browser settings, though some features of the Site may not function correctly as a result.
          </p>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">5. User Rights under Indian Law</h2>
          <p>
            In accordance with applicable data protection regulations in India (including the Digital Personal Data Protection Act, 2023), you have the right to request access to the personal data we hold about you, request corrections to incomplete or inaccurate data, or request deletion of your personal information (subject to certain legal record-keeping requirements). To exercise these rights, please contact us at <a href="mailto:support@skinimage.in" className="text-emerald-800 hover:underline">support@skinimage.in</a>.
          </p>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">6. Security Measures</h2>
          <p>
            We implement appropriate technical and organizational security measures (including SSL encryption) to protect your personal data against unauthorized access, loss, or alteration.
          </p>

          <h2 className="font-serif text-xl font-bold text-stone-900 mt-8 mb-4">7. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact our Grievance Officer at:
            <br />
            <strong>Email:</strong> support@skinimage.in
            <br />
            <strong>Address:</strong> Skinimage Skincare Pvt. Ltd., New Delhi, India
          </p>
        </div>
      </div>
    </div>
  );
}
