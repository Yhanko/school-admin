"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Filter,
  Paperclip,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  User,
} from "@/lib/icons";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import { ConfirmPaymentModal } from "./ConfirmPaymentModal";
import { LatePaymentReasonModal } from "./LatePaymentReasonModal";

interface StudentPayment {
  id: string;
  type: string;
  amount: number;
  status: string;
  paymentMethod: string | null;
  paymentDate: string | null;
  proofUrl: string | null;
  createdAt: string;
}

export interface StudentOverview {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCode: string | null;
  className: string | null;
  payments: StudentPayment[];
  totalPaid: number;
  totalPending: number;
  hasOverdue: boolean;
  lastPaymentDate: string | null;
  overallStatus: "pago" | "pendente" | "atrasado" | "sem_pagamento";
}

const TYPE_LABELS: Record<string, string> = {
  tuition:      "Propina",
  enrollment:   "Matrícula",
  confirmation: "Confirmação",
  material:     "Material Escolar",
  uniform:      "Bata / Uniforme",
  exam_sheet:   "Folha de Prova",
  activity:     "Atividade",
  mensalidade:  "Propina",
  matricula:    "Matrícula",
  confirmacao:  "Confirmação",
  bata:         "Bata / Uniforme",
  folha_prova:  "Folha de Prova",
};
const getTypeLabel = (t?: string) =>
  t ? (TYPE_LABELS[t.toLowerCase()] ?? t) : "Pagamento";

type TabFilter = "all" | "pago" | "pendente" | "atrasado" | "sem_pagamento";

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pago":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/40 text-emerald-400 border border-emerald-700">
          <CheckCircle className="w-3 h-3" /> Pago
        </span>
      );
    case "em_validacao":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-900/40 text-sky-300 border border-sky-700">
          <Clock className="w-3 h-3" /> Em Validação
        </span>
      );
    case "pendente":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-violet-900/40 text-violet-300 border border-violet-700">
          <Clock className="w-3 h-3" /> Pendente
        </span>
      );
    case "atrasado":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-900/40 text-amber-400 border border-amber-700">
          <AlertTriangle className="w-3 h-3" /> Em Atraso
        </span>
      );
    case "cancelado":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/40 text-red-400 border border-red-700">
          <AlertCircle className="w-3 h-3" /> Cancelado
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#353534] text-[#9d8f78] border border-[#414042]">
          <AlertCircle className="w-3 h-3" /> Sem Pagamento
        </span>
      );
  }
}

function paymentNormalizedStatus(status?: string, proofUrl?: string | null): string {
  const s = status?.toLowerCase()?.trim() || "";
  if (["confirmed", "pago", "paid", "concluido"].includes(s)) return "pago";
  if (["cancelled", "cancelado", "rejected"].includes(s)) return "cancelado";
  if (["atrasado", "overdue", "late"].includes(s)) return "atrasado";
  if (["processing", "em validação", "em validacao", "aguarda validação", "aguarda validacao", "recebido", "submitted"].includes(s) || proofUrl) return "em_validacao";
  return "pendente";
}


interface Props {
  students: StudentOverview[];
  onUpdate: () => void;
  isLoading: boolean;
}

// ── Shape for the modal trigger context ───────────────────────────────────
interface ModalContext {
  studentId: string;
  studentName: string;
  paymentId: string | null;
  paymentType?: string;
  proofUrl?: string | null;
  amount?: number;
}

