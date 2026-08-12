"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { useMemo } from "react";
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
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  };

  const financeData = useMemo(() => {
    if (!report || !report.recentTransactions) {
      return Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
          day: getPortugueseDay(date),
          income: 0,
          expense: 0
        };
      });
    }

    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayTransactions = (report.recentTransactions || []).filter((t: FinanceTransaction) => 
        t.date ? isSameDay(new Date(t.date), date) : false
      );
      
      const income = dayTransactions
        .filter((t: FinanceTransaction) => t.status === 'pago' || t.status === 'confirmed')
        .reduce((sum: number, t: FinanceTransaction) => sum + (t.amount || 0), 0);
        
      return {
        day: getPortugueseDay(date),
        income,
        expense: 0
      };
    });
  }, [report]);

  const totalCollected = report?.overview?.totalCollected || 0;
  const collectionRate = report?.overview?.collectionRate || 0;
  const totalPending = report?.overview?.totalPending || 0;

  const chartConfig = {
    income: {
      label: "Recebido",
      color: "#f59e0b",
    },
    expense: {
      label: "Pendente", 
      color: "#FF5777",
    },
  };

  return (
    <Card className="bg-white overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
        <CardTitle className="text-base sm:text-lg font-bold text-gray-900">Finanças da Escola</CardTitle>
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
            <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div>
            <span className="font-semibold">Kz {totalCollected.toLocaleString()}</span>
            <span className="text-[11px] opacity-75">Recebido</span>
          </div>
          <div className="flex items-center gap-1.5 bg-rose-50 text-rose-800 px-2.5 py-1 rounded-lg border border-rose-200">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5777]"></div>
            <span className="font-semibold">Kz {totalPending.toLocaleString()}</span>
            <span className="text-[11px] opacity-75">Pendente</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <ChartContainer config={chartConfig} className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financeData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
                interval={0}
              />
              <YAxis hide />
              <ChartTooltip cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }} content={<ChartTooltipContent />} />
              <Bar dataKey="income" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#FF5777" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 p-3 bg-gradient-to-r from-[#6366f1] to-[#4f46e5] rounded-xl text-white flex items-center justify-between px-5 shadow-sm">
          <div className="text-xs font-medium opacity-90">Taxa de Arrecadação de Propinas</div>
          <div className="text-xl font-extrabold">{collectionRate}%</div>
        </div>
      </CardContent>
    </Card>
  );
}
