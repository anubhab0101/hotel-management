'use client'

import React, { useState } from 'react';
import { updateOrderStatus } from '@/lib/db/queries/admin';
import { Check, Play } from 'lucide-react';

type OrderActionsProps = {
  orderId: string;
  currentStatus: string;
};

export default function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setStatus(newStatus);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (status === 'placed') {
    return (
      <button 
        onClick={() => handleUpdate('accepted')}
        disabled={loading}
        className="w-full bg-forest text-white py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-forest/90 transition-colors disabled:opacity-50"
      >
        <Check size={18} /> Accept Order
      </button>
    );
  }

  if (status === 'accepted') {
    return (
      <button 
        onClick={() => handleUpdate('preparing')}
        disabled={loading}
        className="w-full bg-brass text-white py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-brass/90 transition-colors disabled:opacity-50"
      >
        <Play size={18} /> Start Preparing
      </button>
    );
  }

  if (status === 'preparing') {
    return (
      <button 
        onClick={() => handleUpdate('completed')}
        disabled={loading}
        className="w-full bg-ink text-white py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-ink/90 transition-colors disabled:opacity-50"
      >
        <Check size={18} /> Mark Completed
      </button>
    );
  }

  return (
    <div className="w-full bg-warm-surface text-ink/50 py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 text-sm uppercase tracking-wide">
      {status.replace('_', ' ')}
    </div>
  );
}
