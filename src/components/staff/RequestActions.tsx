'use client'

import React, { useState } from 'react';
import { updateRequestStatus } from '@/lib/db/queries/admin';
import { Check, User, Play } from 'lucide-react';

type RequestActionsProps = {
  requestId: string;
  currentStatus: string;
};

export default function RequestActions({ requestId, currentStatus }: RequestActionsProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await updateRequestStatus(requestId, newStatus);
      if (res.success) {
        setStatus(newStatus);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (status === 'submitted') {
    return (
      <button 
        onClick={() => handleUpdate('acknowledged')}
        disabled={loading}
        className="w-full bg-forest text-white py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-forest/90 transition-colors disabled:opacity-50"
      >
        <User size={18} /> Acknowledge
      </button>
    );
  }

  if (status === 'acknowledged') {
    return (
      <button 
        onClick={() => handleUpdate('in_progress')}
        disabled={loading}
        className="w-full bg-brass text-white py-2.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-brass/90 transition-colors disabled:opacity-50"
      >
        <Play size={18} /> Start Progress
      </button>
    );
  }

  if (status === 'in_progress') {
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
