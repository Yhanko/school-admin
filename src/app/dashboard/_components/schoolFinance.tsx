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

export function SchoolFinance({
  report,
  payments = [],
}: {
  report?: FinanceReport | null;
  payments?: Record<string, unknown>[];
}) {
  const getPortugueseDay = (date: Date) => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return days[date.getDay()];
  };

  const collectedSum = useMemo(() => {
    if (report?.overview?.totalCollected !== undefined && report?.overview?.totalCollected !== null) {
      return report.overview.totalCollected;
    }
    if (payments && payments.length > 0) {
      return payments
        .filter(
          (p: Record<string, unknown>) =>
            p.status === "confirmed" || p.status === "pago"
        )
        .reduce(
          (sum: number, p: Record<string, unknown>) =>
            sum + (Number(p.amount) || 0),
          0
        );
    }
    return 0;
  }, [report, payments]);

  const pendingSum = useMemo(() => {
    if (report?.overview?.totalPending !== undefined && report?.overview?.totalPending !== null) {
      return report.overview.totalPending;
    }
    if (payments && payments.length > 0) {
      return payments
        .filter(
          (p: Record<string, unknown>) =>
            p.status === "pending" || p.status === "pendente"
        )
        .reduce(
          (sum: number, p: Record<string, unknown>) =>
            sum + (Number(p.amount) || 0),
          0
        );
    }
    return 0;
  }, [report, payments]);

  const totalAll = collectedSum + pendingSum;
  const collectionRate =
    report?.overview?.collectionRate ??
    (totalAll > 0 ? Math.round((collectedSum / totalAll) * 100) : 0);

  const financeData = useMemo(() => {
    const transactions =
      report?.recentTransactions && report.recentTransactions.length > 0
        ? report.recentTransactions
        : (payments || []).map((p: Record<string, unknown>) => ({
            date: (p.createdAt as string) || (p.date as string),
            status: p.status as string,
            amount: Number(p.amount) || 0,
          }));

    return Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dayTransactions = transactions.filter(
        (t: FinanceTransaction) =>
          t.date ? isSameDay(new Date(t.date), date) : false
      );

      const income = dayTransactions
        .filter(
          (t: FinanceTransaction) =>
            t.status === "pago" || t.status === "confirmed"
        )
        .reduce(
          (sum: number, t: FinanceTransaction) => sum + (t.amount || 0),
          0
        );

      const expense = dayTransactions
        .filter(
          (t: FinanceTransaction) =>
            t.status === "pendente" || t.status === "pending"
        )
        .reduce(
          (sum: number, t: FinanceTransaction) => sum + (t.amount || 0),
          0
        );

      return {
        day: getPortugueseDay(date),
        income,
        expense,
      };
    });
  }, [report, payments]);

  const formatAmount = (val: number) => {
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M Kz`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(0)}k Kz`;
    }
    return `${val.toLocaleString()} Kz`;
  };

  return (
    <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-5 font-hanken text-[#090D16] dark:text-[#e5e2e1] space-y-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#CBD5E1] dark:border-[#414042] pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#7C3AED] dark:text-[#8B5CF6]" />
          <h2 className="headline-sm text-[#090D16] dark:text-[#e5e2e1]">Finanças da Escola</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-[#1c1b1b] text-emerald-800 dark:text-[#2D6A4F] px-2.5 py-1 rounded border border-emerald-200 dark:border-[#414042]">
            <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-[#2D6A4F]"></div>
            <span className="font-bold data-mono text-[#090D16] dark:text-[#e5e2e1]">
              {formatAmount(collectedSum)}
            </span>
            <span className="label-caps text-[9px] text-[#556575] dark:text-[#d5c4ac]">Recebido</span>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-[#1c1b1b] text-purple-800 dark:text-[#8B5CF6] px-2.5 py-1 rounded border border-purple-200 dark:border-[#414042]">
            <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-[#8B5CF6]"></div>
            <span className="font-bold data-mono text-[#6D28D9] dark:text-[#DDD6FE]">
              {formatAmount(pendingSum)}
            </span>
            <span className="label-caps text-[9px] text-[#556575] dark:text-[#d5c4ac]">Pendente</span>
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
              tick={{ fill: "#556575", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
              interval={0}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#F4F6F8",
                borderColor: "#CBD5E1",
                borderRadius: "0.25rem",
                color: "#090D16",
                fontSize: "12px",
                fontFamily: "Hanken Grotesk, sans-serif",
              }}
              formatter={(value: number) => [`${value.toLocaleString()} Kz`]}
            />
            <Bar dataKey="income" name="Recebido" fill="#10B981" radius={[3, 3, 0, 0]} />
            <Bar dataKey="expense" name="Pendente" fill="#8B5CF6" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 bg-[#E2E6EA] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] rounded flex items-center justify-between px-4">
        <div>
          <span className="label-caps text-[#6D28D9] dark:text-[#DDD6FE] block text-[11px]">
            Taxa de Arrecadação Global
          </span>
          <span className="text-[11px] text-[#556575] dark:text-[#9d8f78]">
            Propinas e emolumentos liquidados
          </span>
        </div>
        <div className="text-xl font-bold data-mono text-[#6D28D9] dark:text-[#8B5CF6] px-2.5 py-0.5 rounded bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042]">
          {collectionRate}%
        </div>
      </div>
    </div>
  );
}
