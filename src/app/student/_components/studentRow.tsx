"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "@/lib/icons";
import { usePermissions } from "@/hooks/usePermissions";

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
  onAction: (
    action: "view" | "edit" | "delete" | "history",
    student: Student
  ) => void;
}

export function StudentRow({ student, onAction }: StudentRowProps) {
  const { isDirector } = usePermissions();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <TableRow className="even:bg-[#FAFBFD] odd:bg-[#EDF0F3] dark:even:bg-[#121212] dark:odd:bg-[#151515] hover:bg-[#DDE2E7] dark:hover:bg-[#1A1A1A] border-b border-[#CBD5E1] dark:border-[#414042]/50 transition-colors group">
      <TableCell className="px-3 sm:px-4 py-3">
        <Checkbox
          className="border-[#CBD5E1] dark:border-[#414042] data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:text-white"
          checked={student.isSelected}
        />
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3 whitespace-nowrap">
        <span className="data-mono text-xs font-semibold text-[#6D28D9] dark:text-[#DDD6FE]">
          {student.studentNumber && student.studentNumber !== "N/A" && student.studentNumber !== "—"
            ? `#${student.studentNumber}`
            : <span className="text-muted-foreground italic font-normal">—</span>}
        </span>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3">
        <div className="flex items-center space-x-3 min-w-[140px]">
          <Avatar className="h-8 w-8 shrink-0 border border-[#CBD5E1] dark:border-[#414042] bg-[#FAFBFD] dark:bg-[#201f1f]">
            <AvatarFallback className="bg-[#FAFBFD] dark:bg-[#201f1f] text-[#7C3AED] dark:text-[#DDD6FE] data-mono text-xs font-bold">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          <span
            className="font-hanken font-bold text-sm text-[#090D16] dark:text-[#e5e2e1] truncate max-w-[150px] sm:max-w-[200px]"
            title={student.name}
          >
            {student.name}
          </span>
        </div>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3 whitespace-nowrap">
        <span className="data-mono text-xs text-[#556575] dark:text-[#d5c4ac]">{student.date}</span>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3">
        <span
          className="text-xs sm:text-sm font-hanken text-[#090D16] dark:text-[#e5e2e1] font-medium truncate max-w-[140px] block"
          title={student.parentName || "Não atribuído"}
        >
          {student.parentName && student.parentName !== "N/A" && student.parentName !== "—"
            ? student.parentName
            : <span className="text-muted-foreground italic text-xs font-normal">Não atribuído</span>}
        </span>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3 whitespace-nowrap">
        <span className="text-xs font-hanken text-[#556575] dark:text-[#d5c4ac]">{student.city || "Luanda"}</span>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3">
        <div className="flex flex-col space-y-0.5 min-w-[130px]">
          {student.phone && student.phone !== "N/A" && student.phone !== "—" ? (
            <span className="data-mono text-xs font-semibold text-[#090D16] dark:text-[#e5e2e1]">
              {student.phone}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground italic">Sem telefone</span>
          )}
          {student.email && student.email !== "N/A" && student.email !== "—" ? (
            <span
              className="data-mono text-[11px] text-[#556575] dark:text-[#9d8f78] truncate max-w-[140px]"
              title={student.email}
            >
              {student.email}
            </span>
          ) : null}
        </div>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3 whitespace-nowrap">
        <span className="inline-block bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 data-mono text-[11px] font-bold rounded">
          {student.grade && student.grade !== "N/A" ? student.grade : "Sem Turma"}
        </span>
      </TableCell>

      <TableCell className="px-3 sm:px-4 py-3 whitespace-nowrap text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#64748B] dark:text-[#9d8f78] hover:text-[#8B5CF6] hover:bg-[#F1F5F9] dark:hover:bg-[#201f1f] rounded cursor-pointer transition-colors"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#C0C2C5] text-[#0F172A] dark:text-[#e5e2e1] shadow-lg rounded p-1 z-50 font-hanken"
          >
            <DropdownMenuItem
              className="hover:bg-[#F1F5F9] dark:hover:bg-[#201f1f] focus:bg-[#F1F5F9] dark:focus:bg-[#201f1f] cursor-pointer text-xs font-semibold text-[#0F172A] dark:text-[#e5e2e1]"
              onClick={() => onAction("view", student)}
            >
              Visualizar Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-[#F1F5F9] dark:hover:bg-[#201f1f] focus:bg-[#F1F5F9] dark:focus:bg-[#201f1f] cursor-pointer text-xs font-semibold text-[#7C3AED] dark:text-[#DDD6FE]"
              onClick={() => onAction("history", student)}
            >
              Histórico Académico
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-[#F1F5F9] dark:hover:bg-[#201f1f] focus:bg-[#F1F5F9] dark:focus:bg-[#201f1f] cursor-pointer text-xs font-semibold text-[#0F172A] dark:text-[#e5e2e1]"
              onClick={() => onAction("edit", student)}
            >
              Editar Aluno
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}