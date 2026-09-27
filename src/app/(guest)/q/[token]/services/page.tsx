import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { resolveQrToken } from '@/lib/db/queries/guest';
import { ServiceForm } from '@/components/guest/ServiceForm';

export default async function GuestServicesPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guestContext = await resolveQrToken(token);

  if (!guestContext) notFound();

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 animate-in slide-in-from-right-4 duration-300">
      <header className="flex items-center gap-4 mt-4 mb-8">
        <Link href={`/q/${token}`} className="p-2 -ml-2 rounded-full hover:bg-brand-primary/10 text-brand-primary transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-brand-text">Request service</h1>
      </header>

      <ServiceForm token={token} roomId={guestContext.roomId} />
    </div>
  );
}
