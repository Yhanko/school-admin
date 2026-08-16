"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { TrendingUp, Award } from "@/lib/icons";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="h-64 sm:h-72 w-full flex items-center justify-center text-xs text-[#d5c4ac] data-mono">
      Carregando telemetria...
    </div>
  ),
});

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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const portugueseMonths = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const categories =
    report?.monthlyPerformance?.map((m: MonthlyPerf, i: number) => {
      return m.month || portugueseMonths[i % 12];
    }) || portugueseMonths;

  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 280,
      toolbar: {
        show: false,
      },
      background: "transparent",
      fontFamily: "Hanken Grotesk, sans-serif",
    },
    colors: ["#8B5CF6", "#C0C2C5"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#d5c4ac",
          fontSize: "11px",
          fontFamily: "JetBrains Mono, monospace",
        },
      },
    },
    yaxis: {
      show: true,
      labels: {
        style: {
          colors: "#d5c4ac",
          fontSize: "11px",
          fontFamily: "JetBrains Mono, monospace",
        },
      },
    },
    grid: {
      borderColor: "#414042",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Hanken Grotesk, sans-serif",
      },
      x: {
        show: true,
      },
    },
  };

  const attData =
    report?.monthlyPerformance?.map((m: MonthlyPerf) => m.attendance ?? 0) || [
      65, 75, 70, 80, 85, 75, 90, 85, 95, 90, 100, 95,
    ];
  const gradeData =
    report?.monthlyPerformance?.map((m: MonthlyPerf) => m.grade ?? 0) || [
      55, 65, 60, 70, 75, 65, 80, 75, 85, 80, 90, 85,
    ];

  const chartSeries = [
    {
      name: "Assiduidade (%)",
      data: attData,
    },
    {
      name: "Média de Notas",
      data: gradeData,
    },
  ];

  return (
    <div className="bg-[#121212] border border-[#414042] rounded-lg p-5 font-hanken text-[#e5e2e1] space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#414042] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="headline-sm text-[#e5e2e1]">Desempenho Académico</h2>
          </div>
          <p className="text-xs text-[#d5c4ac] mt-0.5">
            Acompanhamento comparativo entre assiduidade e médias globais
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="flex items-center gap-2 bg-[#1c1b1b] border border-[#414042] px-3 py-1.5 rounded">
            <div className="w-2.5 h-2.5 bg-[#8B5CF6] rounded-full shadow-[0_0_6px_#8B5CF6]"></div>
            <span className="font-bold data-mono text-[#DDD6FE]">
              {report?.overview?.attendanceRate || 85}%
            </span>
            <span className="label-caps text-[10px] text-[#d5c4ac]">
              Assiduidade
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[#1c1b1b] border border-[#414042] px-3 py-1.5 rounded">
            <div className="w-2.5 h-2.5 bg-[#C0C2C5] rounded-full"></div>
            <span className="font-bold data-mono text-[#e5e2e1]">
              {report?.overview?.averageGrade || 14.5}
            </span>
            <span className="label-caps text-[10px] text-[#d5c4ac]">
              Média Geral
            </span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-1">
        {mounted ? (
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height="100%"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-[#d5c4ac] data-mono">
            Carregando telemetria...
          </div>
        )}
      </div>
    </div>
  );
}
