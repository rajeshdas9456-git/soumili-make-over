'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brandBlack flex flex-col justify-center items-center p-4 relative selection:bg-brandPink selection:text-white">
      {/* Background Pink Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brandPink/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Brand Header with Custom Logo */}
      <div className="text-center mb-8 relative z-10">
        <Logo variant="white" size="xl" showTagline={true} />
        <p className="text-[10px] uppercase tracking-[0.35em] text-brandPink font-bold mt-2">
          Website Management Portal
        </p>
      </div>

      {/* Card */}
      <div className="max-w-md w-full bg-[#181818] border border-brandPink/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
        <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-brandPink/20">
          <div className="w-10 h-10 rounded-xl bg-brandBlack flex items-center justify-center text-brandPink border border-brandPink/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl text-white font-normal">
              Admin Authentication
            </h2>
            <p className="text-xs text-brandLightPink/70">
              Soumili's Makeover – Website Management
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/90 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@soumilismakeover.com"
                className="w-full pl-11 pr-4 py-3 bg-brandBlack border border-brandPink/30 rounded-xl text-xs text-white focus:outline-none focus:border-brandPink focus:ring-1 focus:ring-brandPink transition-all placeholder:text-stone-500"
              />
              <Mail className="w-4 h-4 text-brandPink absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-white/90 mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 bg-brandBlack border border-brandPink/30 rounded-xl text-xs text-white focus:outline-none focus:border-brandPink focus:ring-1 focus:ring-brandPink transition-all placeholder:text-stone-500"
              />
              <Lock className="w-4 h-4 text-brandPink absolute left-4 top-3.5" />
            </div>
          </div>

          {/* Quick Helper Credentials */}
          <div className="p-3.5 bg-brandBlack rounded-xl border border-brandPink/20 text-[11px] text-white/80 space-y-1">
            <p className="font-semibold text-brandPink">Default Studio Admin Credentials:</p>
            <p>Email: <code className="text-white">admin@aurabridal.com</code></p>
            <p>Password: <code className="text-white">AuraBridalMaster2026!</code></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-brandPink hover:bg-brandPink-600 text-white font-semibold text-xs uppercase tracking-widest shadow-pink-soft hover:shadow-pink-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In To Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-brandPink/20 text-center">
          <Link
            href="/"
            className="text-xs text-brandLightPink hover:text-white transition-colors"
          >
            &larr; Return to Soumili's Makeover
          </Link>
        </div>
      </div>
    </div>
  );
}
