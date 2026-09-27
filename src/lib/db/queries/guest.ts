'use server'

import { createClient } from '@/lib/supabase/server';

export type GuestContextType = {
  hotelId: string;
  roomId: string;
  hotelName: string;
  roomLabel: string;
  branding: {
    primaryColor: string;
    surfaceColor: string;
    textColor: string;
    logoPath: string | null;
    termsAndConditions?: string | null;
    privacyPolicy?: string | null;
    dataRetentionDays?: number;
  };
};

export type ActiveOrderType = {
  id: string;
  type: 'order' | 'request';
  title: string;
  status: 'Received' | 'Accepted' | 'Preparing' | 'On the way' | 'Delivered' | string;
  timeAgo: string;
};

export async function resolveQrToken(token: string): Promise<GuestContextType | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('room_qr_tokens')
    .select(`
      hotel_id,
      room_id,
      hotels ( name ),
      rooms ( label, room_number )
    `)
    .eq('token_hash', token)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  
  const { data: branding } = await supabase
    .from('hotel_branding')
    .select('*')
    .eq('hotel_id', data.hotel_id)
    .single();

  return {
    hotelId: data.hotel_id,
    roomId: data.room_id,
    hotelName: (data.hotels as any /* eslint-disable-line @typescript-eslint/no-explicit-any */).name,
    roomLabel: (data.rooms as any).label || (data.rooms as any).room_number, // eslint-disable-line @typescript-eslint/no-explicit-any
    branding: {
      primaryColor: branding?.primary_color || '#254C3A',
      surfaceColor: branding?.surface_color || '#EFEAE2',
      textColor: branding?.text_color || '#171717',
      logoPath: branding?.logo_path || null,
      termsAndConditions: branding?.terms_and_conditions || null,
      privacyPolicy: branding?.privacy_policy || null,
      dataRetentionDays: branding?.data_retention_days || 30,
    },
  };
}

export type MenuItemType = {
  id: string;
  name: string;
  description: string;
  priceMinor: number;
  currency: string;
  foodType: 'veg' | 'non_veg' | 'veg_egg' | string;
  isAvailable: boolean;
};

export type MenuCategoryType = {
  id: string;
  name: string;
  items: MenuItemType[];
};

export async function getMenu(hotelId: string): Promise<MenuCategoryType[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('menu_categories')
    .select(`
      id,
      name,
      menu_items (
        id, name, description, price_minor, currency, food_type, is_available, sort_order
      )
    `)
    .eq('hotel_id', hotelId)
    .eq('is_active', true)
    .order('sort_order');

  if (error || !data) return [];

  return data.map((cat: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => ({
    id: cat.id,
    name: cat.name,
    items: ((cat.menu_items as any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */) || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        priceMinor: item.price_minor,
        currency: item.currency,
        foodType: item.food_type,
        isAvailable: item.is_available,
    }))
  }));
}

export async function placeOrder(roomId: string, cartData: any /* eslint-disable-line @typescript-eslint/no-explicit-any */): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const supabase = await createClient();
  const { data: room } = await supabase.from('rooms').select('hotel_id').eq('id', roomId).single();
  if (!room) return { success: false, error: 'Room not found' };

  const publicId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
  let subtotalMinor = 0;
  for (const item of cartData.items) {
    subtotalMinor += item.menuItem.priceMinor * item.quantity;
  }
  const taxMinor = Math.round(subtotalMinor * 0.05);
  const totalMinor = subtotalMinor + taxMinor;

  const { data: order, error } = await supabase.from('orders').insert({
    public_id: publicId,
    hotel_id: room.hotel_id,
    room_id: roomId,
    status: 'placed',
    subtotal_minor: subtotalMinor,
    tax_minor: taxMinor,
    total_minor: totalMinor,
    currency: cartData.items[0]?.menuItem?.currency || 'INR',
    settlement_method: cartData.settlement || 'room_charge',
    guest_note: cartData.guestNote || null
  }).select('id').single();

  if (error || !order) return { success: false, error: error?.message };

  const orderItems = cartData.items.map((item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => ({
    order_id: order.id,
    menu_item_id: item.menuItem.id,
    item_name_snapshot: item.menuItem.name,
    unit_price_minor: item.menuItem.priceMinor,
    quantity: item.quantity,
    line_total_minor: item.menuItem.priceMinor * item.quantity
  }));

  await supabase.from('order_items').insert(orderItems);

  return { success: true, orderId: order.id };
}

