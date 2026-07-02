"use client"
import { Phone, Mail, MoreHorizontal } from "@/lib/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Link from "next/link";

interface Teachear {
  id: string;
  name: string;
  subject: string;
}

const students: Teachear[] = [
  {
    id: "1",
    name: "Dimitres Viga",
    subject: "Mathematics"
  },
  {
    id: "2", 
    name: "Tom Housenberg",
    subject: "Science"
  },
  {
    id: "3",
    name: "Dana Benevista", 
    subject: "Art"
  },
  {
    id: "4",
    name: "Salvadore Morbeau",
    subject: "Biology"
  },
  {
    id: "5",
    name: "Maria Historia",
    subject: "History"
  },
  {
    id: "6",
    name: "Jack Sally",
    subject: "Physics"
  },
  {
    id: "7",
    name: "Lula Beatrice",
    subject: "Algorithm"
  },
  {
    id: "8",
    name: "Nella Vita",
    subject: "English"
  },
  {
    id: "9",
    name: "Nadia Laravela",
    subject: "Programming"
  },
  {
    id: "10",
    name: "Dakota Farral",
    subject: "Science"
  },
  {
    id: "11", 
    name: "Miranda Adila",
    subject: "Art"
  },
  {
    id: "12",
    name: "Indiana Barker",
    subject: "Biology"
  }
];

export function Teachears (){
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Grid of Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {students.map((student) => (
          <div key={student.id} className="bg-muted/30 border border-border rounded-lg p-6 text-center relative">
            {/* More Options */}
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border shadow-lg z-50">
                  <Link href={"/teachear-deatils"}>
                    <DropdownMenuItem className="hover:bg-gray-50 hover:cursor-pointer">View Details</DropdownMenuItem>
                  </Link>
                  <Link href="/change-employee">
                    <DropdownMenuItem className="hover:bg-gray-50 hover:cursor-pointer">Editar</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="hover:bg-red-50 text-red-600 cursor-pointer">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Avatar */}
            <div className="mb-4 cursor-pointer">
              <Avatar className="h-16 w-16 mx-auto">
                <AvatarFallback className="bg-purple-200 text-purple-700 text-lg font-medium">
                  {getInitials(student.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name */}
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{student.name}</h3>
            
            {/* Subject */}
            <p className="text-gray-500 text-sm mb-4">{student.subject}</p>

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
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing 1-5 from 100 data
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" className="text-gray-400 hover:text-gray-600" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive className="bg-[#6366f1] text-white hover:bg-[#5856eb]">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="text-gray-600 hover:bg-gray-100">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="text-gray-600 hover:bg-gray-100">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" className="text-gray-400 hover:text-gray-600" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};