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
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Messages</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {inbox.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Sem mensagens recentes.</p>
        ) : (
          inbox.slice(0, 4).map((item, index) => (
            <div key={item.lastMessage?.id || index} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-700 font-medium text-sm">{getInitials(item.contact?.name || "?")}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900 text-sm">{item.contact?.name}</p>
                  <span className="text-xs text-gray-500">{item.lastMessage?.createdAt ? format(new Date(item.lastMessage.createdAt), 'HH:mm') : ''}</span>
                </div>
                <p className="text-xs text-gray-600 truncate">{item.lastMessage?.isSender ? 'Tu: ' : ''}{item.lastMessage?.content}</p>
              </div>
            </div>
          ))
        )}
        <Button variant="link" className="w-full text-[#6366f1] text-sm">
          View More
        </Button>
      </CardContent>
    </Card>
  );
};
