import React from 'react';
import { getActiveRequests, getAdminHotelId } from '@/lib/db/queries/admin';
import { Clock } from 'lucide-react';
import RequestActions from '@/components/staff/RequestActions';

export default async function AdminRequestsPage() {
  const hotelId = await getAdminHotelId();
  const requests = await getActiveRequests(hotelId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Service Requests</h1>
      
      {requests.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-ink/5 text-center mt-8">
          <p className="text-ink/70">No active service requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map(req => (
            <div key={req.id} className="bg-white p-5 rounded-2xl shadow-sm border border-ink/5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-critical/10 text-critical px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {req.status.replace('_', ' ')}
                  </div>
                  <div className="flex items-center text-ink/50 text-xs font-medium gap-1">
                    <Clock size={14} /> {req.timeAgo}
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-1">Room {req.roomLabel}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-ink">{req.serviceName}</span>
                  {req.quantity && (
                    <span className="bg-warm-surface px-2 py-0.5 rounded-md text-xs font-bold text-ink/70">
                      Qty: {req.quantity}
                    </span>
                  )}
                </div>
                
                <div className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-4">
                  Dept: {req.department}
                </div>
                
                {req.guestNote && (
                  <div className="bg-warm-surface p-3 rounded-xl text-sm text-ink/80 italic mb-6">
                    &quot;{req.guestNote}&quot;
                  </div>
                )}
              </div>
              
              <RequestActions requestId={req.id} currentStatus={req.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
