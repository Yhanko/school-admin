"use client"
import { Phone, Mail, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Link from "next/link";
import { useEffect, useState } from "react";
import axiosInstance from "@/service/api";
import { Loader2 } from "@/lib/icons";

interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  profile?: {
    phone?: string;
    city?: string;
    degree?: string;
    photoUrl?: string;
  }
}

export function StaffGrid () {
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axiosInstance.get('/users');
        // Filter out students to show only employees/teachers
        const staff = response.data.filter((user: any) => user.role !== 'STUDENT');
        setStaffMembers(staff);
      } catch (error) {
        console.error("Failed to fetch staff:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      "ADMIN": "bg-red-100 text-red-800",
      "SUPER_ADMIN": "bg-purple-100 text-purple-800",
      "TEACHER": "bg-green-100 text-green-800",
      "SECRETARY": "bg-blue-100 text-blue-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const translateRole = (role: string) => {
    const translations: Record<string, string> = {
      "ADMIN": "Administrador",
      "SUPER_ADMIN": "Super Admin",
      "TEACHER": "Professor",
      "SECRETARY": "Secretaria",
    };
    return translations[role] || role;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {staffMembers.map((staff) => (
          <div key={staff.id} className="bg-gray-50 rounded-lg p-6 relative hover:shadow-md transition-shadow">
            {/* More Options */}
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-50">
                  <Link href={`/employee-details?id=${staff.id}`}>
                    <DropdownMenuItem className="hover:bg-gray-50 hover:cursor-pointer">Ver Detalhes</DropdownMenuItem>
                  </Link>
                  <Link href={`/change-employee?id=${staff.id}`}>
                    <DropdownMenuItem className="hover:bg-gray-50 hover:cursor-pointer">Editar</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="hover:bg-gray-50 text-red-600 hover:cursor-pointer">Remover</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Avatar */}
            <div className="text-center mb-4">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                {staff.profile?.photoUrl ? (
                    <img src={staff.profile.photoUrl} alt={staff.name} className="object-cover w-full h-full rounded-full" />
                ) : (
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-lg font-medium">
                      {getInitials(staff.name)}
                    </AvatarFallback>
                )}
              </Avatar>
              
              {/* Name */}
              <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate px-2">{staff.name}</h3>
              
              {/* Position */}
              <p className="text-gray-700 text-sm font-medium mb-2 truncate px-2">{staff.profile?.degree || 'Membro'}</p>
              
              {/* Department Badge */}
              <Badge className={`${getRoleColor(staff.role)} text-xs`}>
                {translateRole(staff.role)}
              </Badge>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <p className="text-xs text-gray-600 truncate">{staff.email}</p>
              <p className="text-xs text-gray-600">{staff.profile?.phone || 'Sem contacto'}</p>
            </div>

            {/* Contact Buttons */}
            <div className="flex justify-center space-x-2">
              <Button 
                size="icon" 
                className="h-8 w-8 bg-[#6366f1] hover:bg-[#5856eb] text-white rounded-full"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="h-8 w-8 bg-[#6366f1] hover:bg-[#5856eb] text-white rounded-full"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {staffMembers.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhum funcionário encontrado.
          </div>
        )}
      </div>

      {/* Pagination */}
      {staffMembers.length > 0 && (
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
            Mostrando {staffMembers.length} funcionários
            </div>
        </div>
      )}
    </div>
  );
};
