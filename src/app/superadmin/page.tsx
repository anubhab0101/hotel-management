import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { addHotel } from './actions';

export default async function SuperAdminPage() {
  const supabase = await createClient();

  const { data: hotels } = await supabase
    .from('hotels')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hotels Management</h1>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-ink/5">
        <h2 className="text-xl font-bold mb-4">Add New Hotel</h2>
        <form action={addHotel} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Hotel Name</label>
            <input type="text" name="name" required className="w-full border rounded-xl px-3 py-2" placeholder="e.g. Grand Plaza" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input type="text" name="slug" required className="w-full border rounded-xl px-3 py-2" placeholder="e.g. grand-plaza" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Timezone</label>
            <input type="text" name="timezone" defaultValue="UTC" className="w-full border rounded-xl px-3 py-2" />
          </div>
          <button type="submit" className="bg-forest text-white px-6 py-2 rounded-xl font-medium">Create Hotel</button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-ink/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-warm-surface border-b border-ink/5">
            <tr>
              <th className="px-6 py-4 font-semibold text-ink/70">Name</th>
              <th className="px-6 py-4 font-semibold text-ink/70">Slug</th>
              <th className="px-6 py-4 font-semibold text-ink/70">Timezone</th>
              <th className="px-6 py-4 font-semibold text-ink/70">Status</th>
              <th className="px-6 py-4 font-semibold text-ink/70">Created At</th>
            </tr>
          </thead>
          <tbody>
            {(hotels || []).map((hotel: any) => (
              <tr key={hotel.id} className="border-b border-ink/5 last:border-0">
                <td className="px-6 py-4 font-medium">{hotel.name}</td>
                <td className="px-6 py-4 text-ink/70">{hotel.slug}</td>
                <td className="px-6 py-4 text-ink/70">{hotel.timezone}</td>
                <td className="px-6 py-4">
                  <span className="bg-forest/10 text-forest px-3 py-1 rounded-full text-sm font-medium">
                    {hotel.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-ink/70">
                  {new Date(hotel.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
