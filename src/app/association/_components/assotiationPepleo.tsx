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

interface Member {
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

const AssotiationCards = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        const memberList = response.data.filter((user: any) => user.role === 'ASSOCIATION_MEMBER');
        setMembers(memberList);
      } catch (error) {
        console.error("Failed to fetch association members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-7xl mt-4">
      {/* Grid of Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {members.map((member) => (
          <div key={member.id} className="bg-gray-50 rounded-lg p-6 text-center relative">
            {/* More Options */}
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-50">
                  <Link href={`/association-details?id=${member.id}`}>
                    <DropdownMenuItem className="hover:bg-gray-50 hover:cursor-pointer">Ver Detalhes</DropdownMenuItem>
                  </Link>
                  <Link href={`/change-associantion?id=${member.id}`}>
                    <DropdownMenuItem className="hover:bg-gray-50 hover:cursor-pointer">Editar</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="hover:bg-gray-50 text-red-600 hover:cursor-pointer">Remover</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Avatar */}
            <div className="mb-4">
              <Avatar className="h-16 w-16 mx-auto">
                {member.profile?.photoUrl ? (
                    <img src={member.profile.photoUrl} alt={member.name} className="object-cover w-full h-full rounded-full" />
                ) : (
                    <AvatarFallback className="bg-purple-200 text-purple-700 text-lg font-medium">
                      {getInitials(member.name)}
                    </AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Name */}
            <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate px-2">{member.name}</h3>
            
            {/* Subject / Position */}
            <p className="text-gray-500 text-sm mb-4 truncate px-2">{member.profile?.degree || 'Membro da Associação'}</p>

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
        {members.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhum membro da associação encontrado.
          </div>
        )}
      </div>

      {/* Pagination */}
      {members.length > 0 && (
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
            Mostrando {members.length} membros
            </div>
        </div>
      )}
    </div>
  );
};

export default AssotiationCards;