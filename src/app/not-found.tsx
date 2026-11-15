import React from 'react';
import Link from 'next/link';
import { Sparkles, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brandBlack text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-brandPink/15 border border-brandPink/40 mx-auto flex items-center justify-center text-brandPink mb-6 shadow-pink-soft">
          <Sparkles className="w-8 h-8" />
        </div>

        <span className="text-xs uppercase tracking-[0.3em] text-brandPink font-semibold mb-2 block">
          Soumili's Makeover
        </span>

        <h1 className="font-serif text-5xl font-normal text-white mb-3">
          404
        </h1>

        <h2 className="font-serif text-2xl text-brandLightPink mb-4">
          Page Not Found
        </h2>

        <p className="text-xs sm:text-sm text-brandLightPink/75 mb-8 font-light">
          The page you are seeking does not exist or has been relocated in our luxury bridal catalog.
        </p>

        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-brandPink hover:bg-brandPink-600 text-white px-8 py-3.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all shadow-pink-soft hover:shadow-pink-glow"
        >
          <Home className="w-4 h-4" />
          <span>Return To Homepage</span>
        </Link>
      </div>
    </div>
  );
}
