"use client"
//import {MetricCard} from "./MetricCard";
import {SchoolCalendar} from "./school-calendar";
import {StudentTable} from "./StudentTable";
import {MessagesWidget} from "./messageWidget";
import {SchoolFinance} from "./schoolFinance";
import { PerformanceChart } from "./PerformanceChart";
import { RecentStudents } from "./recentStudent";
import { DashboardMetrics } from "./dashboardMetrics";
import { useEffect, useState } from "react";
import axiosInstance from "@/service/api";
import { Loader2 } from "lucide-react";

export function DashboardLayout () {
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [financialReport, setFinancialReport] = useState<any>(null);
  const [academicReport, setAcademicReport] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [inbox, setInbox] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          studentsRes, 
          teachersRes, 
          paymentsRes,
          financialRes,
          academicRes,
          eventsRes,
          inboxRes
        ] = await Promise.all([
          axiosInstance.get('/users?role=STUDENT'),
          axiosInstance.get('/users?role=TEACHER'),
          axiosInstance.get('/finance/payments'),
          axiosInstance.get('/reports/financial'),
          axiosInstance.get('/reports/academic'),
          axiosInstance.get('/events'),
          axiosInstance.get('/messages/inbox')
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
      }
    };

    fetchDashboardData();
  }, []);

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const confirmedPayments = payments.filter((p: any) => p.status === 'confirmed');
  const totalPayments = confirmedPayments.length;

  const recentStudentsList = [...students].reverse().slice(0, 5);
  const recentPaymentsList = payments.filter((p: any) => p.status === 'pending').slice(0, 5);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <DashboardMetrics 
              totalStudents={totalStudents} 
              totalTeachers={totalTeachers} 
              totalPayments={totalPayments} 
            />
            {/* Metrics */}
            <PerformanceChart report={academicReport} />
            
            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="xl:col-span-8 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SchoolCalendar events={events} />
                  <SchoolFinance report={financialReport} />
                </div>
                
                <StudentTable payments={recentPaymentsList} />
              </div>
              
              {/* Right Column */}
              <div className="xl:col-span-4 space-y-6">
                <RecentStudents students={recentStudentsList} />
                <MessagesWidget inbox={inbox} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};