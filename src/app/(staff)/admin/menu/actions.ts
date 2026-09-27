'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getAdminHotelId } from '@/lib/db/queries/admin';

export async function addMenuCategory(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  const hotelId = await getAdminHotelId();

  const supabase = await createClient();
  await supabase.from('menu_categories').insert({
    hotel_id: hotelId,
    name,
    description,
    sort_order: 0,
    is_active: true
  });

  revalidatePath('/admin/menu');
}

export async function deleteMenuCategory(id: string) {
  const supabase = await createClient();
  await supabase.from('menu_categories').delete().eq('id', id);
  revalidatePath('/admin/menu');
}

export async function addMenuItem(formData: FormData) {
  const categoryId = formData.get('category_id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const priceStr = formData.get('price') as string;
  const currency = formData.get('currency') as string || 'USD';
  const foodType = formData.get('food_type') as string;
  const isAvailable = formData.get('is_available') === 'on';

  const priceMinor = Math.round(parseFloat(priceStr) * 100);

  const hotelId = await getAdminHotelId();

  const supabase = await createClient();
  await supabase.from('menu_items').insert({
    hotel_id: hotelId,
    category_id: categoryId,
    name,
    description,
    price_minor: priceMinor,
    currency,
    food_type: foodType,
    is_available: isAvailable
  });

  revalidatePath('/admin/menu');
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient();
  await supabase.from('menu_items').delete().eq('id', id);
  revalidatePath('/admin/menu');
}
