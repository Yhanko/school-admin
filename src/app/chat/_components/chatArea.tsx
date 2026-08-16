"use client"
import { Send, Paperclip, Loader2 } from "@/lib/icons";
import { z } from "zod";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatUser } from "../page";
import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "@/service/api";
import { useAuth } from "@/store/useAuth";
import { ChevronLeft } from "lucide-react";

const messageSchema = z.object({
  newMessage: z.string().trim().min(1, "Mensagem não pode estar vazia").max(2000, "Mensagem demasiado longa").regex(/^[^<>';=]*$/, "Caracteres inválidos (Não use < > ' ; =)")
});

interface ChatAreaProps {
  selectedUser: ChatUser | null;
  onBack?: () => void;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export function ChatArea ({ selectedUser, onBack }: ChatAreaProps) {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newMessage.trim() || !selectedUser) return;

    try {
      messageSchema.parse({ newMessage });
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
      return;
    }
  
    setIsSending(true);
    try {
      await axiosInstance.post('/messages', {
        receiverId: selectedUser.id,
        content: newMessage
      });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-muted text-muted-foreground p-6">
        <span className="text-5xl sm:text-6xl mb-4">💬</span>
        <p className="text-sm sm:text-lg text-center">Selecione um contacto para iniciar uma conversa</p>
      </div>
    );
  }

  const nameParts = (selectedUser.name || "User").split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const initials = `${firstName[0]}${lastName ? lastName[0] : ''}`.toUpperCase();

  return (
    <div className="flex-1 flex flex-col bg-muted h-full min-w-0">
      {/* Chat Header */}
      <div className="bg-card border-b border-border p-3 sm:p-4 shrink-0">
        <div className="flex items-center gap-3">
          {/* Back button — only visible on mobile */}
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="sm:hidden h-9 w-9 p-0 text-muted-foreground hover:text-foreground shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <Avatar className="w-9 h-9 sm:w-10 sm:h-10 shrink-0">
            <AvatarFallback className="bg-primary text-white text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h2 className="font-semibold text-sm sm:text-base text-foreground truncate">{selectedUser.name || "User"}</h2>
            <p className="text-xs text-muted-foreground truncate">{selectedUser.role}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-3 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto relative">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Nenhuma mensagem encontrada. Diga olá! 👋
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = currentUser && msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex items-end gap-2 sm:gap-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
                {!isMine && (
                  <Avatar className="w-7 h-7 sm:w-8 sm:h-8 shrink-0">
                    <AvatarFallback className="bg-indigo-100 text-primary text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 max-w-[75%] sm:max-w-md shadow-sm ${
                  isMine
                  ? 'bg-primary text-white rounded-tr-sm'
                  : 'bg-card text-foreground rounded-tl-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMine ? 'text-indigo-200' : 'text-muted-foreground'}`}>
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
      <div className="bg-card border-t border-border p-3 sm:p-4 shrink-0 flex flex-col gap-1">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                if(errors.newMessage) setErrors({});
              }}
              placeholder="Escreva a sua mensagem..."
              className={`w-full pl-4 pr-10 py-2.5 sm:py-3 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${errors.newMessage ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200' : 'border-border'}`}
            />
            <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground h-7 w-7 p-0 hover:bg-transparent cursor-pointer">
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>
          <Button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-10 h-10 sm:w-12 sm:h-12 p-0 flex items-center justify-center disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
        {errors.newMessage && <p className="text-red-500 text-xs ml-4">{errors.newMessage}</p>}
      </div>
    </div>
  );
};