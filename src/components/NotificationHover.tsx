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
                    <Button className="border-[1px] border-gray-300 size-8 md:size-12 bg-transparent hover:bg-transparent cursor-pointer lg:size-12 xl:size-10 2xl:size-10 text-[#013479] hover:text-[#013479] shadow-none relative">
                        <Bell />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                            </span>
                        )}
                    </Button>
                </Link>
            </HoverCardTrigger>
            <HoverCardContent className="space-y-6 w-80">
                <div className="flex justify-between items-center">
                    <h2 className="text-[#474747] font-semibold text-base">
                        Notificações ({unreadNotificationsCount})
                    </h2>
                    <Link href="/notifications" className="text-[#009DFF] text-sm cursor-pointer hover:underline">
                        Ver Mais
                    </Link>
                </div>

                <div className="flex flex-col space-y-4 max-h-[300px] overflow-y-auto">
                    {isLoading ? (
                        <p className="text-gray-500 text-sm text-center py-4">Carregando...</p>
                    ) : error ? (
                        <p className="text-red-500 text-sm text-center py-4">{error}</p>
                    ) : notifications.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">Nenhuma notificação.</p>
                    ) : (
                        totalNotificationsUnread.slice(0, 4).map((notification) => (
                            <div
                                key={notification.id}
                                className="border-[2px] border-[#EDEFF6] flex flex-col space-y-1 border-l-4 rounded-lg p-3"
                                style={{ borderLeftColor: "#20C06B" }}
                            >
                                <span className="text-[#474747] font-semibold text-sm line-clamp-1">
                                    {notification.title}
                                </span>
                                <span className="text-gray-500 font-normal text-xs line-clamp-2">
                                    {notification.description}
                                </span>
                                <span className="text-[#969696] text-[10px] mt-1 text-right">
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