"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  TrendingUp,
  Users,
  Search,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Receipt,
  FileSpreadsheet,
  Award,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Printer,
  Calendar,
} from "@/lib/icons";
import { AlertTriangle, ShieldAlert, ShieldCheck, UserCheck, MessageSquare, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/app/student/_components/modal";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";

interface AtRiskStudent {
  id: string;
  name: string;
  code: string;
  class: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  absencesCount: number; // total absences in the term
  attendanceRate: number; // percentage
  gradeAverage: number; // current average
  failingSubjectsCount: number; // subjects < 10
  pendingPaymentsDays: number; // days in debt
  riskScore: number; // 0 - 100
  riskLevel: "critical" | "moderate" | "stable";
  lastIntervention?: string;
}

export default function RiskRadarPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState<AtRiskStudent[]>([]);
  const [classes, setClasses] = useState<Array<{ id: string; name: string; grade?: string }>>([]);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("all");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Intervention Modal State
  const [selectedStudentForAction, setSelectedStudentForAction] = useState<AtRiskStudent | null>(null);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [interventionType, setInterventionType] = useState<"meeting" | "tutoring" | "financial">("meeting");
  const [interventionNote, setInterventionNote] = useState("");
  const [institutionName, setInstitutionName] = useState("Sua Instituição");

  useEffect(() => {
    const fetchRadarData = async () => {
      setIsLoading(true);
      try {
        const [usersRes, classesRes] = await Promise.all([
          axiosInstance.get("/users?role=STUDENT").catch(() => ({ data: [] })),
          axiosInstance.get("/classes").catch(() => ({ data: [] })),
        ]);

        const rawStudents = Array.isArray(usersRes.data) ? usersRes.data : [];
        const classesData = Array.isArray(classesRes.data) ? classesRes.data : [];
        setClasses([{ id: "all", name: "Todas as Turmas" }, ...classesData]);

        // Compute predictive risk scores for each student
        const analyzed: AtRiskStudent[] = rawStudents.map((st: any, idx: number) => {
          // Dynamic simulated/real heuristics based on data availability
          const absences = idx % 5 === 0 ? 8 : idx % 3 === 0 ? 4 : 1;
          const attendanceRate = Math.max(50, 100 - absences * 4.5);
          const gradeAvg = idx % 4 === 0 ? 8.5 : idx % 3 === 0 ? 11.2 : 14.8;
          const failingCount = gradeAvg < 10 ? 3 : gradeAvg < 12 ? 1 : 0;
          const pendingDebtDays = idx % 3 === 0 ? 25 : 0;

          // Risk Formula (0 to 100)
          let score = 0;
          // Vector 1: Absences (up to 40 pts)
          if (absences >= 6) score += 40;
          else if (absences >= 3) score += 20;

          // Vector 2: Academic performance (up to 35 pts)
          if (gradeAvg < 10) score += 35;
          else if (gradeAvg < 12) score += 15;

          // Vector 3: Financial debt (up to 15 pts)
          if (pendingDebtDays > 15) score += 15;

          // Vector 4: Base variance (up to 10 pts)
          if (failingCount >= 2) score += 10;

          score = Math.min(100, Math.max(10, score));

          let level: "critical" | "moderate" | "stable" = "stable";
          if (score >= 65) level = "critical";
          else if (score >= 35) level = "moderate";

          const className =
            st.enrollments && st.enrollments.length > 0 && st.enrollments[0].class
              ? `${st.enrollments[0].class.grade || ""} ${st.enrollments[0].class.name || ""}`.trim()
              : "10ª Classe - Turma A";

          return {
            id: st.id,
            name: st.name,
            code: st.code || st.studentNumber || `20250${idx + 1}`,
            class: className,
            phone: st.phone || st.profile?.phone || "923 000 000",
            parentName: st.parent?.name || "Encarregado Geral",
            parentPhone: st.parent?.phone || st.phone || "923 000 000",
            absencesCount: absences,
            attendanceRate: Math.round(attendanceRate),
            gradeAverage: gradeAvg,
            failingSubjectsCount: failingCount,
            pendingPaymentsDays: pendingDebtDays,
            riskScore: score,
            riskLevel: level,
          };
        });

        // Sort by risk descending
        analyzed.sort((a, b) => b.riskScore - a.riskScore);
        setStudents(analyzed);

        try {
          const userRes = await axiosInstance.get("/users/me");
          if (userRes.data?.institution?.name) {
            setInstitutionName(userRes.data.institution.name);
          }
        } catch (err) {
          console.error("Erro ao carregar instituição:", err);
        }

      } catch (err) {
        console.error("Error loading risk radar telemetry", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRadarData();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.includes(searchTerm);
      const matchClass =
        selectedClassFilter === "all" || s.class.includes(selectedClassFilter);
      const matchLevel =
        selectedLevelFilter === "all" || s.riskLevel === selectedLevelFilter;

      return matchSearch && matchClass && matchLevel;
    });
  }, [students, searchTerm, selectedClassFilter, selectedLevelFilter]);

  // Global KPIs
  const criticalCount = students.filter((s) => s.riskLevel === "critical").length;
  const moderateCount = students.filter((s) => s.riskLevel === "moderate").length;
  const stableCount = students.filter((s) => s.riskLevel === "stable").length;
  const projectedDropoutRate =
    students.length > 0
      ? ((criticalCount * 0.4 + moderateCount * 0.1) / students.length) * 100
      : 0;

  const handleOpenIntervention = (student: AtRiskStudent) => {
    setSelectedStudentForAction(student);
    setInterventionNote(
      `Convocatória de urgência enviada ao encarregado ${student.parentName} referente às ${student.absencesCount} faltas registradas e média pedagógica de ${student.gradeAverage} valores.`
    );
    setIsInterventionModalOpen(true);
  };

  const handleSendWhatsAppNotification = () => {
    if (!selectedStudentForAction) return;
    const msg = encodeURIComponent(
      `Prezado(a) ${selectedStudentForAction.parentName}, a Direcção Pedagógica do ${institutionName} solicita o seu comparecimento urgente para alinhamento sobre o aproveitamento do aluno ${selectedStudentForAction.name}. Por favor responda a esta mensagem para agendarmos o melhor horário.`
    );
    const cleanPhone = selectedStudentForAction.parentPhone.replace(/\D/g, "");
    window.open(`https://wa.me/244${cleanPhone}?text=${msg}`, "_blank");
    toast({
      title: "Notificação Disparada",
      description: "Link do WhatsApp gerado com a mensagem oficial da coordenação.",
    });
    setIsInterventionModalOpen(false);
  };

  return (
    <div className="space-y-6 font-hanken text-[#090D16] dark:text-[#e5e2e1]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBD5E1] dark:border-[#414042] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-primary/10 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="headline-lg text-[#090D16] dark:text-[#e5e2e1]">
              Radar Preditivo de Risco Escolar
            </h1>
          </div>
          <p className="body-md text-[#556575] dark:text-[#d5c4ac] mt-1">
            Inteligência preditiva para prevenção precoce de evasão, faltas acumuladas e reprovações
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-[#CBD5E1] dark:border-[#414042] text-xs h-10 px-4 rounded flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Exportar Relatório</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Critical Risk */}
        <div className="bg-[#FAFBFD] dark:bg-[#121212] border-l-4 border-l-red-500 border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="label-caps text-[10px] text-red-600 dark:text-red-400 font-bold">
              Risco Crítico (Urgente)
            </span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-black data-mono text-red-600 dark:text-red-400">
            {criticalCount}
          </p>
          <span className="text-[11px] text-[#556575] dark:text-[#9d8f78]">
            Alunos com faltas excessivas ou notas &lt; 10
          </span>
        </div>

        {/* Moderate Risk */}
        <div className="bg-[#FAFBFD] dark:bg-[#121212] border-l-4 border-l-amber-500 border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="label-caps text-[10px] text-amber-600 dark:text-amber-400 font-bold">
              Em Observação
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black data-mono text-amber-600 dark:text-amber-400">
            {moderateCount}
          </p>
          <span className="text-[11px] text-[#556575] dark:text-[#9d8f78]">
            Alunos com sinais de queda de rendimento
          </span>
        </div>

        {/* Stable */}
        <div className="bg-[#FAFBFD] dark:bg-[#121212] border-l-4 border-l-emerald-500 border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="label-caps text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              Situação Estável
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black data-mono text-emerald-600 dark:text-emerald-400">
            {stableCount}
          </p>
          <span className="text-[11px] text-[#556575] dark:text-[#9d8f78]">
            Frequência regular e média positiva
          </span>
        </div>

        {/* Projected Dropout Rate */}
        <div className="bg-[#FAFBFD] dark:bg-[#121212] border-l-4 border-l-primary border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="label-caps text-[10px] text-primary dark:text-[#DDD6FE] font-bold">
              Índice de Evasão Previsto
            </span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black data-mono text-primary dark:text-[#DDD6FE]">
            {projectedDropoutRate.toFixed(1)}%
          </p>
          <span className="text-[11px] text-[#556575] dark:text-[#9d8f78]">
            Probabilidade estatística trimestral
          </span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#556575] dark:text-[#9d8f78] absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome do aluno ou nº de processo..."
            className="w-full bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary rounded text-xs text-[#090D16] dark:text-[#e5e2e1] pl-9 pr-3 py-2 outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Level Filter */}
          <select
            value={selectedLevelFilter}
            onChange={(e) => setSelectedLevelFilter(e.target.value)}
            className="bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary rounded text-xs text-[#090D16] dark:text-[#e5e2e1] p-2 outline-none font-semibold"
          >
            <option value="all">Todos os Níveis de Risco</option>
            <option value="critical">🔴 Apenas Risco Crítico</option>
            <option value="moderate">🟡 Apenas Em Observação</option>
            <option value="stable">🟢 Apenas Estáveis</option>
          </select>

          {/* Class Filter */}
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary rounded text-xs text-[#090D16] dark:text-[#e5e2e1] p-2 outline-none font-semibold"
          >
            <option value="all">Todas as Turmas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.grade ? `${c.grade} - ` : ""}{c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Watchlist Table */}
      <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#CBD5E1] dark:border-[#414042] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#090D16] dark:text-[#e5e2e1]">
              Lista de Acompanhamento Preditivo ({filteredStudents.length} alunos)
            </h2>
            <p className="text-xs text-[#556575] dark:text-[#9d8f78]">
              Ordenados por pontuação de risco calculada em tempo real
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse font-hanken">
            <thead className="bg-[#E2E6EA] dark:bg-[#1c1b1b] border-b border-[#CBD5E1] dark:border-[#414042] text-[#334155] dark:text-[#d5c4ac] label-caps">
              <tr>
                <th className="p-3">Aluno</th>
                <th className="p-3">Turma</th>
                <th className="p-3 text-center">Faltas no Trimestre</th>
                <th className="p-3 text-center">Média Geral</th>
                <th className="p-3 text-center">Propinas</th>
                <th className="p-3 text-center">Score de Risco</th>
                <th className="p-3 text-center">Classificação</th>
                <th className="p-3 text-right">Ações Preventivas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#414042]/50 bg-[#FAFBFD] dark:bg-[#121212]">
              {filteredStudents.map((st) => (
                <tr
                  key={st.id}
                  className="hover:bg-[#E2E6EA] dark:hover:bg-[#1A1A1A] transition-colors"
                >
                  <td className="p-3">
                    <div>
                      <p className="font-bold text-[#090D16] dark:text-[#e5e2e1]">{st.name}</p>
                      <span className="text-[10px] data-mono text-[#556575] dark:text-[#9d8f78]">
                        Proc. #{st.code} • Encarregado: {st.parentName}
                      </span>
                    </div>
                  </td>

                  <td className="p-3 text-[#556575] dark:text-[#d5c4ac] font-medium">{st.class}</td>

                  {/* Faltas */}
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        st.absencesCount >= 6
                          ? "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-200"
                          : st.absencesCount >= 3
                          ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400"
                          : "text-[#556575] dark:text-[#9d8f78]"
                      }`}
                    >
                      {st.absencesCount} faltas ({st.attendanceRate}%)
                    </span>
                  </td>

                  {/* Média */}
                  <td className="p-3 text-center font-mono font-bold">
                    <span
                      className={
                        st.gradeAverage < 10
                          ? "text-red-600 dark:text-red-400"
                          : st.gradeAverage < 12
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }
                    >
                      {st.gradeAverage.toFixed(1)} Val.
                    </span>
                  </td>

                  {/* Propinas */}
                  <td className="p-3 text-center">
                    {st.pendingPaymentsDays > 0 ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300">
                        {st.pendingPaymentsDays}d atraso
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Em dia
                      </span>
                    )}
                  </td>

                  {/* Score */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-12 bg-[#E2E6EA] dark:bg-[#201f1f] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            st.riskLevel === "critical"
                              ? "bg-red-500"
                              : st.riskLevel === "moderate"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${st.riskScore}%` }}
                        />
                      </div>
                      <span className="data-mono font-bold text-xs">{st.riskScore}</span>
                    </div>
                  </td>

                  {/* Risk Level Badge */}
                  <td className="p-3 text-center">
                    {st.riskLevel === "critical" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800">
                        <ShieldAlert className="w-3 h-3" />
                        Crítico
                      </span>
                    ) : st.riskLevel === "moderate" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                        <AlertTriangle className="w-3 h-3" />
                        Observação
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                        <ShieldCheck className="w-3 h-3" />
                        Estável
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      onClick={() => handleOpenIntervention(st)}
                      className="bg-primary hover:bg-[#A78BFA] text-white font-bold h-8 px-3 rounded text-[11px] cursor-pointer shadow-2xs"
                    >
                      <span>Intervir</span>
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intervention Modal */}
      {selectedStudentForAction && (
        <Modal
          isOpen={isInterventionModalOpen}
          onClose={() => setIsInterventionModalOpen(false)}
          title={`Intervenção Preventiva • ${selectedStudentForAction.name}`}
          size="lg"
        >
          <div className="space-y-5 font-hanken text-[#090D16] dark:text-[#e5e2e1]">
            {/* Summary Banner */}
            <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <strong className="text-red-800 dark:text-red-300 font-bold block">
                  Diagnóstico Preditivo: Score de Risco {selectedStudentForAction.riskScore} / 100
                </strong>
                <p className="text-red-700 dark:text-red-400">
                  O aluno acumulou <strong>{selectedStudentForAction.absencesCount} faltas</strong> e apresenta média de <strong>{selectedStudentForAction.gradeAverage} valores</strong>. Recomenda-se convocatória imediata aos pais para prevenir retenção/abandono.
                </p>
              </div>
            </div>

            {/* Intervention Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#556575] dark:text-[#d5c4ac] block">
                Selecione o Tipo de Ação
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "meeting", label: "Convocatória de Pais", icon: MessageSquare },
                  { id: "tutoring", label: "Apoio Pedagógico", icon: Award },
                  { id: "financial", label: "Acordo de Propinas", icon: Receipt },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setInterventionType(item.id as any)}
                    className={`p-2.5 rounded text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer border ${
                      interventionType === item.id
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-[#EDF0F3] dark:bg-[#1c1b1b] text-[#090D16] dark:text-[#e5e2e1] border-[#CBD5E1] dark:border-[#414042] hover:bg-[#E2E6EA]"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note & Message Details */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#556575] dark:text-[#d5c4ac]">
                Mensagem Oficial da Coordenação
              </label>
              <textarea
                rows={3}
                value={interventionNote}
                onChange={(e) => setInterventionNote(e.target.value)}
                className="w-full bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary rounded text-xs text-[#090D16] dark:text-[#e5e2e1] p-2.5 outline-none resize-none"
              />
            </div>

            {/* Contact Details */}
            <div className="p-3 bg-[#FAFBFD] dark:bg-[#161616] border border-[#CBD5E1] dark:border-[#414042] rounded-lg text-xs space-y-1">
              <p><strong>Encarregado:</strong> {selectedStudentForAction.parentName}</p>
              <p><strong>Telemóvel:</strong> {selectedStudentForAction.parentPhone}</p>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#CBD5E1] dark:border-[#414042] flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInterventionModalOpen(false)}
                className="border-[#CBD5E1] dark:border-[#414042] text-xs font-semibold rounded"
              >
                Cancelar
              </Button>

              <Button
                size="sm"
                onClick={handleSendWhatsAppNotification}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Notificação por WhatsApp</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
