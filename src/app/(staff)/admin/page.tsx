import React from 'react';
import { getDashboardStats, getAdminHotelId } from '@/lib/db/queries/admin';

export default async function AdminDashboardPage() {
  const hotelId = await getAdminHotelId();
  const stats = await getDashboardStats(hotelId);
  
  const avgOrderValue = stats.ordersToday > 0 ? (stats.revenueMinor / stats.ordersToday) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics & Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-ink/5">
          <p className="text-ink/60 font-medium text-sm">QR Opens (Today)</p>
          <p className="text-3xl font-bold mt-2">{stats.qrOpens}</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-ink/5">
          <p className="text-ink/60 font-medium text-sm">Orders (Today)</p>
          <p className="text-3xl font-bold mt-2">{stats.ordersToday}</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-ink/5">
          <p className="text-ink/60 font-medium text-sm">Revenue (Today)</p>
          <p className="text-3xl font-bold mt-2">
            ${(stats.revenueMinor / 100).toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-ink/5">
          <p className="text-ink/60 font-medium text-sm">Avg Order Value</p>
          <p className="text-3xl font-bold mt-2">
            ${(avgOrderValue / 100).toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-ink/5">
           <h2 className="text-xl font-bold mb-4">Operations Status</h2>
           <div className="flex items-center justify-between py-3 border-b border-ink/5">
             <span className="text-ink/70">Open Service Requests</span>
             <span className={`font-bold ${stats.activeRequests > 0 ? 'text-critical' : 'text-forest'}`}>
               {stats.activeRequests}
             </span>
           </div>
           <div className="flex items-center justify-between py-3">
             <span className="text-ink/70">System Status</span>
             <span className="font-bold text-forest">All systems operational</span>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-ink/5">
          <h2 className="text-xl font-bold mb-4">Welcome to LumiStay Admin</h2>
          <p className="text-ink/70 mb-4">You are viewing the real-time operational dashboard.</p>
          <ul className="list-disc list-inside space-y-2 text-ink/70 text-sm">
            <li>Check Orders to manage food & beverage requests</li>
            <li>Check Service Requests for room maintenance or amenities</li>
            <li>Manage QR Codes to rotate tokens for new guests</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
