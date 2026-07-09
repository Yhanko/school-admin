"use client"

import { Users, GraduationCap, DollarSign } from "@/lib/icons";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
}

const MetricCard = ({ title, value, icon, iconBg }: MetricCardProps) => (
  <Card className="bg-white">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export function DashboardMetrics ({ 
  totalStudents = 0, 
  totalTeachers = 0, 
  totalPayments = 0 
}: { 
  totalStudents?: number, 
  totalTeachers?: number, 
  totalPayments?: number 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="Total Estudantes"
        value={totalStudents.toString()}
        icon={<Users className="w-6 h-6 text-white" />}
        iconBg="bg-[#6366f1]"
      />
      <MetricCard
        title="Total Professores"
        value={totalTeachers.toString()}
        icon={<GraduationCap className="w-6 h-6 text-white" />}
        iconBg="bg-[#FF5777]"
      />
      <MetricCard
        title="Total Pagamentos"
        value={totalPayments.toString()}
        icon={<DollarSign className="w-6 h-6 text-white" />}
        iconBg="bg-[#f59e0b]"
      />
    </div>
  );
};