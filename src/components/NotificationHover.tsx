"use client";
//Componentes
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
//icones e imagens
import { Bell } from "@/lib/icons";
//Bibliotecas
import Link from "next/link";
import { format } from 'date-fns';
import { useEffect } from "react";
//Hooks
import { useNotificationStore } from "@/hooks/useNotifications";

export function NotificationsHover() {
    const { notifications, isLoading, error, unreadNotificationsCount, fetchNotifications } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const totalNotificationsUnread = notifications.filter(msg => !msg.isRead);

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Link href="/notifications">
                    <Button className="border border-[#414042] size-8 md:size-10 bg-[#201f1f] hover:bg-[#2a2a2a] hover:border-[#C0C2C5] cursor-pointer text-[#d5c4ac] hover:text-[#e5e2e1] shadow-none relative rounded">
                        <Bell className="w-4 h-4" />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#8B5CF6] text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-[0_0_8px_rgba(139, 92, 246,0.5)]">
                                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                            </span>
                        )}
                    </Button>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="space-y-4 w-80 bg-[#1A1A1A] border border-[#C0C2C5] text-[#e5e2e1] shadow-[0_0_24px_rgba(139, 92, 246,0.1)] p-4 rounded-lg">
                <div className="flex justify-between items-center border-b border-[#414042] pb-2.5">
                    <h2 className="text-[#e5e2e1] font-semibold text-sm">
                        Notificações ({unreadNotificationsCount})
                    </h2>
                    <Link href="/notifications" className="text-[#8B5CF6] text-xs font-medium cursor-pointer hover:underline">
                        Ver Mais
                    </Link>
                </div>

                <div className="flex flex-col space-y-2.5 max-h-[300px] overflow-y-auto">
                    {isLoading ? (
                        <p className="text-[#9d8f78] text-xs text-center py-4">Carregando...</p>
                    ) : error ? (
                        <p className="text-[#ffb4ab] text-xs text-center py-4">{error}</p>
                    ) : notifications.length === 0 ? (
                        <p className="text-[#9d8f78] text-xs text-center py-4">Nenhuma notificação.</p>
                    ) : (
                        totalNotificationsUnread.slice(0, 4).map((notification) => (
                            <div
                                key={notification.id}
                                className="bg-[#201f1f] border border-[#414042] border-l-2 border-l-[#8B5CF6] flex flex-col space-y-1 rounded p-2.5"
                            >
                                <span className="text-[#e5e2e1] font-semibold text-xs line-clamp-1">
                                    {notification.title}
                                </span>
                                <span className="text-[#d5c4ac] font-normal text-[11px] line-clamp-2">
                                    {notification.description}
                                </span>
                                <span className="text-[#9d8f78] data-mono text-[9px] mt-0.5 text-right">
                                    {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm')}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}