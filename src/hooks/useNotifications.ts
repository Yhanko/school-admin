import { create } from "zustand";
import { Notification } from "../types/types";
import axiosInstance from "@/service/api";

interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  page: number;
  notificationsPerPage: number;
  unreadNotificationsCount: number;
  pages: number;
  paginatedNotifications: Notification[];
  fetchNotifications: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  changePage: (page: number) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,
  page: 1,
  notificationsPerPage: 5,
  unreadNotificationsCount: 0,
  pages: 1,
  paginatedNotifications: [],

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/notifications');
      
      const mappedNotifications = response.data.map((notification: any) => ({
        id: notification.id,
        title: notification.title,
        description: notification.description,
        createdAt: notification.createdAt,
        isRead: notification.isRead,
        type: notification.type,
        priority: notification.priority
      }));

      // Ordenar por data decrescente
      mappedNotifications.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      const unreadCount = mappedNotifications.filter((msg: Notification) => !msg.isRead).length;
      const totalPages = Math.ceil(mappedNotifications.length / get().notificationsPerPage);
      const safePage = Math.min(get().page, totalPages || 1);
      const paginated = mappedNotifications.slice(
        (safePage - 1) * get().notificationsPerPage,
        safePage * get().notificationsPerPage
      );

      set({
        notifications: mappedNotifications,
        unreadNotificationsCount: unreadCount,
        pages: totalPages,
        paginatedNotifications: paginated,
        page: safePage,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: 'Falha ao carregar notificações' });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      
      const newNotifications = get().notifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      );
      
      const unreadCount = newNotifications.filter((msg: Notification) => !msg.isRead).length;
      const paginated = newNotifications.slice(
        (get().page - 1) * get().notificationsPerPage,
        get().page * get().notificationsPerPage
      );

      set({
        notifications: newNotifications,
        unreadNotificationsCount: unreadCount,
        paginatedNotifications: paginated
      });
    } catch (error) {
      console.error("Falha ao marcar como lida", error);
    }
  },

  markAllAsRead: async () => {
    try {
      await axiosInstance.patch('/notifications/read-all');
      
      const newNotifications = get().notifications.map(notification => ({
        ...notification,
        isRead: true,
      }));
      
      const paginated = newNotifications.slice(
        (get().page - 1) * get().notificationsPerPage,
        get().page * get().notificationsPerPage
      );

      set({
        notifications: newNotifications,
        unreadNotificationsCount: 0,
        paginatedNotifications: paginated
      });
    } catch (error) {
      console.error("Falha ao marcar todas como lidas", error);
    }
  },

  changePage: (page: number) => {
    const totalPages = get().pages;
    const notificationsPerPage = get().notificationsPerPage;

    if (page >= 1 && page <= totalPages) {
      const paginated = get().notifications.slice(
        (page - 1) * notificationsPerPage,
        page * notificationsPerPage
      );
      set({ page, paginatedNotifications: paginated });
    }
  },
}));
