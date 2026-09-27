import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import { resolveQrToken, getMenu } from '@/lib/db/queries/guest';
import { MenuList } from '@/components/guest/MenuList';
import { StickyCart } from '@/components/guest/StickyCart';

export default async function GuestMenuPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guestContext = await resolveQrToken(token);

  if (!guestContext) notFound();

  const menuCategories = await getMenu(guestContext.hotelId);

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <header className="flex items-center justify-between mt-4 mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <Link href={`/q/${token}`} className="p-2 -ml-2 rounded-full hover:bg-brand-primary/10 text-brand-primary transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Food & drinks</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-brand-primary/10 text-brand-text/70 transition-colors">
          <Search size={22} />
        </button>
      </header>

      {/* Menu List Client Component */}
      {menuCategories.length > 0 ? (
        <MenuList categories={menuCategories} />
      ) : (
        <div className="text-center py-20 text-brand-text/50">
          <p>No menu items available at the moment.</p>
        </div>
      )}

      {/* Sticky Cart (Only renders if items > 0) */}
      <StickyCart token={token} />
    </div>
  );
}
