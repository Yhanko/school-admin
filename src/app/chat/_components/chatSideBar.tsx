"use client"
import { Search, Loader2 } from "@/lib/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axiosInstance from "@/service/api";
import { ChatUser } from "../page";

interface ChatSidebarProps {
  onSelectUser: (user: ChatUser) => void;
  selectedUserId?: string;
}

export function ChatSidebar ({ onSelectUser, selectedUserId }: ChatSidebarProps) {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        // Filter out current user if possible, but we don't have current user ID easily available here without decoding token or hitting /users/me
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => {
    const name = `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.toLowerCase();
    const role = (u.role || '').toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || role.includes(query);
  });

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Mensagens</h1>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Pesquisar utilizador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Contacts Section */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Contactos da Instituição</h3>
          <div className="space-y-2">
            {isLoading ? (
                <div className="flex justify-center p-4">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
            ) : filteredUsers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Nenhum utilizador encontrado.</p>
            ) : (
                filteredUsers.map((user) => {
                  const firstName = user.profile?.firstName || "User";
                  const lastName = user.profile?.lastName || "";
                  const initials = `${firstName[0]}${lastName ? lastName[0] : ''}`.toUpperCase();
                  
                  return (
                    <div 
                        key={user.id} 
                        onClick={() => onSelectUser(user)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedUserId === user.id ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-gray-50'}`}
                    >
                        <Avatar className="w-10 h-10">
                        <AvatarFallback className={`${selectedUserId === user.id ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'} text-sm transition-colors`}>
                            {initials}
                        </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-sm text-gray-900 truncate">{firstName} {lastName}</p>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user.role}</p>
                        </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};