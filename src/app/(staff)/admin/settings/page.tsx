import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { updateHotelBranding } from './actions';
import { getAdminHotelId } from '@/lib/db/queries/admin';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const hotelId = await getAdminHotelId();

  const { data: branding } = await supabase
    .from('hotel_branding')
    .select('*')
    .eq('hotel_id', hotelId)
    .single();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hotel Settings</h1>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-ink/5 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Branding & Appearance</h2>
        
        <form action={updateHotelBranding} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Welcome Message</label>
            <textarea 
              name="welcome_message" 
              defaultValue={branding?.welcome_message || ''}
              className="w-full border rounded-xl px-3 py-2" 
              rows={3} 
              placeholder="e.g. Welcome to our hotel..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Color</label>
              <input type="color" name="primary_color" defaultValue={branding?.primary_color || '#254C3A'} className="w-full h-10 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Surface Color</label>
              <input type="color" name="surface_color" defaultValue={branding?.surface_color || '#EFEAE2'} className="w-full h-10 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Text Color</label>
              <input type="color" name="text_color" defaultValue={branding?.text_color || '#171717'} className="w-full h-10 border rounded-xl" />
            </div>
          </div>
          
          <button type="submit" className="bg-forest text-white px-6 py-2 rounded-xl font-medium mt-4">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
