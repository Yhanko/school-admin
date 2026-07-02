"use client"
//import {MetricCard} from "./MetricCard";
import {SchoolCalendar} from "./school-calendar";
import {StudentTable} from "./StudentTable";
import {MessagesWidget} from "./messageWidget";
import {SchoolFinance} from "./schoolFinance";
import { PerformanceChart } from "./PerformanceChart";
import { RecentStudents } from "./recentStudent";
import { DashboardMetrics } from "./dashboardMetrics";

export function DashboardLayout () {
  return (
    <div>
      <div className="pl-4 mb-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Resumo sobre a instituição</p>
      </div>
      <div className="flex bg-transparent">  
        {/* Main Content */}
        <div className="flex-1">
          {/* Dashboard Content */}
          <main className="p-2 space-y-2">
            <DashboardMetrics />
            {/* Metrics */}
            <PerformanceChart  />
            
            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="xl:col-span-8 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SchoolCalendar />
                  <SchoolFinance />
                </div>
                
                <StudentTable />
              </div>
              
              {/* Right Column */}
              <div className="xl:col-span-4 space-y-6">
                <RecentStudents />
                <MessagesWidget />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};