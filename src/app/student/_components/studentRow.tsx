"use client"
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "@/lib/icons";

export interface Student {
  id: string;
  name: string;
  studentNumber?: string;
  date: string;
  parentName: string;
  parentEmail?: string;
  parentPhone?: string;
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
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <TableRow className="hover:bg-muted/50 border-b border-border transition-colors">
      <TableCell className="px-3 sm:px-4 py-3">
        <Checkbox checked={student.isSelected} />
      </TableCell>
      
      <TableCell className="px-3 sm:px-4 py-3 whitespace-nowrap">
        <span className="font-mono text-xs sm:text-sm font-semibold text-indigo-600">#{student.studentNumber}</span>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3">
        <div className="flex items-center space-x-3 min-w-[140px]">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="bg-purple-100 text-purple-700 text-xs font-bold">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-xs sm:text-sm text-gray-900 truncate max-w-[150px] sm:max-w-[200px]" title={student.name}>
            {student.name}
          </span>
        </div>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3 whitespace-nowrap">
        <span className="text-xs sm:text-sm text-gray-500">{student.date}</span>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3">
        <span className="text-xs sm:text-sm text-gray-800 font-medium truncate max-w-[140px] block" title={student.parentName}>
          {student.parentName}
        </span>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3 whitespace-nowrap">
        <span className="text-xs sm:text-sm text-gray-600">{student.city}</span>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3">
        <div className="flex flex-col space-y-0.5 min-w-[130px]">
          <span className="text-xs font-semibold text-gray-900">{student.phone}</span>
          <span className="text-[11px] text-gray-400 truncate max-w-[140px]" title={student.email}>{student.email}</span>
        </div>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3 whitespace-nowrap">
        <Badge className={`${student.gradeColor} text-white px-2.5 py-0.5 text-[11px] font-semibold rounded-full shadow-none`}>
          {student.grade}
        </Badge>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3 whitespace-nowrap text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-border shadow-lg rounded-xl">
            <DropdownMenuItem 
              className="hover:bg-gray-100 cursor-pointer text-xs font-medium"
              onClick={() => onAction('view', student)}
            >
              Visualizar Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="hover:bg-gray-100 cursor-pointer text-xs font-medium"
              onClick={() => onAction('history', student)}
            >
              Histórico Académico
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="hover:bg-gray-100 cursor-pointer text-xs font-medium"
              onClick={() => onAction('edit', student)}
            >
              Editar Estudante
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="hover:bg-red-50 text-red-600 cursor-pointer text-xs font-medium"
              onClick={() => onAction('delete', student)}
            >
              Excluir Estudante
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}