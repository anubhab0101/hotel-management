import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { addMenuCategory, addMenuItem, deleteMenuCategory, deleteMenuItem } from './actions';
import { getAdminHotelId } from '@/lib/db/queries/admin';

export default async function MenuPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const hotelId = await getAdminHotelId();

  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*, menu_items(*)')
    .eq('hotel_id', hotelId)
    .order('sort_order');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Menu Management</h1>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-ink/5">
        <h2 className="text-xl font-bold mb-4">Add Menu Category</h2>
        <form action={addMenuCategory} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" name="name" required className="w-full border rounded-xl px-3 py-2" placeholder="e.g. Starters" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Description</label>
            <input type="text" name="description" className="w-full border rounded-xl px-3 py-2" placeholder="Optional" />
          </div>
          <button type="submit" className="bg-forest text-white px-6 py-2 rounded-xl font-medium">Add Category</button>
        </form>
      </div>

      {categories?.map((cat: any) => (
        <div key={cat.id} className="bg-white p-6 rounded-3xl shadow-sm border border-ink/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{cat.name}</h2>
            <form action={async () => {
              'use server';
              await deleteMenuCategory(cat.id);
            }}>
              <button type="submit" className="text-critical text-sm font-medium">Delete Category</button>
            </form>
          </div>
          
          <div className="space-y-4">
            {(cat.menu_items || []).map((item: any) => (
              <div key={item.id} className="flex items-center justify-between bg-warm-surface p-4 rounded-xl border border-ink/5">
                <div>
                  <p className="font-bold">{item.name} <span className="font-normal text-ink/60">({item.currency} {item.price_minor / 100})</span></p>
                  <p className="text-sm text-ink/70">{item.description}</p>
                </div>
                <form action={async () => {
                  'use server';
                  await deleteMenuItem(item.id);
                }}>
                  <button type="submit" className="text-critical text-sm font-medium">Delete</button>
                </form>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-ink/5">
            <h3 className="font-semibold mb-3">Add Item to {cat.name}</h3>
            <form action={addMenuItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <input type="hidden" name="category_id" value={cat.id} />
              
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" name="name" required className="w-full border rounded-xl px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input type="number" step="0.01" name="price" required className="w-full border rounded-xl px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" name="description" className="w-full border rounded-xl px-3 py-2" />
              </div>
              <button type="submit" className="bg-forest text-white px-6 py-2 rounded-xl font-medium w-full">Add Item</button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
