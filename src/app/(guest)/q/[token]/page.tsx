import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Wifi, UtensilsCrossed, Bath, Droplets, Wind, PlusCircle, ChefHat, Info, MessageCircle, Phone } from 'lucide-react';
import { resolveQrToken, getActiveOrdersAndRequests } from '@/lib/db/queries/guest';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';

export default async function GuestHomePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guestContext = await resolveQrToken(token);

  if (!guestContext) {
    notFound();
  }

  const activeTasks = await getActiveOrdersAndRequests(guestContext.roomId);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 space-y-8 animate-in fade-in duration-500">
      <RealtimeRefresher tables={['orders', 'service_requests']} />
      {/* Header */}
      <header className="flex justify-between items-start mt-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-brand-text/90">
            {guestContext.hotelName}
          </h1>
          <p className="text-sm font-medium mt-1 text-brand-primary">
            EN ▾
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
          {guestContext.hotelName.charAt(0)}
        </div>
      </header>

      {/* Greeting */}
      <section className="space-y-1">
        <h2 className="text-3xl font-semibold tracking-tight">Good evening</h2>
        <p className="text-lg text-brand-text/70">{guestContext.roomLabel}</p>
        <p className="text-lg font-medium pt-2">What can we help with?</p>
      </section>

      {/* Primary Actions */}
      <section className="grid grid-cols-2 gap-4">
        <Link href={`/q/${token}/wifi`} className="group flex flex-col bg-white rounded-2xl p-5 shadow-sm border border-brand-text/5 hover:border-brand-primary/20 transition-all active:scale-95">
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors">
            <Wifi size={20} />
          </div>
          <span className="font-semibold text-lg leading-tight">Wi-Fi<br/>password</span>
        </Link>
        
        <Link href={`/q/${token}/menu`} className="group flex flex-col bg-white rounded-2xl p-5 shadow-sm border border-brand-text/5 hover:border-brand-primary/20 transition-all active:scale-95">
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors">
            <UtensilsCrossed size={20} />
          </div>
          <span className="font-semibold text-lg leading-tight">Food &<br/>drinks</span>
        </Link>
      </section>

      {/* Service Shortcuts */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-brand-text/5">
        <h3 className="font-semibold text-base mb-4">Request something</h3>
        <div className="flex flex-wrap gap-2">
          <ShortcutButton icon={<Bath size={16}/>} label="Towels" />
          <ShortcutButton icon={<Droplets size={16}/>} label="Water" />
          <ShortcutButton icon={<Wind size={16}/>} label="Cleaning" />
          <Link href={`/q/${token}/services`} className="flex items-center gap-2 bg-brand-surface rounded-full px-4 py-2 text-sm font-medium hover:bg-brand-primary/10 transition-colors">
            <PlusCircle size={16} /> More
          </Link>
        </div>
      </section>

      {/* Active Requests (Only show if exist) */}
      {activeTasks.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-base">Active</h3>
          <div className="space-y-3">
            {activeTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between bg-brand-primary text-white rounded-2xl p-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    {task.type === 'order' ? <ChefHat size={16} /> : <Info size={16} />}
                  </div>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-white/80">{task.timeAgo}</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-white text-brand-primary text-sm font-bold shadow-sm">
                  {task.status}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer / Secondary Actions */}
      <section className="space-y-4 pt-4">
        <Link href={`/q/${token}/hotel`} className="flex items-center justify-between bg-white rounded-2xl p-5 shadow-sm border border-brand-text/5 hover:border-brand-primary/20 transition-all">
          <div>
            <h3 className="font-semibold text-lg">Hotel guide</h3>
            <p className="text-sm text-brand-text/70 mt-1">Breakfast · Pool · Checkout</p>
          </div>
          <Info className="text-brand-primary" size={24} />
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <a href="tel:+1234567890" className="flex items-center justify-center gap-2 bg-white rounded-xl py-3 shadow-sm font-semibold border border-brand-text/5 text-brand-text/80">
            <Phone size={18} /> Call reception
          </a>
          <a href="#" className="flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl py-3 shadow-sm font-semibold">
            <MessageCircle size={18} /> WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
}

// Inline component for quick shortcuts
function ShortcutButton({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <button className="flex items-center gap-2 bg-brand-surface rounded-full px-4 py-2 text-sm font-medium hover:bg-brand-primary/10 transition-colors active:scale-95">
      <span className="text-brand-primary">{icon}</span>
      {label}
    </button>
  );
}
