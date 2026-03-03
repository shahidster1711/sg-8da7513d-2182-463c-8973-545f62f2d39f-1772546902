import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/types";

export async function getUnreadCount(userId: string) {
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("receiver_id", userId)
    .eq("read", false);

  if (error) {
    console.error("Error getting unread count:", error);
    return { count: 0, error };
  }

  return { count: count || 0, error: null };
}

export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .select(`
      *,
      listing:listings(*),
      buyer:profiles!conversations_buyer_id_fkey(*),
      seller:profiles!conversations_seller_id_fkey(*),
      last_message:messages(content, created_at, read)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    return { data: [], error };
  }

  // Process conversations to identify "other_user"
  const processedData = data.map((conv: any) => ({
    ...conv,
    other_user: conv.buyer_id === userId ? conv.seller : conv.buyer,
    last_message: conv.last_message?.[0] || null
  }));

  return { data: processedData, error: null };
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return { data: data as Message[], error };
}

export async function sendMessage(
  conversationId: string | null,
  senderId: string,
  receiverId: string,
  listingId: string,
  content: string
) {
  let convId = conversationId;

  // Create conversation if doesn't exist
  if (!convId) {
    // Check if conversation already exists for this listing and pair
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("listing_id", listingId)
      .or(`and(buyer_id.eq.${senderId},seller_id.eq.${receiverId}),and(buyer_id.eq.${receiverId},seller_id.eq.${senderId})`)
      .maybeSingle();

    if (existing) {
      convId = existing.id;
    } else {
      const { data: newConv, error: convError } = await supabase
        .from("conversations")
        .insert({
          listing_id: listingId,
          buyer_id: senderId,
          seller_id: receiverId,
        })
        .select()
        .single();

      if (convError) return { error: convError };
      convId = newConv.id;
    }
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: convId,
      sender_id: senderId,
      receiver_id: receiverId,
      listing_id: listingId,
      content,
      read: false,
    })
    .select()
    .single();

  return { data, error };
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", conversationId)
    .eq("receiver_id", userId)
    .eq("read", false);

  return { error };
}