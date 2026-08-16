"use client";

import React from "react";
import { Users, GraduationCap, CreditCard, TrendingUp } from "@/lib/icons";

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
}

const MetricCard = ({ title, value, subValue, icon }: MetricCardProps) => (
  <div className="bg-[#121212] border border-[#414042] hover:border-[#C0C2C5] rounded-lg p-5 transition-all duration-200 group">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="label-caps text-[#d5c4ac]">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold font-jetbrains text-[#e5e2e1] tracking-tight">
          {value}
        </p>
        {subValue && (
          <div className="flex items-center gap-1 text-[11px] text-[#DDD6FE] pt-0.5">
            <TrendingUp className="w-3 h-3 text-[#8B5CF6]" />
            <span>{subValue}</span>
          </div>
        )}
      </div>
      <div className="w-12 h-12 rounded bg-[#1A1A1A] border border-[#414042] group-hover:border-[#8B5CF6]/50 flex items-center justify-center transition-colors">
        {icon}
      </div>
    </div>
  </div>
);

export function DashboardMetrics({
  totalStudents = 0,
  totalTeachers = 0,
  totalPayments = 0,
}: {
  totalStudents?: number;
  totalTeachers?: number;
  totalPayments?: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      <MetricCard
        title="Total de Estudantes"
        value={totalStudents.toLocaleString()}
        subValue="Matrículas Ativas"
        icon={<Users className="w-6 h-6 text-[#8B5CF6]" />}
      />
      <MetricCard
        title="Corpo Docente"
        value={totalTeachers.toLocaleString()}
        subValue="Professores Ativos"
        icon={<GraduationCap className="w-6 h-6 text-[#8B5CF6]" />}
      />
      <MetricCard
        title="Pagamentos Confirmados"
        value={totalPayments.toLocaleString()}
        subValue="Transações Validadas"
        icon={<CreditCard className="w-6 h-6 text-[#8B5CF6]" />}
      />
    </div>
  );
}