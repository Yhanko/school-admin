"use client";

import React from "react";
import { Plus, Mail, Users, ArrowRight } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface StudentItem {
  id?: string;
  name?: string;
  code?: string;
  email?: string;
  enrollments?: { class?: { grade?: string; name?: string } }[];
}

export function RecentStudents({
  students = [],
}: {
  students?: StudentItem[];
}) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-[#121212] border border-[#414042] rounded-lg p-5 font-hanken text-[#e5e2e1] space-y-4">
      <div className="flex flex-row items-center justify-between border-b border-[#414042] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="headline-sm text-[#e5e2e1]">Alunos Recentes</h2>
          </div>
          <p className="text-xs text-[#d5c4ac] mt-0.5">
            {students.length} novas matrículas registadas
          </p>
        </div>

        <Link href="/newstudent">
          <Button
            size="icon"
            className="h-8 w-8 bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold rounded shadow-[0_0_8px_rgba(139, 92, 246,0.35)] cursor-pointer transition-all"
            title="Novo Aluno"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {students.length === 0 ? (
          <p className="text-xs text-[#9d8f78] italic text-center py-6">
            Nenhum aluno registado recentemente.
          </p>
        ) : (
          students.map((student, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded bg-[#1c1b1b] border border-[#414042] hover:border-[#C0C2C5] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-[#201f1f] border border-[#414042] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[#DDD6FE] data-mono font-bold text-xs">
                    {getInitials(student.name || "?")}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#e5e2e1] text-xs sm:text-sm truncate">
                    {student.name}
                  </p>
                  <p className="text-[11px] text-[#d5c4ac] data-mono truncate">
                    {student.email || "Sem email"}
                  </p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-[#d5c4ac] hover:text-[#8B5CF6] hover:bg-[#201f1f] rounded shrink-0 cursor-pointer transition-colors"
                title={student.email || ""}
              >
                <Mail className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))
        )}

        <Link
          href="/student"
          className="w-full flex items-center justify-center gap-1.5 pt-2 text-xs text-[#DDD6FE] hover:text-[#8B5CF6] font-semibold transition-colors"
        >
          <span>Ver Base de Alunos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}