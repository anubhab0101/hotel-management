'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getAdminHotelId } from '@/lib/db/queries/admin';

export async function updateHotelBranding(formData: FormData) {
  const primaryColor = formData.get('primary_color') as string;
  const surfaceColor = formData.get('surface_color') as string;
  const textColor = formData.get('text_color') as string;
  const welcomeMessage = formData.get('welcome_message') as string;

  const hotelId = await getAdminHotelId();
  const supabase = await createClient();

  const { error } = await supabase.from('hotel_branding').upsert({
    hotel_id: hotelId,
    primary_color: primaryColor || '#254C3A',
    surface_color: surfaceColor || '#EFEAE2',
    text_color: textColor || '#171717',
    welcome_message: welcomeMessage || null
  }, { onConflict: 'hotel_id' });

  if (error) {
    console.error('Update branding error:', error);
  }

  revalidatePath('/admin/settings');
}
