'use server'

import { createClient } from '@/lib/supabase/server';

export async function getAdminHotelId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data } = await supabase.from('staff_profiles').select('hotel_id').eq('id', user.id).single();
  if (!data?.hotel_id) {
    throw new Error('No hotel associated with this staff account.');
  }
  return data.hotel_id;
}

export type AdminOrderType = {
  id: string;
  publicId: string;
  roomId: string;
  roomLabel: string;
  status: 'placed' | 'accepted' | 'preparing' | 'on_the_way' | 'completed' | 'cancelled' | string;
  itemsSummary: string;
  totalMinor: number;
  currency: string;
  settlementMethod: string;
  timeAgo: string;
  createdAt: string;
};

export type AdminRequestType = {
  id: string;
  publicId: string;
  roomId: string;
  roomLabel: string;
  serviceName: string;
  department: string;
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'completed' | 'cancelled' | string;
  quantity: number | null;
  guestNote: string | null;
  timeAgo: string;
  createdAt: string;
};

export async function getActiveOrders(hotelId: string): Promise<AdminOrderType[]> {
  try {
    const supabase = await createClient();
    const { data: orders } = await supabase.from('orders')
      .select(`
        id, public_id, status, subtotal_minor, total_minor, currency, settlement_method, created_at,
        rooms ( id, label, room_number ),
        order_items ( quantity, item_name_snapshot )
      `)
      .eq('hotel_id', hotelId)
      .neq('status', 'completed')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false });
      
    if (!orders) return [];
    
    return orders.map((o: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => ({
      id: o.id,
      publicId: o.public_id,
      roomId: o.rooms?.id || '',
      roomLabel: o.rooms?.label || o.rooms?.room_number || '',
      status: o.status,
      itemsSummary: (o.order_items as any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */)?.map(i => `${i.quantity} × ${i.item_name_snapshot}`).join(', '),
      totalMinor: o.total_minor,
      currency: o.currency,
      settlementMethod: o.settlement_method,
      timeAgo: 'Just now',
      createdAt: o.created_at
    }));
  } catch {
    return [];
  }
}

export async function getActiveRequests(hotelId: string): Promise<AdminRequestType[]> {
  try {
    const supabase = await createClient();
    const { data: requests } = await supabase.from('service_requests')
      .select(`
        id, public_id, status, quantity, guest_note, created_at,
        rooms ( id, label, room_number ),
        service_types ( name, department )
      `)
      .eq('hotel_id', hotelId)
      .neq('status', 'completed')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false });
      
    if (!requests) return [];
    
    return requests.map((r: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => ({
      id: r.id,
      publicId: r.public_id,
      roomId: r.rooms?.id || '',
      roomLabel: r.rooms?.label || r.rooms?.room_number || '',
      serviceName: r.service_types?.name || 'Unknown',
      department: r.service_types?.department || 'Unknown',
      status: r.status,
      quantity: r.quantity,
      guestNote: r.guest_note,
      timeAgo: 'Just now',
      createdAt: r.created_at
    }));
  } catch {
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('orders')
      .update({ status })
      .eq('id', orderId);
      
    if (error) {
      console.error('updateOrderStatus error:', error);
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    console.error('updateOrderStatus catch error:', error);
    return { success: false };
  }
}

export async function updateRequestStatus(requestId: string, status: string): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('service_requests')
      .update({ status })
      .eq('id', requestId);
      
    if (error) {
      console.error('updateRequestStatus error:', error);
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    console.error('updateRequestStatus catch error:', error);
    return { success: false };
  }
}

export type AdminRoomQRType = {
  id: string;
  roomNumber: string;
  floor: string;
  label: string;
  status: string;
  tokenHash: string | null;
  tokenId: string | null;
  lastScannedAt: string | null;
  isActive: boolean;
};

