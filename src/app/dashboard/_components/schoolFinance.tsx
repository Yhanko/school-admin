"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

import { useMemo } from "react";
import { format, subDays, isSameDay } from "date-fns";

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
  const financeData = useMemo(() => {
    if (!report || !report.recentTransactions) {
      return Array.from({ length: 7 }).map((_, i) => ({
        day: format(subDays(new Date(), 6 - i), 'E'),
        income: 0,
        expense: 0
      }));
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
        day: format(date, 'E'),
        income,
        expense: 0 // In this system we only have payments (income), no expenses recorded yet
      };
    });
  }, [report]);

  const totalCollected = report?.overview?.totalCollected || 0;
  const collectionRate = report?.overview?.collectionRate || 0;

const chartConfig = {
  income: {
    label: "Income",
    color: "#f59e0b",
  },
  expense: {
    label: "Pending", 
    color: "#FF5777",
  },
};

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">School Finance</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
            <span className="text-sm text-gray-600">kz {totalCollected.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5777]"></div>
            <span className="text-sm text-gray-600">kz {(report?.overview?.totalPending || 0).toLocaleString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48">
          <BarChart data={financeData}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              className="text-gray-500"
            />
            <YAxis hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="income" fill="#f59e0b" radius={2} />
            <Bar dataKey="expense" fill="#FF5777" radius={2} />
          </BarChart>
        </ChartContainer>
        <div className="mt-4 p-3 bg-[#6366f1] rounded-lg text-white text-center">
          <div className="text-lg font-semibold">{collectionRate}%</div>
          <div className="text-sm opacity-90">Collection Rate</div>
        </div>
      </CardContent>
    </Card>
  );
};
