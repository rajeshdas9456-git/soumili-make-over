'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-brandBlack text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 border border-brandPink/30 rounded-3xl p-8 text-center backdrop-blur-md shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-brandPink/15 border border-brandPink/40 mx-auto flex items-center justify-center text-brandPink mb-6 shadow-pink-soft">
          <AlertCircle className="w-8 h-8" />
        </div>

        <span className="text-[11px] uppercase tracking-[0.25em] text-brandPink font-semibold mb-2 block">
          Soumili's Makeover
        </span>

        <h1 className="font-serif text-3xl font-normal text-white mb-3">
          Something went wrong
        </h1>

        <p className="text-xs text-brandLightPink/80 leading-relaxed mb-6 font-light">
          A temporary connection glitch occurred while loading the studio data. Please refresh or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all shadow-pink-soft"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase transition-all border border-white/20"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
