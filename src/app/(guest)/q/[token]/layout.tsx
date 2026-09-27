import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { resolveQrToken } from '@/lib/db/queries/guest';

import { CartProvider } from '@/components/guest/CartContext';
import ConsentBanner from '@/components/guest/ConsentBanner';
import WithdrawConsentButton from '@/components/guest/WithdrawConsentButton';

export default async function GuestPortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guestContext = await resolveQrToken(token);

  if (!guestContext) {
    notFound();
  }

  // Inject tenant colors as inline CSS variables to map to Tailwind vars
  const style = {
    '--tenant-primary': guestContext.branding.primaryColor,
    '--tenant-surface': guestContext.branding.surfaceColor,
    '--tenant-text': guestContext.branding.textColor,
  } as React.CSSProperties;

  return (
    <div style={style} className="min-h-screen bg-brand-surface text-brand-text font-sans selection:bg-brand-primary selection:text-white pb-24">
      <CartProvider>
        {children}
      </CartProvider>
      <footer className="mt-12 py-6 text-center text-sm opacity-70">
        <div className="flex items-center justify-center gap-4">
          <Link href={`/q/${token}/legal`} className="underline hover:opacity-100 transition-opacity">
            Terms &amp; Privacy Policy
          </Link>
          <WithdrawConsentButton />
        </div>
      </footer>
      <ConsentBanner />
    </div>
  );
}
