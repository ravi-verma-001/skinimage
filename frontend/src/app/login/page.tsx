'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import { API_URL } from '@/config';

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user]);

  useEffect(() => {
    const handleCredentialResponse = async (response: any) => {
      setLoading(true);
      try {
        await googleLogin(response.credential);
        toast.success('Logged in successfully with Google!');
      } catch (err: any) {
        toast.error(err.message || 'Google login failed');
      } finally {
        setLoading(false);
      }
    };

    const initializeGoogleSignIn = () => {
      const google = (window as any).google;
      if (google) {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy_client_id',
          callback: handleCredentialResponse,
        });
        google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          { theme: 'outline', size: 'large', width: 320 }
        );
      }
    };

    if ((window as any).google) {
      initializeGoogleSignIn();
    } else {
      const interval = setInterval(() => {
        if ((window as any).google) {
          initializeGoogleSignIn();
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [googleLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address first.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message || 'Reset link sent!');
    } catch (err: any) {
      toast.success('Reset Link Sent! Please check your email inbox.');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8 bg-stone-50">
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-xs space-y-6">
        
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3 w-3" /> Welcome Back
          </span>
          <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">Login to Skinimage</h1>
          <p className="text-stone-500 text-xs">Access your saved products, purchase history, and tracking codes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold uppercase text-stone-500">Password</label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-emerald-700 hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-stone-900 font-medium">
                Remember Me
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 transition flex items-center justify-center"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-stone-200"></div>
          <span className="flex-shrink mx-4 text-stone-450 text-[10px] uppercase font-bold tracking-wider">Or continue with</span>
          <div className="flex-grow border-t border-stone-200"></div>
        </div>

        <div className="space-y-3 flex flex-col items-center">
          {/* Official Google sign in container */}
          <div id="googleSignInButton" className="w-full flex justify-center min-h-[44px]"></div>

          {/* Quick Mock Button if CLIENT ID is not configured yet */}
          {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <button
              type="button"
              onClick={async () => {
                const mockToken = `mock_google_token_${Math.floor(100000 + Math.random() * 900000)}_google_user@example.com_Google-User`;
                setLoading(true);
                try {
                  await googleLogin(mockToken);
                  toast.success('Simulated Google login successful!');
                } catch (err: any) {
                  toast.error(err.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full max-w-[320px] border border-stone-300 rounded px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 flex items-center justify-center transition"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.76 5.76 0 0 1 8.2 12.8a5.76 5.76 0 0 1 5.791-5.8 5.68 5.68 0 0 1 3.93 1.545l3.1-3.1A9.914 9.914 0 0 0 13.991 3c-5.523 0-10 4.477-10 10s4.477 10 10 10c5.84 0 9.809-4.114 9.809-10 0-.668-.06-1.312-.179-1.929l-9.381.214Z"/>
              </svg>
              Demo Google Sign In
            </button>
          )}
        </div>

        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
          New to Skinimage?{' '}
          <Link href="/register" prefetch={false} className="font-bold text-emerald-700 hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}
