import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { LayoutDashboard, LogOut, Building } from 'lucide-react';

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Basic check for super admin email for now
  if (user.email !== 'admin@lumistay.com' && user.email !== 'superadmin@hotel.com') {
    // Optionally check staff_profiles role if needed
    const { data } = await supabase.from('staff_profiles').select('role').eq('id', user.id).single();
    if (!data || data.role !== 'super_admin') {
      redirect('/admin');
    }
  }

  return (
    <div className="min-h-screen bg-warm-surface flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-ink/5 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-ink/5">
          <div className="w-8 h-8 bg-forest text-white rounded-lg flex items-center justify-center font-bold mr-3">
            S
          </div>
          <span className="font-bold text-lg text-ink">Super Admin</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <NavItem href="/superadmin" icon={<Building size={20} />} label="Hotels" />
        </nav>

        <div className="p-4 border-t border-ink/5">
          <div className="mb-4 px-3">
            <p className="text-sm font-semibold truncate">{user.email}</p>
            <p className="text-xs text-ink/50">Super Admin</p>
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
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
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
