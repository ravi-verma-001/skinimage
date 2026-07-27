'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, RefreshCw, UserPlus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register, googleLogin, user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
        toast.success('Registration successful with Google!');
      } catch (err: any) {
        toast.error(err.message || 'Google registration failed');
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
          document.getElementById('googleSignUpButton'),
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
    if (!name || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Registration successful! Welcome to Skinimage.');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Try a different email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8 bg-stone-50">
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-xs space-y-6">
        
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3 w-3" /> Get Started
          </span>
          <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">Create your Account</h1>
          <p className="text-stone-500 text-xs">Unlock personalized skincare recommendations and order tracking.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>
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
            <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 transition flex items-center justify-center"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Sign Up <ArrowRight className="ml-2 h-4 w-4" /></>}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-stone-200"></div>
          <span className="flex-shrink mx-4 text-stone-450 text-[10px] uppercase font-bold tracking-wider">Or continue with</span>
          <div className="flex-grow border-t border-stone-200"></div>
        </div>

        <div className="space-y-3 flex flex-col items-center">
          {/* Official Google sign up container */}
          <div id="googleSignUpButton" className="w-full flex justify-center min-h-[44px]"></div>

          {/* Quick Mock Button if CLIENT ID is not configured yet */}
          {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <button
              type="button"
              onClick={async () => {
                const mockToken = `mock_google_token_${Math.floor(100000 + Math.random() * 900000)}_google_user@example.com_Google-User`;
                setLoading(true);
                try {
                  await googleLogin(mockToken);
                  toast.success('Simulated Google registration successful!');
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
          Already have an account?{' '}
          <Link href="/login" prefetch={false} className="font-bold text-emerald-700 hover:underline">
            Log In
          </Link>
        </div>

      </div>
    </div>
  );
}
