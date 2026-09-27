'use client';

import React, { useState } from 'react';
import { placeServiceRequest } from '@/lib/db/queries/guest';
import { Bath, Droplets, Wind, Loader2, CheckCircle2, Send } from 'lucide-react';

export function ServiceForm({ roomId }: { token: string, roomId: string }) {
  const [customRequest, setCustomRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRequest = async (type: string, note?: string) => {
    setIsSubmitting(type);
    try {
      const res = await placeServiceRequest(roomId, type, note);
      if (res.success) {
        setSuccessMsg(type === 'custom' ? 'Request sent' : `${type} requested`);
        setCustomRequest('');
        setTimeout(() => setSuccessMsg(null), 3000); // clear after 3s
      } else {
        alert("Something went wrong.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setIsSubmitting(null);
    }
  };

  const handleCustomSubmit = (_e: React.FormEvent) => {
    _e.preventDefault();
    if (!customRequest.trim()) return;
    handleRequest('custom', customRequest);
  };

  if (successMsg) {
    return (
      <div className="bg-green-50 rounded-3xl p-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
        <CheckCircle2 className="text-green-500 mb-3" size={40} />
        <h3 className="font-bold text-lg text-green-800">{successMsg}</h3>
        <p className="text-green-600/80 text-sm mt-1">We&apos;ll attend to it shortly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Quick Requests */}
      <section className="space-y-4">
        <h2 className="font-bold text-lg px-1">Quick Requests</h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickButton 
            icon={<Bath />} label="Towels" 
            isLoading={isSubmitting === 'Towels'} 
            onClick={() => handleRequest('Towels')} 
          />
          <QuickButton 
            icon={<Droplets />} label="Water" 
            isLoading={isSubmitting === 'Water'} 
            onClick={() => handleRequest('Water')} 
          />
          <QuickButton 
            icon={<Wind />} label="Cleaning" 
            isLoading={isSubmitting === 'Cleaning'} 
            onClick={() => handleRequest('Cleaning')} 
          />
          <QuickButton 
            icon={<Bath />} label="Toiletries" 
            isLoading={isSubmitting === 'Toiletries'} 
            onClick={() => handleRequest('Toiletries')} 
          />
        </div>
      </section>

      <hr className="border-brand-text/10" />

      {/* Custom Request */}
      <section className="space-y-4">
        <h2 className="font-bold text-lg px-1">Anything else?</h2>
        <form onSubmit={handleCustomSubmit} className="relative">
          <textarea
            value={customRequest}
            onChange={(e) => setCustomRequest(e.target.value)}
            placeholder="Type your request here (e.g. My TV remote is not working...)"
            className="w-full bg-white rounded-2xl p-4 pr-14 shadow-sm border border-brand-text/5 focus:ring-2 focus:ring-brand-primary/50 text-sm outline-none resize-none h-32"
          />
          <button 
            type="submit"
            disabled={!customRequest.trim() || isSubmitting === 'custom'}
            className="absolute bottom-3 right-3 w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:bg-brand-text/20 transition-all"
          >
            {isSubmitting === 'custom' ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} className="ml-1" />}
          </button>
        </form>
      </section>
    </div>
  );
}

function QuickButton({ icon, label, isLoading, onClick }: { icon: React.ReactNode, label: string, isLoading: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      disabled={isLoading}
      className="flex flex-col items-center justify-center gap-2 bg-white rounded-2xl p-5 shadow-sm border border-brand-text/5 hover:border-brand-primary/30 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 text-brand-primary"
    >
      {isLoading ? <Loader2 className="animate-spin" size={24} /> : icon}
      <span className="font-semibold text-sm text-brand-text">{label}</span>
    </button>
  );
}
