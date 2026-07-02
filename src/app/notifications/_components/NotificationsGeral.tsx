"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell, Check, X, CheckCheck, AlertCircle, Info, Calendar } from "@/lib/icons";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import axiosInstance from "@/service/api";

interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  isRead: boolean;
  type: string;
  priority: 'low' | 'medium' | 'high';
}

export default function NotificationsGeral() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/notifications');
      
      const mappedNotifications = response.data.map((notification: any) => {
        return {
          id: notification.id,
          title: notification.title,
          description: notification.description,
          date: notification.createdAt,
          isRead: notification.isRead,
          type: notification.type,
          priority: notification.priority
        };
      });

      // Ordenar por data decrescente (mais recentes primeiro)
      mappedNotifications.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setNotifications(mappedNotifications);
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Falha ao carregar notificações', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-orange-500';
      default: return 'border-l-blue-500';
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast({
        title: "Sucesso",
        description: "Todas as notificações foram marcadas como lidas",
      });
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Falha ao marcar como lido', variant: 'destructive' });
    }
  };

  const toggleReadStatus = async (id: string) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(n => 
          n.id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Falha ao marcar notificação como lida', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Bell className="w-6 h-6 text-blue-600 absolute top-3 left-3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-8 h-8 text-blue-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notificações</h1>
            <p className="text-gray-600">{unreadCount} não lidas de {notifications.length} total</p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 transform hover:scale-105"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
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
                rounded-lg shadow-sm hover:shadow-md transition-all duration-300 
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
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      )}
                    </div>
                    <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDate(notification.date)}
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => toggleReadStatus(notification.id)}
                  variant="ghost"
                  size="sm"
                  className={`
                    transition-all duration-200 hover:scale-105
                    ${notification.isRead 
                      ? 'text-orange-600 hover:bg-orange-50' 
                      : 'text-green-600 hover:bg-green-50'
                    }
                  `}
                >
                  {notification.isRead ? (
                    <>
                      <Bell className="w-4 h-4 mr-2" />
                      Marcar como não lida
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
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}