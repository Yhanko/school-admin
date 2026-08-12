"use client"
import { Send, Paperclip, Loader2 } from "@/lib/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatUser } from "../page";
import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "@/service/api";
import { useAuth } from "@/store/useAuth";

interface ChatAreaProps {
  selectedUser: ChatUser | null;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export function ChatArea ({ selectedUser }: ChatAreaProps) {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/messages/conversation/${selectedUser.id}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchMessages();
    
    // Optional: Setup polling for real-time feel if WebSockets aren't available
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
      // Auto scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!newMessage.trim() || !selectedUser) return;

      setIsSending(true);
      try {
          await axiosInstance.post('/messages', {
              receiverId: selectedUser.id,
              content: newMessage
          });
          setNewMessage("");
          fetchMessages(); // Refresh immediately
      } catch (error) {
          console.error("Failed to send message", error);
      } finally {
          setIsSending(false);
      }
  };

  if (!selectedUser) {
      return (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
              <span className="text-6xl mb-4">💬</span>
              <p className="text-lg">Selecione um contacto para iniciar uma conversa</p>
          </div>
      );
  }

  const nameParts = (selectedUser.name || "User").split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const initials = `${firstName[0]}${lastName ? lastName[0] : ''}`.toUpperCase();

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-indigo-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">{selectedUser.name || "User"}</h2>
              <p className="text-sm text-gray-500">{selectedUser.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {isLoading && messages.length === 0 ? (
            <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        ) : messages.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
                Nenhuma mensagem encontrada. Diga olá! 👋
            </div>
        ) : (
            messages.map((msg) => {
                const isMine = currentUser && msg.senderId === currentUser.id;
                
                return (
                    <div key={msg.id} className={`flex items-end gap-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
                        {!isMine && (
                            <Avatar className="w-8 h-8 shrink-0">
                                <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                                {initials}
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`rounded-2xl px-4 py-3 max-w-md shadow-sm ${
                            isMine 
                            ? 'bg-indigo-500 text-white rounded-tr-sm' 
                            : 'bg-white text-gray-900 rounded-tl-sm'
                        }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                );
            })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4 shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escreva a sua mensagem..."
              className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            type="submit" 
            disabled={isSending || !newMessage.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 rounded-full w-12 h-12 p-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};