"use client";

import React from "react";
import { CheckCircle, Clock, AlertCircle, TrendingUp } from "@/lib/icons";

interface PaymentStatsProps {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  cancelledAmount: number;
  totalCount: number;
  paidRate: number;
  pendingRate: number;
  cancelledRate: number;
}

export function PaymentStats({
  totalAmount,
  paidAmount,
  pendingAmount,
  cancelledAmount,
  totalCount,
  paidRate,
  pendingRate,
  cancelledRate,
}: PaymentStatsProps) {
  const stats = [
    {
      title: "Pagamentos Recebidos",
      subtitle: "Valores liquidados no sistema",
      value: `${paidAmount.toLocaleString()} Kz`,
      percentage: `${paidRate.toFixed(1)}%`,
      icon: CheckCircle,
      badgeText: "CONFIRMADO",
      badgeColor: "bg-[#2D6A4F]/20 text-[#2D6A4F] border border-[#2D6A4F]/40",
      iconColor: "text-[#2D6A4F]",
      iconBg: "bg-[#2D6A4F]/15 border border-[#2D6A4F]/30",
    },
    {
      title: "Pagamentos Pendentes",
      subtitle: "Aguardando confirmação",
      value: `${pendingAmount.toLocaleString()} Kz`,
      percentage: `${pendingRate.toFixed(1)}%`,
      icon: Clock,
      badgeText: "PENDENTE",
      badgeColor: "bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40",
      iconColor: "text-[#8B5CF6]",
      iconBg: "bg-[#8B5CF6]/15 border border-[#8B5CF6]/30",
    },
    {
      title: "Cancelados / Atrasados",
      subtitle: "Exigem atenção operacional",
      value: `${cancelledAmount.toLocaleString()} Kz`,
      percentage: `${cancelledRate.toFixed(1)}%`,
      icon: AlertCircle,
      badgeText: "ALERTA",
      badgeColor: "bg-[#9B2226]/20 text-[#ffb4ab] border border-[#9B2226]/40",
      iconColor: "text-[#ffb4ab]",
      iconBg: "bg-[#9B2226]/15 border border-[#9B2226]/30",
    },
    {
      title: "Volume Total Esperado",
      subtitle: `${totalCount} transações registadas`,
      value: `${totalAmount.toLocaleString()} Kz`,
      percentage: "100.0%",
      icon: TrendingUp,
      badgeText: "TOTAL PREVISTO",
      badgeColor: "bg-[#C0C2C5]/15 text-[#e5e2e1] border border-[#414042]",
      iconColor: "text-[#8B5CF6]",
      iconBg: "bg-[#201f1f] border border-[#414042]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="group relative bg-[#121212] border border-[#414042] rounded-lg p-4 sm:p-5 transition-all duration-200 hover:bg-[#1A1A1A] hover:border-[#C0C2C5]/70 flex flex-col justify-between"
          >
            {/* Header with Title and Icon */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <span className="label-caps text-[#d5c4ac] block truncate">
                  {stat.title}
                </span>
                <p className="text-xs text-[#9d8f78] mt-0.5 truncate">
                  {stat.subtitle}
                </p>
              </div>
              <div
                className={`p-2.5 rounded shrink-0 ${stat.iconBg} transition-transform duration-200 group-hover:scale-105`}
              >
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>

            {/* Value and Percentage Badge */}
            <div className="mt-2 pt-2 border-t border-[#414042]/50 flex items-baseline justify-between gap-2">
              <div className="data-mono text-xl sm:text-2xl font-bold text-[#e5e2e1] tracking-tight">
                {stat.value}
              </div>
              <span
                className={`label-caps px-2 py-0.5 rounded text-[10px] ${stat.badgeColor} shrink-0`}
              >
                {stat.percentage}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
