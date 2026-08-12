"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from 'next/dynamic';
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface MonthlyPerf {
  month?: string;
  attendance?: number;
  grade?: number;
}

export interface PerformanceReport {
  monthlyPerformance?: MonthlyPerf[];
  overview?: {
    attendanceRate?: number;
    averageGrade?: number;
    totalStudents?: number;
  };
}

export function PerformanceChart({ report }: { report?: PerformanceReport | null }) {
  const portugueseMonths = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const categories = report?.monthlyPerformance?.map((m: MonthlyPerf, i: number) => {
    return m.month || portugueseMonths[i % 12];
  }) || portugueseMonths;
  
  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 300,
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    colors: ['#FBBF24', '#FF5777'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: '#6B7280'
        }
      }
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 0
    },
    legend: {
      show: false
    },
    tooltip: {
      theme: 'light'
    }
  };

  const attData = report?.monthlyPerformance?.map((m: MonthlyPerf) => m.attendance ?? 0) || [65, 75, 70, 80, 85, 75, 90, 85, 95, 90, 100, 95];
  const gradeData = report?.monthlyPerformance?.map((m: MonthlyPerf) => m.grade ?? 0) || [55, 65, 60, 70, 75, 65, 80, 75, 85, 80, 90, 85];

  const chartSeries = [
    {
      name: 'Assiduidade (%)',
      data: attData
    },
    {
      name: 'Média de Notas',
      data: gradeData
    }
  ];

  return (
    <Card className="bg-white overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle className="text-base sm:text-lg font-bold text-gray-900">Desempenho Académico</CardTitle>
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
              <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
              <span className="font-semibold">{report?.overview?.attendanceRate || 0}%</span>
              <span className="text-[11px] opacity-75">Assiduidade Média</span>
            </div>
            <div className="flex items-center gap-1.5 bg-rose-50 text-rose-800 px-2.5 py-1 rounded-lg border border-rose-200">
              <div className="w-2.5 h-2.5 bg-[#FF5777] rounded-full"></div>
              <span className="font-semibold">{report?.overview?.averageGrade || 0}</span>
              <span className="text-[11px] opacity-75">Nota Média</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-72 w-full pt-2">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height="100%"
          />
        </div>
      </CardContent>
    </Card>
  );
}
