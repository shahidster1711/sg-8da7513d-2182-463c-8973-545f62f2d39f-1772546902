import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "@/services/messageService";
import type { Conversation, Message } from "@/types";
import { Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function Messages() {
  const router = useRouter();
  const { toast } = useToast();
  const { listing: listingId } = router.query;

  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConv) {
      loadMessages(selectedConv.id);
      markMessagesAsRead(selectedConv.id, user.id);
    }
  }, [selectedConv]);

  // Subscribe to new messages
  useEffect(() => {
    if (!user || !selectedConv) return;

    const channel = supabase
      .channel(`messages:${selectedConv.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConv.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          if (payload.new.receiver_id === user.id) {
            markMessagesAsRead(selectedConv.id, user.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedConv]);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push("/auth/login");
    } else {
      setUser(session.user);
    }
  }

  async function loadConversations() {
    const { data } = await getConversations(user.id);
    setConversations(data || []);

    // If listingId in query, try to find or start conversation
    if (listingId && data && data.length > 0) {
      const conv = data.find((c) => c.listing_id === listingId);
      if (conv) {
        setSelectedConv(conv);
      }
    }

    setLoading(false);
  }

  async function loadMessages(conversationId: string) {
    const { data } = await getMessages(conversationId);
    setMessages(data || []);
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!messageText.trim() || !selectedConv) return;

    const receiverId =
      selectedConv.buyer_id === user.id
        ? selectedConv.seller_id
        : selectedConv.buyer_id;

    const { error } = await sendMessage(
      selectedConv.id,
      user.id,
      receiverId,
      selectedConv.listing_id,
      messageText
    );

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } else {
      setMessageText("");
    }
  }

  if (!user || loading) {
    return null;
  }

  return (
    <>
      <SEO
        title="Messages - AndamanBazaar"
        description="View your conversations"
      />

      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)]">
          <div className="grid grid-cols-1 md:grid-cols-3 h-full border-x border-gray-200 dark:border-gray-800">
            {/* Conversations List */}
            <Card className="md:col-span-1 rounded-none border-0 border-r border-gray-200 dark:border-gray-800">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Messages</h2>
              </div>
              <ScrollArea className="h-[calc(100vh-8rem)]">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConv(conv)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b ${
                        selectedConv?.id === conv.id
                          ? "bg-teal-50 dark:bg-teal-900/20"
                          : ""
                      }`}
                    >
                      <Avatar>
                        <AvatarImage src={conv.other_user?.avatar_url || ""} />
                        <AvatarFallback>
                          {conv.other_user?.full_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium truncate">
                          {conv.other_user?.full_name || "Anonymous"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conv.listing?.title}
                        </p>
                        {conv.last_message && (
                          <p className="text-xs text-gray-500 truncate">
                            {conv.last_message.content}
                          </p>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </ScrollArea>
            </Card>

            {/* Chat Area */}
            <div className="md:col-span-2 flex flex-col">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedConv(null)}
                      className="md:hidden"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar>
                      <AvatarImage
                        src={selectedConv.other_user?.avatar_url || ""}
                      />
                      <AvatarFallback>
                        {selectedConv.other_user?.full_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {selectedConv.other_user?.full_name || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedConv.listing?.title}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const isOwn = msg.sender_id === user.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${
                              isOwn ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                isOwn
                                  ? "bg-teal-600 text-white"
                                  : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isOwn
                                    ? "text-teal-100"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {formatDistanceToNow(new Date(msg.created_at), {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t flex gap-2"
                  >
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p>Select a conversation to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}