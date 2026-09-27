'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/guest/CartContext';
import { ArrowLeft, Minus, Plus, Loader2, CheckCircle2 } from 'lucide-react';
import { placeOrder } from '@/lib/db/queries/guest';

export function CartCheckout({ token, roomLabel, roomId }: { token: string, roomLabel: string, roomId: string }) {
  const { items, updateQuantity, subtotalMinor, clearCart } = useCart();
  const [guestNote, setGuestNote] = useState('');
  const [settlement, setSettlement] = useState('room_charge');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Order placed!</h2>
          <p className="text-brand-text/70 mt-2">The kitchen has received your order.<br/>It will be delivered to {roomLabel}.</p>
        </div>
        <button 
          onClick={() => router.push(`/q/${token}`)}
          className="bg-brand-primary text-white font-bold px-8 py-3 rounded-full mt-4 hover:bg-brand-primary/90 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-20 h-20 bg-brand-surface rounded-full flex items-center justify-center text-brand-text/30">
          🛒
        </div>
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <p className="text-brand-text/70">Looks like you haven&apos;t added any items yet.</p>
        <Link href={`/q/${token}/menu`} className="text-brand-primary font-bold hover:underline">
          Browse Menu
        </Link>
      </div>
    );
  }

  const taxMinor = Math.round(subtotalMinor * 0.05); // 5% mock tax
  const totalMinor = subtotalMinor + taxMinor;

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const res = await placeOrder(roomId, { items, guestNote, settlement });
      if (res.success) {
        clearCart();
        setIsSuccess(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="flex items-center gap-4 mt-4">
        <Link href={`/q/${token}/menu`} className="p-2 -ml-2 rounded-full hover:bg-brand-primary/10 text-brand-primary transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-brand-text">Your order</h1>
      </header>

      {/* Cart Items */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-brand-text/5 space-y-5">
        {items.map(item => (
          <div key={item.menuItem.id} className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="font-bold leading-tight">{item.menuItem.name}</h3>
              <p className="font-semibold text-brand-text/70 text-sm mt-1">₹{(item.menuItem.priceMinor / 100).toFixed(0)}</p>
            </div>
            
            <div className="flex items-center gap-3 bg-brand-surface rounded-full p-1 border border-brand-text/10">
              <button 
                onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-sm active:scale-95 transition-transform"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold w-4 text-center">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-primary shadow-sm active:scale-95 transition-transform"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Details & Notes */}
      <section className="space-y-4">
        <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-sm border border-brand-text/5">
          <span className="font-medium text-brand-text/70">Delivering to</span>
          <span className="font-bold text-lg">{roomLabel}</span>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-brand-text/5">
          <label className="block text-sm font-semibold text-brand-text/70 mb-2">Any special requests?</label>
          <textarea 
            value={guestNote}
            onChange={(e) => setGuestNote(e.target.value)}
            placeholder="e.g. Less spicy, extra cutlery..."
            className="w-full bg-brand-surface rounded-xl p-3 border-none focus:ring-2 focus:ring-brand-primary/50 text-sm outline-none resize-none h-20"
          />
        </div>
      </section>

      {/* Bill Summary */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-brand-text/5 space-y-3 text-sm">
        <h3 className="font-bold text-base mb-4">Bill Summary</h3>
        <div className="flex justify-between text-brand-text/70 font-medium">
          <span>Subtotal</span>
          <span>₹{(subtotalMinor / 100).toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-brand-text/70 font-medium">
          <span>Taxes (5%)</span>
          <span>₹{(taxMinor / 100).toFixed(0)}</span>
        </div>
        <hr className="border-brand-text/10 my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Grand Total</span>
          <span>₹{(totalMinor / 100).toFixed(0)}</span>
        </div>
      </section>

      {/* Settlement */}
      <section className="space-y-3">
        <h3 className="font-bold px-2">Payment Method</h3>
        <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${settlement === 'room_charge' ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-text/5 bg-white'}`}>
          <input type="radio" name="settlement" value="room_charge" checked={settlement === 'room_charge'} onChange={() => setSettlement('room_charge')} className="accent-brand-primary w-5 h-5" />
          <span className="font-semibold">Charge to room ({roomLabel})</span>
        </label>
        <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 opacity-50 cursor-not-allowed border-brand-text/5 bg-white`}>
          <input type="radio" disabled name="settlement" value="pay_online" className="accent-brand-primary w-5 h-5" />
          <span className="font-semibold">Pay online (Coming Soon)</span>
        </label>
      </section>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:px-6 md:max-w-md md:mx-auto bg-brand-surface/90 backdrop-blur-md border-t border-brand-text/5">
        <button 
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="w-full bg-brand-primary text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 shadow-lg"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : `Place order • ₹${(totalMinor / 100).toFixed(0)}`}
        </button>
      </div>

    </div>
  );
}