export async function getRoomsWithTokens(hotelId: string): Promise<AdminRoomQRType[]> {
  try {
    const supabase = await createClient();
    const { data: rooms } = await supabase.from('rooms')
      .select(`
        id, room_number, floor, label, status,
        room_qr_tokens (
          id, token_hash, is_active, last_scanned_at
        )
      `)
      .eq('hotel_id', hotelId)
      .order('room_number', { ascending: true });
      
    if (!rooms) return [];
    
    return rooms.map((r: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
      // get active token if any
      const tokens = r.room_qr_tokens || [];
      const activeToken = tokens.find((t: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => t.is_active);
      
      return {
        id: r.id,
        roomNumber: r.room_number,
        floor: r.floor || '',
        label: r.label || r.room_number,
        status: r.status,
        tokenHash: activeToken ? activeToken.token_hash : null,
        tokenId: activeToken ? activeToken.id : null,
        lastScannedAt: activeToken ? activeToken.last_scanned_at : null,
        isActive: activeToken ? true : false
      };
    });
  } catch {
    return [];
  }
}

export async function rotateRoomToken(roomId: string): Promise<{ success: boolean; newTokenHash?: string }> {
  try {
    const supabase = await createClient();
    
    // Create a new token hash
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    const newTokenHash = Array.from(array, dec => dec.toString(16).padStart(8, '0')).join('') + Date.now().toString(16);

    // Mark all current active tokens as inactive
    await supabase.from('room_qr_tokens')
      .update({ is_active: false, revoked_at: new Date().toISOString() })
      .eq('room_id', roomId)
      .eq('is_active', true);
      
    // Need hotel_id, fetch it first
    const { data: roomData } = await supabase.from('rooms').select('hotel_id').eq('id', roomId).single();
    if (!roomData) return { success: false };

    // Insert new token
    const { error } = await supabase.from('room_qr_tokens')
      .insert({
        hotel_id: roomData.hotel_id,
        room_id: roomId,
        token_hash: newTokenHash,
        is_active: true
      });
      
    // Scrub PII (DPDP Right to Erasure) from completed orders and requests for this room
    const { data: completedOrders } = await supabase.from('orders')
      .select('id')
      .eq('room_id', roomId)
      .eq('status', 'completed');

    if (completedOrders && completedOrders.length > 0) {
      const orderIds = completedOrders.map((o: { id: string }) => o.id);
      await supabase.from('order_items')
        .update({ guest_note: null })
        .in('order_id', orderIds);
    }

    await supabase.from('orders')
      .update({ guest_note: null })
      .eq('room_id', roomId)
      .eq('status', 'completed');

    await supabase.from('service_requests')
      .update({ guest_note: null })
      .eq('room_id', roomId)
      .eq('status', 'completed');

    if (error) {
      console.error('rotateRoomToken error:', error);
      return { success: false };
    }
    
    return { success: true, newTokenHash };
  } catch (error) {
    console.error('rotateRoomToken error:', error);
    return { success: false };
  }
}

export async function getDashboardStats(hotelId: string) {
  try {
    const supabase = await createClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get today's orders
    const { data: orders } = await supabase.from('orders')
      .select('total_minor, status')
      .eq('hotel_id', hotelId)
      .gte('created_at', today.toISOString());
      
    // Get active requests
    const { data: requests } = await supabase.from('service_requests')
      .select('id')
      .eq('hotel_id', hotelId)
      .neq('status', 'completed')
      .neq('status', 'cancelled');
      
    // Get today's QR scans
    const { data: qrTokens } = await supabase.from('room_qr_tokens')
      .select('last_scanned_at')
      .eq('hotel_id', hotelId)
      .gte('last_scanned_at', today.toISOString());
      
    const ordersToday = orders ? orders.length : 0;
    const revenueMinor = orders ? orders.reduce((sum: number, o: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => sum + o.total_minor, 0) : 0;
    const activeRequests = requests ? requests.length : 0;
    const qrOpens = qrTokens ? qrTokens.length : 0;
    
    return {
      ordersToday,
      revenueMinor,
      activeRequests,
      qrOpens
    };
  } catch {
    return {
      ordersToday: 0,
      revenueMinor: 0,
      activeRequests: 0,
      qrOpens: 0
    };
  }
}