export async function placeServiceRequest(
  roomId: string,
  requestType: string,
  note?: string,
  quantity?: number
): Promise<{ success: boolean; requestId?: string; error?: string }> {
  const supabase = await createClient();
  const { data: room } = await supabase.from('rooms').select('hotel_id').eq('id', roomId).single();
  if (!room) return { success: false, error: 'Room not found' };

  let serviceTypeId = null;
  if (requestType !== 'custom') {
    const { data: svc } = await supabase.from('service_types')
      .select('id')
      .eq('hotel_id', room.hotel_id)
      .eq('name', requestType)
      .single();
    if (svc) serviceTypeId = svc.id;
  }

  if (!serviceTypeId) {
    let { data: customSvc } = await supabase.from('service_types')
      .select('id')
      .eq('hotel_id', room.hotel_id)
      .eq('name', 'Custom')
      .single();
    if (!customSvc) {
      const { data: newSvc } = await supabase.from('service_types').insert({
        hotel_id: room.hotel_id,
        name: 'Custom',
        department: 'front_desk',
        allow_note: true
      }).select('id').single();
      customSvc = newSvc;
    }
    serviceTypeId = customSvc?.id;
  }

  if (!serviceTypeId) return { success: false, error: 'Service type not found' };

  const publicId = 'REQ-' + Math.floor(1000 + Math.random() * 9000);
  const { data, error } = await supabase.from('service_requests').insert({
    public_id: publicId,
    hotel_id: room.hotel_id,
    room_id: roomId,
    service_type_id: serviceTypeId,
    guest_note: note || null,
    quantity: quantity || null,
    status: 'submitted'
  }).select('id').single();

  if (error) return { success: false, error: error.message };
  return { success: true, requestId: data.id };
}

export async function getActiveOrdersAndRequests(roomId: string): Promise<ActiveOrderType[]> {
  try {
    const supabase = await createClient();
    const { data: orders } = await supabase.from('orders')
      .select('id, public_id, status, created_at')
      .eq('room_id', roomId)
      .neq('status', 'completed')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false });

    const { data: requests } = await supabase.from('service_requests')
      .select('id, service_types(name), status, created_at')
      .eq('room_id', roomId)
      .neq('status', 'completed')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false });

    const items: any /* eslint-disable-line @typescript-eslint/no-explicit-any */[] = [];
    
    if (orders) {
      for (const o of orders) {
        items.push({
          id: o.id,
          type: 'order',
          title: 'Order ' + o.public_id,
          status: o.status,
          createdAt: new Date(o.created_at).getTime(),
          timeAgo: 'Just now'
        });
      }
    }

    if (requests) {
      for (const r of requests) {
        items.push({
          id: r.id,
          type: 'request',
          title: (r.service_types as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.name || 'Service Request',
          status: r.status,
          createdAt: new Date(r.created_at).getTime(),
          timeAgo: 'Just now'
        });
      }
    }

    return items.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export type HotelGuideBlock = {
  id: string;
  iconType: 'Clock' | 'Coffee' | 'Waves' | 'Info' | string;
  title: string;
  content: string;
};

export async function getHotelGuide(hotelId: string): Promise<HotelGuideBlock[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('hotel_content_blocks')
    .select('*')
    .eq('hotel_id', hotelId)
    .eq('is_active', true)
    .order('sort_order');
    
  if (!data || data.length === 0) {
    return [
       { id: 'guide-1', iconType: 'Info', title: 'Welcome', content: 'No policies available.' }
    ];
  }
  
  return data.map((d: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => ({
    id: d.id,
    iconType: d.type,
    title: d.title,
    content: typeof d.body === 'string' ? d.body : (d.body as any /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.text || JSON.stringify(d.body)
  }));
}
