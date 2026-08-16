"use client";

import React from "react";
import { MessageCircle, ArrowRight } from "@/lib/icons";
import { format } from "date-fns";
import Link from "next/link";

interface InboxItem {
  contact?: { name?: string };
  lastMessage?: {
    id?: string;
    content?: string;
    createdAt?: string;
    isSender?: boolean;
  };
}

export function MessagesWidget({ inbox = [] }: { inbox?: InboxItem[] }) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-[#121212] border border-[#414042] rounded-lg p-5 font-hanken text-[#e5e2e1] space-y-4">
      <div className="flex items-center justify-between border-b border-[#414042] pb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#8B5CF6]" />
          <h2 className="headline-sm text-[#e5e2e1]">Mensagens Recentes</h2>
        </div>
        <span className="label-caps text-[10px] text-[#9d8f78]">INBOX</span>
      </div>

      <div className="space-y-3">
        {inbox.length === 0 ? (
          <p className="text-xs text-[#9d8f78] italic text-center py-6">
            Sem novas mensagens na caixa de entrada.
          </p>
        ) : (
          inbox.slice(0, 4).map((item, index) => (
            <div
              key={item.lastMessage?.id || index}
              className="flex items-start gap-3 p-2.5 rounded bg-[#1c1b1b] border border-[#414042] hover:border-[#C0C2C5] transition-all"
            >
              <div className="w-8 h-8 bg-[#201f1f] border border-[#414042] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#DDD6FE] data-mono font-bold text-xs">
                  {getInitials(item.contact?.name || "?")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="font-semibold text-[#e5e2e1] text-xs sm:text-sm truncate">
                    {item.contact?.name || "Contacto"}
                  </p>
                  <span className="text-[10px] text-[#9d8f78] data-mono shrink-0 ml-2">
                    {item.lastMessage?.createdAt
                      ? format(new Date(item.lastMessage.createdAt), "HH:mm")
                      : ""}
                  </span>
                </div>
                <p className="text-xs text-[#d5c4ac] truncate">
                  {item.lastMessage?.isSender ? "Tu: " : ""}
                  {item.lastMessage?.content || "Sem pré-visualização"}
                </p>
              </div>
            </div>
          ))
        )}

        <Link
          href="/chat"
          className="w-full flex items-center justify-center gap-1.5 pt-2 text-xs text-[#DDD6FE] hover:text-[#8B5CF6] font-semibold transition-colors"
        >
          <span>Abrir Central de Mensagens</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
