import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Copy } from 'lucide-react';
import { resolveQrToken } from '@/lib/db/queries/guest';

export default async function WifiPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guestContext = await resolveQrToken(token);

  if (!guestContext) notFound();

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
      <header className="flex items-center gap-4 mt-4">
        <Link href={`/q/${token}`} className="p-2 -ml-2 rounded-full hover:bg-brand-primary/10 text-brand-primary transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-brand-text">Wi-Fi</h1>
      </header>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-text/5 mt-8">
        <p className="text-brand-text/70 mb-1">Network name</p>
        <p className="text-2xl font-bold mb-8">{guestContext.hotelName.split(' ')[0]}_Guest</p>
        
        <p className="text-brand-text/70 mb-1">Password</p>
        <div className="flex items-center justify-between mb-8">
          <p className="text-2xl font-bold tracking-widest">••••••••</p>
          <button className="text-sm font-semibold text-brand-primary hover:underline">Reveal</button>
        </div>

        <button className="w-full bg-brand-primary text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-colors active:scale-95 shadow-md">
          <Copy size={20} /> Copy password
        </button>
      </div>

      <div className="space-y-4 pt-6 px-2 text-brand-text/80">
        <div className="flex items-start gap-4">
          <div className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold shrink-0 text-sm">1</div>
          <p>Open Wi-Fi settings on your device</p>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold shrink-0 text-sm">2</div>
          <p>Choose the network above</p>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold shrink-0 text-sm">3</div>
          <p>Paste the copied password</p>
        </div>
      </div>
    </div>
  );
}
