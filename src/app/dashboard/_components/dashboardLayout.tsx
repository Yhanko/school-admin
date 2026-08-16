"use client";

import { SchoolCalendar } from "./school-calendar";
import { StudentTable } from "./StudentTable";
import { MessagesWidget } from "./messageWidget";
import { SchoolFinance, FinanceReport } from "./schoolFinance";
import { PerformanceChart, PerformanceReport } from "./PerformanceChart";
import { RecentStudents } from "./recentStudent";
import { DashboardMetrics } from "./dashboardMetrics";
import { useEffect, useState } from "react";
import axiosInstance from "@/service/api";
import { Loader2, RefreshCw } from "@/lib/icons";
import { Button } from "@/components/ui/button";

export function DashboardLayout() {
  const [students, setStudents] = useState<Record<string, unknown>[]>([]);
  const [teachers, setTeachers] = useState<Record<string, unknown>[]>([]);
  const [payments, setPayments] = useState<Record<string, unknown>[]>([]);
  const [financialReport, setFinancialReport] = useState<FinanceReport | null>(null);
  const [academicReport, setAcademicReport] = useState<PerformanceReport | null>(null);
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  const [inbox, setInbox] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [
        studentsRes,
        teachersRes,
        paymentsRes,
        financialRes,
        academicRes,
        eventsRes,
        inboxRes,
      ] = await Promise.all([
        axiosInstance.get("/users?role=STUDENT"),
        axiosInstance.get("/users?role=TEACHER"),
        axiosInstance.get("/finance/payments"),
        axiosInstance.get("/reports/financial"),
        axiosInstance.get("/reports/academic"),
        axiosInstance.get("/events"),
        axiosInstance.get("/messages/inbox"),
      ]);

      setStudents(studentsRes.data);
      setTeachers(teachersRes.data);
      setPayments(paymentsRes.data.data || paymentsRes.data || []);
      setFinancialReport(financialRes.data);
      setAcademicReport(academicRes.data);
      setEvents(eventsRes.data);
      setInbox(inboxRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData();
  };

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const confirmedPayments = payments.filter(
    (p: Record<string, unknown>) => p.status === "confirmed" || p.status === "pago"
  );
  const totalPayments = confirmedPayments.length;

  const recentStudentsList = [...students].reverse().slice(0, 5);
  const recentPaymentsList = payments
    .filter((p: Record<string, unknown>) => p.status === "pending" || p.status === "pendente")
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full space-y-3 font-hanken">
        <div className="relative">
          <Loader2 className="w-10 h-10 animate-spin text-[#8B5CF6]" />
          <div className="absolute inset-0 rounded-full blur-md bg-[#8B5CF6]/30 animate-pulse" />
        </div>
        <span className="label-caps text-[#d5c4ac]">
          Carregando dados da instituição...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 font-hanken text-[#e5e2e1]">
      {/* Header Mission Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#414042] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
            <h1 className="headline-lg text-[#e5e2e1]">Painel Principal</h1>
          </div>
          <p className="body-md text-[#d5c4ac] mt-1">
            Visão geral em tempo real de telemetria académica, financeira e operacional
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="secondary"
            className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#1c1b1b] rounded h-10 px-4 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8B5CF6] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "A Atualizar..." : "Atualizar Dados"}</span>
          </Button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="space-y-6">
        {/* Metric Cards Top Row */}
        <DashboardMetrics
          totalStudents={totalStudents}
          totalTeachers={totalTeachers}
          totalPayments={totalPayments}
        />

        {/* Academic Performance Chart */}
        <PerformanceChart report={academicReport} />

        {/* Multi-column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column (8 cols) */}
          <div className="xl:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SchoolCalendar events={events} />
              <SchoolFinance report={financialReport} payments={payments} />
            </div>

            <StudentTable payments={recentPaymentsList} />
          </div>

          {/* Right Column (4 cols) */}
          <div className="xl:col-span-4 space-y-6">
            <RecentStudents students={recentStudentsList} />
            <MessagesWidget inbox={inbox} />
          </div>
        </div>
      </div>
    </div>
  );
}