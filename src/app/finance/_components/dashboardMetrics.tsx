"use client"

import { Users, GraduationCap, DollarSign, TrendingUp, } from "@/lib/icons";
import { useState } from "react";
import { FinancialReport } from "@/types/school-system";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  iconBg: string;
}

const MetricCard = ({ title, value, change, changeType, icon, iconBg }: MetricCardProps) => (
  <Card className="bg-card">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className={`text-sm mt-1 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {change} than last month
          </p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);



export function DashboardMetrics () {
    const [financialReport] = useState<FinancialReport>({
    id: "fr1",
    period: "Janeiro 2024",
    income: 450000,
    expenses: 320000,
    balance: 130000,
    details: [
      { category: "Mensalidades", amount: 400000, type: "income" },
      { category: "Matrículas", amount: 50000, type: "income" },
      { category: "Salários", amount: 200000, type: "expense" },
      { category: "Infraestrutura", amount: 120000, type: "expense" }
    ]
  })
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total Students"
        value="932"
        change="+10%"
        changeType="positive"
        icon={<Users className="w-6 h-6 text-white" />}
        iconBg="bg-[#6366f1]"
      />
      <MetricCard
        title="Total Teachers"
        value="754"
        change="-0,5%"
        changeType="negative"
        icon={<GraduationCap className="w-6 h-6 text-white" />}
        iconBg="bg-[#FF5777]"
      />
      <MetricCard
        title="School Balance"
        value="$123,456"
        change="+23%"
        changeType="positive"
        icon={<DollarSign className="w-6 h-6 text-white" />}
        iconBg="bg-[#f59e0b]"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
              Resumo Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
            <span className="text-sm font-medium">Receitas</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {financialReport.income.toLocaleString()} Kz</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg">
            <span className="text-sm font-medium">Despesas</span>
            <span className="text-lg font-bold text-red-600 dark:text-red-400">{financialReport.expenses.toLocaleString()} Kz</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
            <span className="text-sm font-medium">Saldo</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {financialReport.balance.toLocaleString()} Kz</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};