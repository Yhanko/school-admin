"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from 'next/dynamic';
import { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export function PerformanceChart () {
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: '#6B7280'
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
  }

  const chartSeries = [
    {
      name: 'Performance 1',
      data: [65, 75, 70, 80, 85, 75, 90, 85, 95, 90, 100, 95]
    },
    {
      name: 'Performance 2',
      data: [55, 65, 60, 70, 75, 65, 80, 75, 85, 80, 90, 85]
    }
  ]

  return (
    <Card className="chart-container">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">School Performance</CardTitle>
          <div className="flex space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-muted-foreground">1245</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
              <span className="text-muted-foreground">1356</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="area"
            height="100%"
          />
        </div>
      </CardContent>
    </Card>
  )
}

