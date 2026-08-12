"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface InboxItem {
  contact?: { name?: string };
  lastMessage?: { id?: string; content?: string; createdAt?: string; isSender?: boolean };
}

export function MessagesWidget({ inbox = [] }: { inbox?: InboxItem[] }) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <Card className="bg-white overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg font-bold text-gray-900">Mensagens Recentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {inbox.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">Sem mensagens recentes.</p>
        ) : (
          inbox.slice(0, 4).map((item, index) => (
            <div key={item.lastMessage?.id || index} className="flex items-start gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-purple-700 font-semibold text-xs">{getInitials(item.contact?.name || "?")}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{item.contact?.name}</p>
                  <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                    {item.lastMessage?.createdAt ? format(new Date(item.lastMessage.createdAt), 'HH:mm') : ''}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{item.lastMessage?.isSender ? 'Tu: ' : ''}{item.lastMessage?.content}</p>
              </div>
            </div>
          ))
        )}
        <Button variant="link" className="w-full text-[#6366f1] text-xs sm:text-sm font-semibold pt-2">
          Ver Mais Mensagens →
        </Button>
      </CardContent>
    </Card>
  );
}
