import React from 'react';
import { getRoomsWithTokens, getAdminHotelId } from '@/lib/db/queries/admin';
import QRActions from '@/components/staff/QRActions';

export default async function AdminQRPage() {
  const hotelId = await getAdminHotelId();
  const rooms = await getRoomsWithTokens(hotelId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">QR Codes</h1>
        <button className="bg-forest text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-forest/90">
          Add Room
        </button>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-ink/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-warm-surface border-b border-ink/5">
                <th className="p-4 font-semibold text-ink/70">Room</th>
                <th className="p-4 font-semibold text-ink/70">QR Status</th>
                <th className="p-4 font-semibold text-ink/70">Last Scan</th>
                <th className="p-4 font-semibold text-ink/70 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-ink/50">
                    No rooms found.
                  </td>
                </tr>
              ) : rooms.map(room => (
                <tr key={room.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/5">
                  <td className="p-4">
                    <div className="font-bold">Room {room.label}</div>
                    <div className="text-xs text-ink/50">{room.floor || 'No Floor'}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                      room.isActive ? 'bg-forest/10 text-forest' : 'bg-critical/10 text-critical'
                    }`}>
                      {room.isActive ? 'active' : 'revoked'}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium text-ink/70">
                    {room.lastScannedAt ? new Date(room.lastScannedAt).toLocaleString() : '-'}
                  </td>
                  <td className="p-4 text-right">
                    <QRActions roomId={room.id} roomLabel={room.label} tokenHash={room.tokenHash} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
