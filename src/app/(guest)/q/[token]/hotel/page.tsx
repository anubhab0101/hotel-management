import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Coffee, Waves, Info } from 'lucide-react';
import { resolveQrToken, getHotelGuide } from '@/lib/db/queries/guest';

const iconMap: Record<string, React.ReactNode> = {
  Clock: <Clock size={20} />,
  Coffee: <Coffee size={20} />,
  Waves: <Waves size={20} />,
  Info: <Info size={20} />
};

export default async function GuestHotelGuidePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guestContext = await resolveQrToken(token);

  if (!guestContext) notFound();

  const guideBlocks = await getHotelGuide(guestContext.hotelId);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 animate-in slide-in-from-right-4 duration-300">
      <header className="flex items-center gap-4 mt-4 mb-8">
        <Link href={`/q/${token}`} className="p-2 -ml-2 rounded-full hover:bg-brand-primary/10 text-brand-primary transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-brand-text">Hotel Guide</h1>
          <p className="text-sm font-medium text-brand-text/60">{guestContext.hotelName}</p>
        </div>
      </header>

      <div className="space-y-4 pb-24">
        {guideBlocks.map((block) => (
          <div key={block.id} className="bg-white rounded-3xl p-5 shadow-sm border border-brand-text/5 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
              {iconMap[block.iconType] || <Info size={20} />}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight mb-1">{block.title}</h3>
              <p className="text-sm text-brand-text/70 leading-snug">{block.content}</p>
            </div>
          </div>
        ))}

        <div className="bg-brand-primary text-white rounded-3xl p-6 shadow-md mt-8">
          <h3 className="font-bold text-lg mb-2">Need more help?</h3>
          <p className="text-white/80 text-sm mb-4">Our front desk team is available 24/7 to assist you with anything else you might need.</p>
          <a href="tel:+1234567890" className="inline-block bg-white text-brand-primary font-bold px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors">
            Call Reception
          </a>
        </div>
      </div>
    </div>
  );
}
