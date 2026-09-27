import React from 'react';
import { getActiveOrders, getAdminHotelId } from '@/lib/db/queries/admin';
import { Clock } from 'lucide-react';
import OrderActions from '@/components/staff/OrderActions';

export default async function AdminOrdersPage() {
  const hotelId = await getAdminHotelId();
  const orders = await getActiveOrders(hotelId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-ink/5 text-center mt-8">
          <p className="text-ink/70">No active orders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-ink/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-ink/5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-ink/70">
                    {order.status.replace('_', ' ')}
                  </div>
                  <div className="flex items-center text-ink/50 text-xs font-medium gap-1">
                    <Clock size={14} /> {order.timeAgo}
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-1">Room {order.roomLabel}</h3>
                <p className="text-ink/70 text-sm mb-4 leading-relaxed line-clamp-2">
                  {order.itemsSummary}
                </p>
                
                <div className="flex justify-between items-center text-sm font-semibold mb-6">
                  <span>{(order.totalMinor / 100).toLocaleString('en-IN', { style: 'currency', currency: order.currency })}</span>
                  <span className="text-ink/50 font-medium capitalize">{order.settlementMethod.replace('_', ' ')}</span>
                </div>
              </div>
              
              <OrderActions orderId={order.id} currentStatus={order.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
