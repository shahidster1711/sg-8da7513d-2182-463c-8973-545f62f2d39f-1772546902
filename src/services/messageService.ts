import { supabase } from "@/integrations/supabase/client";
import type { Conversation, Message } from "@/types";

export async function getOrCreateConversation(
  listingId: string,
  buyerId: string,
  sellerId: string
): Promise<{ data: Conversation | null; error: Error | null }> {
  try {
    // Try to find existing conversation
    const { data: existing, error: findError } = await supabase
      .from("conversations")
      .select("*")
      .eq("listing_id", listingId)
      .eq("buyer_id", buyerId)
      .eq("seller_id", sellerId)
      .maybeSingle();

    if (findError) throw findError;

    if (existing) {
      return { data: existing as Conversation, error: null };
    }

    // Create new conversation
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        listing_id: listingId,
        buyer_id: buyerId,
        seller_id: sellerId,
      })
      .select()
      .single();

    if (error) throw error;
    return { data: data as Conversation, error: null };
  } catch (error) {
    console.error("Error creating conversation:", error);
    return { data: null, error: error as Error };
  }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  receiverId: string,
  listingId: string,
  content: string
): Promise<{ data: Message | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        listing_id: listingId,
        content: content,
      })
      .select()
      .single();

    if (error) throw error;
    return { data: data as Message, error: null };
  } catch (error) {
    console.error("Error sending message:", error);
    return { data: null, error: error as Error };
  }
}

export async function getConversations(
  userId: string
): Promise<{ data: Conversation[]; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
        *,
        listings!conversations_listing_id_fkey(id, title, images, price, status),
        buyer_profile:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
        seller_profile:profiles!conversations_seller_id_fkey(id, full_name, avatar_url)
      `
      )
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const conversations = (data || []) as Conversation[];

    // Get last message and unread count for each conversation
    for (const conversation of conversations) {
      // Get last message
      const { data: lastMessage } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastMessage) {
        conversation.last_message = lastMessage as Message;
      }

      // Get unread count
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conversation.id)
        .eq("receiver_id", userId)
        .eq("read", false);

      conversation.unread_count = count || 0;
    }

    return { data: conversations, error: null };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return { data: [], error: error as Error };
  }
}

export async function getMessages(
  conversationId: string
): Promise<{ data: Message[]; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return { data: (data || []) as Message[], error: null };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { data: [], error: error as Error };
  }
}

export async function markMessagesAsRead(
  conversationId: string,
  userId: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", conversationId)
      .eq("receiver_id", userId)
      .eq("read", false);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { error: error as Error };
  }
}

export async function getUnreadCount(
  userId: string
): Promise<{ count: number; error: Error | null }> {
  try {
    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", userId)
      .eq("read", false);

    if (error) throw error;
    return { count: count || 0, error: null };
  } catch (error) {
    console.error("Error getting unread count:", error);
    return { count: 0, error: error as Error };
  }
}