'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addHotel(formData: FormData) {
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const timezone = formData.get('timezone') as string;

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  if (user.email !== 'admin@lumistay.com' && user.email !== 'superadmin@hotel.com') {
    const { data } = await supabase.from('staff_profiles').select('role').eq('id', user.id).single();
    if (!data || data.role !== 'super_admin') {
      throw new Error("Forbidden");
    }
  }

  await supabase.from('hotels').insert({
    name,
    slug,
    timezone: timezone || 'UTC',
    status: 'active'
  });

  revalidatePath('/superadmin');
}