export function StudentsOverviewTable({ students, onUpdate, isLoading }: Props) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState<string | null>(null);

  // ── Modal state ────────────────────────────────────────────────────────
  const [confirmCtx, setConfirmCtx] = useState<ModalContext | null>(null);
  const [lateCtx, setLateCtx] = useState<ModalContext | null>(null);

  const toggleExpand = (id: string) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const counts = useMemo(
    () => ({
      all:          students.length,
      pago:         students.filter((s) => s.overallStatus === "pago").length,
      pendente:     students.filter((s) => s.overallStatus === "pendente").length,
      atrasado:     students.filter((s) => s.overallStatus === "atrasado").length,
      sem_pagamento:students.filter((s) => s.overallStatus === "sem_pagamento").length,
    }),
    [students]
  );

  const filtered = useMemo(() => {
    let list = students;
    if (activeTab !== "all") list = list.filter((s) => s.overallStatus === activeTab);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (s) =>
          s.studentName.toLowerCase().includes(q) ||
          s.className?.toLowerCase().includes(q) ||
          s.studentCode?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [students, activeTab, search]);

  const markStatus = async (studentId: string, paymentId: string | null, newStatus: string) => {
    setUpdating(studentId);
    try {
      if (paymentId) {
        // Update existing payment
        await axiosInstance.patch(`/finance/payments/${paymentId}/status`, { status: newStatus });
      } else {
        // Create a new synthetic payment record to mark the student
        await axiosInstance.post("/finance/payments", {
          studentId,
          type: "tuition",
          amount: 0,
          status: newStatus,
          description: "Marcado manualmente pelo administrador",
        });
      }
      toast({ title: "Estado atualizado", description: `Marcado como "${newStatus}" com sucesso.` });
      onUpdate();
    } catch {
      toast({ title: "Erro", description: "Não foi possível atualizar o estado.", variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  // ── Modal handlers ─────────────────────────────────────────────────────
  const handleOpenConfirm = (ctx: ModalContext) => setConfirmCtx(ctx);
  const handleOpenLate    = (ctx: ModalContext) => setLateCtx(ctx);

  const handleConfirmPayment = async (resolvedType: string) => {
    if (!confirmCtx) return;
    await markStatus(confirmCtx.studentId, confirmCtx.paymentId, "confirmed");
    setConfirmCtx(null);
  };

  const handleLatePayment = async () => {
    if (!lateCtx) return;
    await markStatus(lateCtx.studentId, lateCtx.paymentId, "atrasado");
    setLateCtx(null);
  };

  const TABS: { key: TabFilter; label: string; color: string }[] = [
    { key: "all",           label: "Todos",               color: "text-[#d5c4ac]" },
    { key: "pago",          label: "Pagos / Confirmados",  color: "text-emerald-400" },
    { key: "pendente",      label: "Pendentes",            color: "text-violet-400" },
    { key: "atrasado",      label: "Em Atraso",            color: "text-amber-400" },
    { key: "sem_pagamento", label: "Sem Pagamento",        color: "text-[#9d8f78]" },
  ];

  return (
    <div className="bg-[#121212] border border-[#414042] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#414042] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#8B5CF6]" />
            <div>
              <h3 className="headline-sm text-[#e5e2e1]">Todos os Alunos — Situação de Pagamento</h3>
              <p className="body-md text-[#d5c4ac] mt-0.5">
                Inclui alunos sem pagamentos registados. Clique numa linha para ver os detalhes.
              </p>
            </div>
          </div>
          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9d8f78]" />
            <input
              type="text"
              placeholder="Pesquisar por nome, turma, nº proc..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#0D0D0D] border border-[#414042] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] focus:outline-none focus:border-[#8B5CF6] transition-all"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-[#414042] overflow-x-auto gap-0">
          {TABS.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === key
                  ? "text-[#8B5CF6] border-[#8B5CF6]"
                  : "text-[#d5c4ac] border-transparent hover:text-[#e5e2e1]"
              }`}
            >
              {label}
              <span className={`px-1.5 py-0.5 rounded bg-[#201f1f] text-[10px] border border-[#414042] ${color}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#8B5CF6]" />
          <span className="text-sm text-[#9d8f78]">A carregar alunos...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#1c1b1b] border-b border-[#414042]">
                <th className="py-3 px-4 label-caps text-[#d5c4ac] w-10"></th>
                <th className="py-3 px-4 label-caps text-[#d5c4ac]">Aluno</th>
                <th className="py-3 px-4 label-caps text-[#d5c4ac]">Turma</th>
                <th className="py-3 px-4 label-caps text-[#d5c4ac] text-center">Pagamentos</th>
                <th className="py-3 px-4 label-caps text-[#d5c4ac] text-right">Total Pago</th>
                <th className="py-3 px-4 label-caps text-[#d5c4ac] text-right">Pendente</th>
                <th className="py-3 px-4 label-caps text-[#d5c4ac] text-center">Estado Global</th>
                <th className="py-3 px-4 label-caps text-[#d5c4ac] text-center">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#414042]/50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-[#9d8f78]">
                    <Filter className="w-8 h-8 text-[#414042] mx-auto mb-2" />
                    <p>Nenhum aluno encontrado</p>
                  </td>
                </tr>
              )}
              {filtered.map((s) => {
                const isExpanded = expandedIds.has(s.studentId);
                const initials = s.studentName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
                const latestPayment = s.payments[0] ?? null;
                const isLatestUnderValidation = latestPayment && paymentNormalizedStatus(latestPayment.status, latestPayment.proofUrl) === "em_validacao";
                const isUpdating = updating === s.studentId;

                return (
                  <React.Fragment key={s.studentId}>
                    {/* Main row */}
                    <tr
                      onClick={() => toggleExpand(s.studentId)}
                      className="cursor-pointer hover:bg-[#1A1A1A] transition-colors group"
                    >
                      {/* Expand toggle */}
                      <td className="py-3 px-4 text-center text-[#9d8f78]">
                        {s.payments.length > 0 ? (
                          isExpanded
                            ? <ChevronDown className="w-4 h-4 text-[#8B5CF6]" />
                            : <ChevronRight className="w-4 h-4" />
                        ) : (
                          <span className="text-[10px] text-[#414042]">—</span>
                        )}
                      </td>

                      {/* Student */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded bg-[#201f1f] border border-[#414042] flex items-center justify-center text-[10px] font-bold text-[#e5e2e1] shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-[#e5e2e1] text-xs">{s.studentName}</p>
                            {s.studentCode && <p className="text-[10px] text-[#9d8f78]">#{s.studentCode}</p>}
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-4 text-[#d5c4ac]">{s.className ?? "—"}</td>

                      {/* Payment count */}
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-[#1c1b1b] border border-[#414042] text-[#d5c4ac] font-mono">
                          {s.payments.length}
                        </span>
                      </td>

                      {/* Total Paid */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                        {s.totalPaid.toLocaleString()} <span className="text-[10px] text-[#9d8f78] font-normal">Kz</span>
                      </td>

                      {/* Total Pending */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-violet-400">
                        {s.totalPending > 0 ? (
                          <>{s.totalPending.toLocaleString()} <span className="text-[10px] text-[#9d8f78] font-normal">Kz</span></>
                        ) : (
                          <span className="text-[#414042]">—</span>
                        )}
                      </td>

                      {/* Overall Status */}
                      <td className="py-3 px-4 text-center"><StatusBadge status={s.overallStatus} /></td>

                      {/* Quick Actions */}
                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* Mark overdue — shown when there's an expected payment (not paid) but not when it's under validation */}
                          {s.overallStatus !== "pago" && !isLatestUnderValidation && s.overallStatus !== "atrasado" && (
                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                handleOpenLate({
                                  studentId: s.studentId,
                                  studentName: s.studentName,
                                  paymentId: latestPayment?.id ?? null,
                                  paymentType: latestPayment?.type,
                                })
                              }
                              title="Registar atraso"
                              className="px-2 py-1 rounded bg-amber-900 border border-amber-700 text-amber-400 text-[10px] font-bold hover:bg-amber-900/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                              {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : "⚠ Atraso"}
                            </button>
                          )}

                          {/* Confirm paid — visível APENAS quando o aluno tem um pagamento submetido (em validação) */}
                          {isLatestUnderValidation && (
                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                handleOpenConfirm({
                                  studentId: s.studentId,
                                  studentName: s.studentName,
                                  paymentId: latestPayment!.id,
                                  paymentType: latestPayment!.type,
                                  proofUrl: latestPayment!.proofUrl,
                                  amount: latestPayment!.amount,
                                })
                              }
                              title="Confirmar pagamento recebido"
                              className="px-2 py-1 rounded bg-emerald-900 border border-emerald-700 text-emerald-400 text-[10px] font-bold hover:bg-emerald-900/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                              ✓ Confirmar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded payments */}
                    {isExpanded && s.payments.length > 0 && (
                      <tr>
                        <td colSpan={8} className="bg-[#0D0D0D] border-b border-[#414042]/50">
                          <div className="px-6 py-3">
                            <p className="label-caps text-[10px] text-[#9d8f78] mb-2">HISTÓRICO DE PAGAMENTOS</p>
                            <table className="w-full text-[11px]">
                              <thead>
                                <tr className="border-b border-[#414042] text-[#9d8f78]">
                                  <th className="py-1.5 pr-4 text-left label-caps">Tipo</th>
                                  <th className="py-1.5 pr-4 text-right label-caps">Valor</th>
                                  <th className="py-1.5 pr-4 text-center label-caps">Estado</th>
                                  <th className="py-1.5 pr-4 text-center label-caps">Comprovativo</th>
                                  <th className="py-1.5 text-left label-caps">Data</th>
                                  <th className="py-1.5 text-center label-caps">Ação</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#414042]/30">
                                {s.payments.map((p) => (
                                  <tr key={p.id} className="hover:bg-[#1a1a1a]">
                                    <td className="py-2 pr-4 font-semibold text-[#e5e2e1]">{getTypeLabel(p.type)}</td>
                                    <td className="py-2 pr-4 text-right font-mono text-[#DDD6FE]">
                                      {p.amount.toLocaleString()} Kz
                                    </td>
                                    <td className="py-2 pr-4 text-center">
                                      <StatusBadge status={paymentNormalizedStatus(p.status, p.proofUrl)} />
                                    </td>
                                    <td className="py-2 pr-4 text-center">
                                      {p.proofUrl ? (
                                        <button
                                          onClick={() => window.open(p.proofUrl!, "_blank")}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#8B5CF6] text-[10px] font-bold hover:bg-[#8B5CF6]/25 cursor-pointer"
                                        >
                                          <Paperclip className="w-3 h-3" /> Ver
                                        </button>
                                      ) : (
                                        <span className="text-[#414042] italic">Sem anexo</span>
                                      )}
                                    </td>
                                    <td className="py-2 font-mono text-[#9d8f78]">
                                      {p.paymentDate
                                        ? new Date(p.paymentDate).toLocaleDateString("pt-PT")
                                        : new Date(p.createdAt).toLocaleDateString("pt-PT")}
                                    </td>
                                    <td className="py-2 text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        {/* Atraso — only shown if payment is pending (not paid and not under validation) */}
                                        {paymentNormalizedStatus(p.status, p.proofUrl) === "pendente" && (
                                          <button
                                            onClick={() =>
                                              handleOpenLate({
                                                studentId: s.studentId,
                                                studentName: s.studentName,
                                                paymentId: p.id,
                                                paymentType: p.type,
                                              })
                                            }
                                            className="px-1.5 py-0.5 rounded bg-amber-900/30 border border-amber-700/50 text-amber-400 text-[10px] hover:bg-amber-900/50 cursor-pointer"
                                          >
                                            Atraso
                                          </button>
                                        )}
                                        {/* Confirmar — visible ONLY when payment is submitted/processing (em_validacao) */}
                                        {paymentNormalizedStatus(p.status, p.proofUrl) === "em_validacao" && (
                                          <button
                                            onClick={() =>
                                              handleOpenConfirm({
                                                studentId: s.studentId,
                                                studentName: s.studentName,
                                                paymentId: p.id,
                                                paymentType: p.type,
                                                proofUrl: p.proofUrl,
                                                amount: p.amount,
                                              })
                                            }
                                            className="px-1.5 py-0.5 rounded bg-emerald-900/30 border border-emerald-700/50 text-emerald-400 text-[10px] hover:bg-emerald-900/50 cursor-pointer"
                                          >
                                            Confirmar
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 px-6 bg-[#1c1b1b] border-t border-[#414042] flex items-center justify-between text-xs text-[#d5c4ac]">
        <span className="font-mono">
          A exibir <strong className="text-[#DDD6FE]">{filtered.length}</strong> de{" "}
          <strong className="text-[#e5e2e1]">{students.length}</strong> alunos
        </span>
        <span className="label-caps text-[#9d8f78] hidden sm:inline">• Gestão por Aluno</span>
      </div>

      {/* ── Confirm Payment Modal ─────────────────────────────────────── */}
      {confirmCtx && (
        <ConfirmPaymentModal
          isOpen={!!confirmCtx}
          onClose={() => setConfirmCtx(null)}
          studentName={confirmCtx.studentName}
          paymentType={confirmCtx.paymentType}
          proofUrl={confirmCtx.proofUrl}
          amount={confirmCtx.amount}
          onConfirm={handleConfirmPayment}
        />
      )}

      {/* ── Late Payment Reason Modal ─────────────────────────────────── */}
      {lateCtx && (
        <LatePaymentReasonModal
          isOpen={!!lateCtx}
          onClose={() => setLateCtx(null)}
          studentName={lateCtx.studentName}
          onConfirm={handleLatePayment}
        />
      )}
    </div>
  );
}
