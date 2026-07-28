'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export const FloatingAnalyzer: React.FC = () => {
  return (
    <Link
      href="/skin-analyzer"
      prefetch={false}
      className="fixed bottom-6 right-6 z-45 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7E3B9B] via-[#6D4EB3] to-[#4C1D95] text-stone-100 px-4 py-3 shadow-[0_10px_35px_rgba(110,74,142,0.35)] border border-purple-400/35 hover:scale-105 active:scale-95 transition-all duration-300 group select-none"
    >
      {/* Pulse animation rings */}
      <span className="absolute -inset-1 rounded-full border border-[#7E3B9B]/40 animate-ping opacity-60 pointer-events-none" style={{ animationDuration: '3s' }} />
      
      <Sparkles className="h-4 w-4 text-purple-200 group-hover:rotate-12 transition-transform duration-300 animate-[pulse_2s_infinite]" />
      <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase whitespace-nowrap">
        Free Skin Analyzer
      </span>
    </Link>
  );
};
