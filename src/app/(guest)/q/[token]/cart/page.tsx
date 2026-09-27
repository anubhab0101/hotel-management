import React from 'react';
import { notFound } from 'next/navigation';
import { resolveQrToken } from '@/lib/db/queries/guest';
import { CartCheckout } from '@/components/guest/CartCheckout';

export default async function GuestCartPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guestContext = await resolveQrToken(token);

  if (!guestContext) notFound();

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 animate-in slide-in-from-right-4 duration-300">
      <CartCheckout 
        token={token} 
        roomLabel={guestContext.roomLabel} 
        roomId={guestContext.roomId} 
      />
    </div>
  );
}
