"use client"
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Phone, Mail, MoreHorizontal } from "@/lib/icons";
import Link from "next/link";
import { StudentFullProfile } from "@/types/academic-history";


interface Student {
  id: string;
  name: string;
  date: string;
  parentName: string;
  city: string;
  grade: string;
  gradeColor: string;
  phone: string;
  email: string;
  isSelected: boolean;
}

interface StudentRowProps {
  student: Student;
  onAction: (action: 'view' | 'edit' | 'delete' | 'history', student: Student) => void;
}

export function StudentRow ({ student, onAction }: StudentRowProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
      <TableRow className="hover:bg-muted/50 border-b border-border">
        <TableCell className="px-6 py-4">
          <Checkbox checked={student.isSelected} />
        </TableCell>
        
        <TableCell className="px-6 py-4">
          <span className="font-medium text-gray-900">{student.studentNumber}</span>
        </TableCell>

        <TableCell className="px-6 py-4">
          <div className="flex items-center space-x-3 cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-purple-200 text-purple-700 text-sm font-medium">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-900">{student.name}</span>
          </div>
        </TableCell>
        

        <TableCell className="px-6 py-4">
          <span className="text-gray-600">{student.date}</span>
        </TableCell>
        
        <TableCell className="px-6 py-4">
          <span className="text-gray-900">{student.parentName}</span>
        </TableCell>
        
        <TableCell className="px-6 py-4">
          <span className="text-gray-600">{student.city}</span>
        </TableCell>
        
        <TableCell className="px-6 py-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-gray-900">{student.phone}</span>
            <span className="text-sm text-gray-500">{student.email}</span>
          </div>
        </TableCell>
        
        <TableCell className="px-6 py-4">
          <Badge 
            className={`${student.gradeColor} text-white hover:opacity-90 px-3 py-1 text-xs font-medium rounded-full`}
          >
            {student.grade}
          </Badge>
        </TableCell>
        
        <TableCell className="px-6 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border shadow-lg">
              <DropdownMenuItem 
                className="hover:bg-muted cursor-pointer"
                onClick={() => onAction('view', student)}
              >
                Visualizar Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-muted cursor-pointer"
                onClick={() => onAction('edit', student)}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-muted cursor-pointer"
                onClick={() => onAction('history', student)}
              >
                Ver Histórico
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-red-50 text-red-600 cursor-pointer"
                onClick={() => onAction('delete', student)}
              >
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
    </TableRow>
  );
};