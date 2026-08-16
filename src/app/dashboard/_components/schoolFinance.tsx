"use client";

import React, { useMemo } from "react";
import { DollarSign } from "@/lib/icons";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { subDays, isSameDay } from "date-fns";

interface FinanceTransaction {
  date?: string;
  status?: string;
  amount?: number;
}

export interface FinanceReport {
  recentTransactions?: FinanceTransaction[];
  overview?: {
    totalCollected?: number;
    collectionRate?: number;
    totalPending?: number;
  };
}

export function SchoolFinance({ report }: { report?: FinanceReport | null }) {
  const getPortugueseDay = (date: Date) => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return days[date.getDay()];
  };

  const financeData = useMemo(() => {
    if (!report || !report.recentTransactions) {
      return Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
          day: getPortugueseDay(date),
          income: (i + 1) * 25000,
          expense: (7 - i) * 8000,
        };
      });
    }

    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayTransactions = (report.recentTransactions || []).filter(
        (t: FinanceTransaction) =>
          t.date ? isSameDay(new Date(t.date), date) : false
      );

      const income = dayTransactions
        .filter(
          (t: FinanceTransaction) =>
            t.status === "pago" || t.status === "confirmed"
        )
        .reduce((sum: number, t: FinanceTransaction) => sum + (t.amount || 0), 0);

      const expense = dayTransactions
        .filter(
          (t: FinanceTransaction) =>
            t.status === "pendente" || t.status === "pending"
        )
        .reduce((sum: number, t: FinanceTransaction) => sum + (t.amount || 0), 0);

      return {
        day: getPortugueseDay(date),
        income,
        expense,
      };
    });
  }, [report]);

  const totalCollected = report?.overview?.totalCollected || 1850000;
  const collectionRate = report?.overview?.collectionRate || 82;
  const totalPending = report?.overview?.totalPending || 340000;

  return (
    <div className="bg-[#121212] border border-[#414042] rounded-lg p-5 font-hanken text-[#e5e2e1] space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#414042] pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#8B5CF6]" />
          <h2 className="headline-sm text-[#e5e2e1]">Finanças da Escola</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-[#1c1b1b] text-[#2D6A4F] px-2.5 py-1 rounded border border-[#414042]">
            <div className="w-2 h-2 rounded-full bg-[#2D6A4F]"></div>
            <span className="font-bold data-mono text-[#e5e2e1]">
              {(totalCollected / 1000).toFixed(0)}k Kz
            </span>
            <span className="label-caps text-[9px] text-[#d5c4ac]">Recebido</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#1c1b1b] text-[#8B5CF6] px-2.5 py-1 rounded border border-[#414042]">
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div>
            <span className="font-bold data-mono text-[#DDD6FE]">
              {(totalPending / 1000).toFixed(0)}k Kz
            </span>
            <span className="label-caps text-[9px] text-[#d5c4ac]">Pendente</span>
          </div>
        </div>
      </div>

      <div className="h-44 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={financeData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#d5c4ac", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
              interval={0}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1A1A1A",
                borderColor: "#414042",
                borderRadius: "0.25rem",
                color: "#e5e2e1",
                fontSize: "12px",
                fontFamily: "Hanken Grotesk, sans-serif",
              }}
              formatter={(value: number) => [`${value.toLocaleString()} Kz`]}
            />
            <Bar dataKey="income" name="Recebido" fill="#2D6A4F" radius={[3, 3, 0, 0]} />
            <Bar dataKey="expense" name="Pendente" fill="#8B5CF6" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 bg-[#1c1b1b] border border-[#414042] rounded flex items-center justify-between px-4">
        <div>
          <span className="label-caps text-[#DDD6FE] block text-[11px]">
            Taxa de Arrecadação Global
          </span>
          <span className="text-[11px] text-[#9d8f78]">
            Propinas e emolumentos liquidados
          </span>
        </div>
        <div className="text-xl font-bold data-mono text-[#8B5CF6] shadow-[0_0_8px_rgba(139, 92, 246,0.3)] px-2 py-0.5 rounded bg-[#121212] border border-[#414042]">
          {collectionRate}%
        </div>
      </div>
    </div>
  );
}
