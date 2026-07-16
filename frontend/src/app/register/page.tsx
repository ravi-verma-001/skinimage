'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, RefreshCw, UserPlus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register, user } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // user or admin (useful for sandbox preview)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Registration successful! Welcome to NextSkin.');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Try a different email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6 lg:px-8 bg-stone-50">
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
            <label className="block text-xs font-semibold uppercase text-stone-500 mb-1">Sandbox Role (Simulated Setup)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded border border-stone-300 bg-white px-3 py-2 text-sm text-stone-850 focus:border-emerald-600 focus:outline-none"
            >
              <option value="user">Standard User (Dashboard View)</option>
              <option value="admin">Administrator (Admin Console View)</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 transition flex items-center justify-center"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <>Sign Up <ArrowRight className="ml-2 h-4 w-4" /></>}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100 text-xs text-stone-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-emerald-700 hover:underline">
            Log In
          </Link>
        </div>

      </div>
    </div>
  );
}
