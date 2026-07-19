'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials. Try admin@skinimage.com / password123');
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
      toast.success('Simulated Reset Link Sent! Please check your email inbox.');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8 bg-stone-50">
      <div className="bg-white p-8 rounded-lg border border-stone-200 shadow-xs space-y-6">
        
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
            <Sparkles className="h-3 w-3" /> Welcome Back
          </span>
          <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">Login to Skinimage</h1>
          <p className="text-stone-500 text-xs">Access your saved products, purchase history, and tracking codes.</p>
        </div>

        {/* Info Banner for Test Users */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-md p-3.5 text-xs text-stone-700 space-y-1">
          <p className="font-bold text-emerald-850 flex items-center">
            <KeyRound className="h-3.5 w-3.5 mr-1" /> Quick Sandbox Sandbox Credentials:
          </p>
          <p><strong>Admin:</strong> admin@skinimage.com | admin123 (Register role: admin)</p>
          <p><strong>User:</strong> user@skinimage.com | user123 (Register role: user)</p>
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
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] text-emerald-700 hover:underline font-semibold"
              >
                Forgot Password?
              </button>
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
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 transition flex items-center justify-center"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
          New to Skinimage?{' '}
          <Link href="/register" className="font-bold text-emerald-700 hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}
