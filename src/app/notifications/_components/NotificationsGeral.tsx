"use client"
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell, Check, X, CheckCheck, AlertCircle, Info, Calendar } from "@/lib/icons";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useNotificationStore } from "@/hooks/useNotifications";

export default function NotificationsGeral() {
  const { toast } = useToast();
  
  const { 
    isLoading, 
    unreadNotificationsCount, 
    notifications, 
    paginatedNotifications, 
    page, 
    pages, 
    fetchNotifications, 
    markAllAsRead, 
    markAsRead, 
    changePage 
  } = useNotificationStore();

  useEffect(() => {
    // Only fetch if we don't have notifications yet or to ensure it's fresh
    fetchNotifications();
  }, [fetchNotifications]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCheck className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'error': return <X className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-orange-500';
      default: return 'border-l-blue-500';
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast({
      title: "Sucesso",
      description: "Todas as notificações foram marcadas como lidas",
    });
  };

  const toggleReadStatus = async (id: string, currentlyRead: boolean) => {
    if (!currentlyRead) {
      await markAsRead(id);
    }
    // Note: To mark as unread we would need another endpoint. 
    // For now, if it's already read, we just do nothing or we could add an unread endpoint.
  };

  if (isLoading && notifications.length === 0) {
    return (
      <div className="p-6 space-y-4 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Bell className="w-6 h-6 text-primary absolute top-3 left-3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-8 h-8 text-primary" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notificações</h1>
            <p className="text-gray-600">{unreadNotificationsCount} não lidas de {notifications.length} total</p>
          </div>
        </div>
        
        {unreadNotificationsCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 transform hover:scale-105"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhuma notificação disponível</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`
                bg-white border-l-4 ${getPriorityColor(notification.priority)} 
                rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
                transform hover:-translate-y-1 animate-fade-in
                ${notification.isRead ? 'opacity-75' : 'border-r-2 border-r-blue-200'}
              `}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="p-4 flex justify-between items-start gap-4">
                <div className="flex gap-3 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${notification.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(notification.createdAt)}
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => toggleReadStatus(notification.id, notification.isRead)}
                  variant="ghost"
                  size="sm"
                  disabled={notification.isRead}
                  className={`
                    transition-all duration-200 hover:scale-105
                    ${notification.isRead 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-green-600 hover:bg-green-50'
                    }
                  `}
                >
                  {notification.isRead ? (
                    <>
                      <CheckCheck className="w-4 h-4 mr-2" />
                      Lida
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Marcar como lida
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => changePage(Math.max(1, page - 1))}
                  className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink 
                    onClick={() => changePage(p)}
                    isActive={page === p}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => changePage(Math.min(pages, page + 1))}
                  className={page === pages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}