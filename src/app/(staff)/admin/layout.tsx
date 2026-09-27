import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, UtensilsCrossed, BellRing, QrCode, LogOut } from 'lucide-react';
import { RealtimeRefresher } from '@/components/RealtimeRefresher';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const finalUser = user;

  if (!finalUser) {
    redirect('/login');
  }

  // Fetch staff's hotel mapping (assumes a staff_profiles table exists to link user to hotel)
  // For now, we just show a shell since DB tables for staff aren't fully populated yet.

  return (
    <div className="min-h-screen bg-warm-surface flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-ink/5 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-ink/5">
          <div className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center font-bold mr-3">
            L
          </div>
          <span className="font-bold text-lg text-ink">LumiStay</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem href="/admin/orders" icon={<UtensilsCrossed size={20} />} label="Orders" />
          <NavItem href="/admin/requests" icon={<BellRing size={20} />} label="Service Requests" />
          <NavItem href="/admin/qr" icon={<QrCode size={20} />} label="QR Codes" />
          <NavItem href="/admin/menu" icon={<UtensilsCrossed size={20} />} label="Menu" />
          <NavItem href="/admin/settings" icon={<LayoutDashboard size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-ink/5">
          <div className="mb-4 px-3">
            <p className="text-sm font-semibold truncate">{finalUser.email}</p>
            <p className="text-xs text-ink/50">Hotel Admin</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 text-ink/70 hover:text-critical hover:bg-critical/10 w-full px-3 py-2 rounded-xl transition-colors text-sm font-medium">
              <LogOut size={18} /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar for mobile could go here */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <RealtimeRefresher tables={['orders', 'service_requests']} />
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  // Simple styling for now. Active state requires client component with usePathname.
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 text-ink/70 hover:bg-forest/5 hover:text-forest px-3 py-2.5 rounded-xl transition-all font-medium"
    >
      {icon}
      {label}
    </Link>
  );
}
