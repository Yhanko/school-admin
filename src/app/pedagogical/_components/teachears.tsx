"use client"
import { Phone, Mail, MoreHorizontal } from "@/lib/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Link from "next/link";
import { useEffect, useState } from "react";
import axiosInstance from "@/service/api";
import { Loader2 } from "@/lib/icons";

interface Teacher {
  id: string;
  name: string;
  role: string;
  email: string;
  profile?: {
    degree?: string;
    phone?: string;
    photoUrl?: string;
  }
}

export function Teachears (){
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        const teacherList = response.data.filter((user: any) => user.role === 'TEACHER');
        setTeachers(teacherList);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 w-full max-w-7xl">
      {/* Grid of Teachers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-muted/30 border border-border rounded-lg p-6 text-center relative">
            {/* More Options */}
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border shadow-lg z-50">
                  <Link href={`/teachear-deatils?id=${teacher.id}`}>
                    <DropdownMenuItem className="hover:bg-gray-50 hover:cursor-pointer">Ver Detalhes</DropdownMenuItem>
                  </Link>
                  <Link href={`/change-employee?id=${teacher.id}`}>
                    <DropdownMenuItem className="hover:bg-gray-50 hover:cursor-pointer">Editar</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="hover:bg-red-50 text-red-600 cursor-pointer">Remover</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Avatar */}
            <div className="mb-4 cursor-pointer">
              <Avatar className="h-16 w-16 mx-auto">
                {teacher.profile?.photoUrl ? (
                    <img src={teacher.profile.photoUrl} alt={teacher.name} className="object-cover w-full h-full rounded-full" />
                ) : (
                    <AvatarFallback className="bg-purple-200 text-purple-700 text-lg font-medium">
                      {getInitials(teacher.name)}
                    </AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Name */}
            <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate px-2">{teacher.name}</h3>
            
            {/* Subject */}
            <p className="text-gray-500 text-sm mb-4 truncate px-2">{teacher.profile?.degree || 'Professor'}</p>

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
        {teachers.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhum professor encontrado.
          </div>
        )}
      </div>

      {/* Pagination */}
      {teachers.length > 0 && (
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
            Mostrando {teachers.length} professores
            </div>
        </div>
      )}
    </div>
  );
};