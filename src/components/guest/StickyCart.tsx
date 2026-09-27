'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/components/guest/CartContext';
import { ShoppingBag } from 'lucide-react';

export function StickyCart({ token }: { token: string }) {
  const { totalItems, subtotalMinor } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 sm:px-6 md:max-w-md md:mx-auto z-50 animate-in slide-in-from-bottom-4 duration-300">
      <Link href={`/q/${token}/cart`} className="flex items-center justify-between bg-brand-primary text-white p-4 rounded-2xl shadow-lg hover:bg-brand-primary/90 transition-all active:scale-95">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-bold">
            {totalItems}
          </div>
          <div>
            <p className="font-semibold text-sm opacity-80 uppercase tracking-wider">View Cart</p>
            <p className="font-bold text-lg">₹{(subtotalMinor / 100).toFixed(0)}</p>
          </div>
        </div>
        <div className="w-12 h-12 bg-white text-brand-primary rounded-full flex items-center justify-center shadow-inner">
          <ShoppingBag size={20} />
        </div>
      </Link>
    </div>
  );
}
