'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { API_URL } from '@/config';
import { CheckCircle2, XCircle, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';

function VerifyPaymentContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('orderId');
  const { clearCart } = useCart();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (!orderId) {
      setStatus('failed');
      setErrorMsg('No order reference found to verify.');
      return;
    }

    let isMounted = true;

    async function verify() {
      try {
        const res = await fetch(`${API_URL}/orders/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Payment verification failed.');

        if (data.success) {


          if (isMounted) {
            setStatus('success');
            clearCart();
          }
        } else {
          if (isMounted) {
            setStatus('failed');
            setErrorMsg(data.status ? `Payment Status: ${data.status}` : 'Transaction verification failed.');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus('failed');
          setErrorMsg(err.message || 'An error occurred while verifying the payment.');
        }
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [orderId, clearCart]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-stone-200 shadow-sm transition-all duration-300">
        {status === 'verifying' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 text-emerald-700 animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-semibold text-stone-900">Verifying Payment</h2>
              <p className="text-sm text-stone-500">Please do not refresh the page or click back. We are verifying your transaction with Cashfree...</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center animate-bounce duration-1000">
              <div className="rounded-full bg-emerald-50 p-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-700" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-stone-900">Order Confirmed!</h2>
              <p className="text-sm text-emerald-800 font-medium">Payment Successful</p>
              <p className="text-xs text-stone-400">Order Reference: {orderId}</p>
              <p className="text-sm text-stone-500 px-4">
                Thank you for your purchase. We are preparing your botanical skincare remedies. A confirmation email and tracking ID will be sent shortly.
              </p>
            </div>
            <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="inline-flex justify-center items-center rounded-md bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 text-xs font-semibold transition"
              >
                <ShoppingBag className="h-4 w-4 mr-2" /> Continue Shopping
              </Link>
              <Link
                href="/profile"
                className="inline-flex justify-center items-center rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50 px-6 py-2.5 text-xs font-semibold transition"
              >
                View Orders <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center space-y-6">
            <div className="flex justify-center animate-pulse">
              <div className="rounded-full bg-red-50 p-3">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-stone-900">Payment Failed</h2>
              <p className="text-sm text-red-850 font-medium">{errorMsg || 'Could not verify transaction.'}</p>
              {orderId && <p className="text-xs text-stone-400">Reference: {orderId}</p>}
              <p className="text-sm text-stone-500 px-4">
                If money was deducted from your account, it will be refunded automatically by your bank within 5-7 business days.
              </p>
            </div>
            <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/checkout"
                className="inline-flex justify-center items-center rounded-md bg-stone-900 hover:bg-stone-800 text-white px-6 py-2.5 text-xs font-semibold transition"
              >
                Retry Checkout
              </Link>
              <Link
                href="/cart"
                className="inline-flex justify-center items-center rounded-md border border-stone-300 text-stone-700 hover:bg-stone-50 px-6 py-2.5 text-xs font-semibold transition"
              >
                Return to Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center bg-stone-50">
        <Loader2 className="h-12 w-12 text-emerald-700 animate-spin" />
      </div>
    }>
      <VerifyPaymentContent />
    </Suspense>
  );
}
