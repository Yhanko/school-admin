"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  FileSpreadsheet,
  Loader2,
  Filter,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { PaymentRecord, PaymentDetailModal } from "./PaymentDetailModal";

interface PaymentTableProps {
  payments: PaymentRecord[];
  onExportPDF: () => void;
  isExporting: boolean;
}

type TabFilter = "all" | "confirmed" | "pending" | "cancelled";

export function PaymentTable({
  payments,
  onExportPDF,
  isExporting,
}: PaymentTableProps) {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => {
    setActiveSearch(searchTerm.trim().toLowerCase());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // Tab filter
      if (activeTab !== "all" && payment.status !== activeTab) {
        return false;
      }

      // Search filter
      if (activeSearch) {
        const studentName = payment.student?.name?.toLowerCase() || "";
        const type = payment.type?.toLowerCase() || "";
        const id = payment.id?.toLowerCase() || "";
        const matchesSearch =
          studentName.includes(activeSearch) ||
          type.includes(activeSearch) ||
          id.includes(activeSearch);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [payments, activeTab, activeSearch]);

  const counts = useMemo(() => {
    return {
      all: payments.length,
      confirmed: payments.filter((p) => p.status === "confirmed").length,
      pending: payments.filter((p) => p.status === "pending").length,
      cancelled: payments.filter((p) => p.status === "cancelled").length,
    };
  }, [payments]);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded label-caps bg-[#2D6A4F] text-[#e5e2e1] border border-[#2D6A4F]">
            <CheckCircle className="w-3 h-3" />
            Pago
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded label-caps bg-[#8B5CF6] text-[#000000] border border-[#8B5CF6] font-bold">
            <Clock className="w-3 h-3" />
            Pendente
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded label-caps bg-[#9B2226] text-[#e5e2e1] border border-[#9B2226]">
            <AlertCircle className="w-3 h-3" />
            Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded label-caps bg-[#353534] text-[#e5e2e1] border border-[#414042]">
            {status || "N/A"}
          </span>
        );
    }
  };

  const handleOpenDetail = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#121212] border border-[#414042] rounded-lg overflow-hidden transition-all duration-200 hover:border-[#C0C2C5]/60 flex flex-col">
      {/* Top Header & Search Controls */}
      <div className="p-4 sm:p-6 border-b border-[#414042] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#8B5CF6]" />
              <h3 className="headline-sm text-[#e5e2e1]">
                Pagamentos por Aluno
              </h3>
            </div>
            <p className="body-md text-[#d5c4ac] mt-0.5">
              Auditoria de transações individuais por aluno e período letivo
            </p>
          </div>

          {/* Action Bar (Search & Export) */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-84">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9d8f78]" />
              <input
                type="text"
                placeholder="Pesquisar por aluno, tipo ou ref..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-24 py-2.5 bg-[#0D0D0D] border border-[#414042] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] focus:outline-none focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] transition-all font-hanken"
              />
              <button
                onClick={handleSearch}
                type="button"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#8B5CF6] hover:bg-[#A78BFA] text-black text-xs font-bold rounded transition-all cursor-pointer shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)]"
              >
                Pesquisar
              </button>
            </div>

            {/* Export PDF Button */}
            <Button
              onClick={onExportPDF}
              disabled={isExporting}
              className="bg-[#8B5CF6] text-black hover:bg-[#A78BFA] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.5)] rounded text-xs sm:text-sm font-bold h-10 px-4 gap-2 transition-all cursor-pointer shrink-0 shadow-[0_0_8px_rgba(139, 92, 246,0.25)]"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isExporting ? "A Exportar..." : "Exportar PDF"}</span>
            </Button>
          </div>
        </div>

        {/* Tabs System */}
        <div className="flex items-center justify-start border-b border-[#414042] pt-2 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "all"
                ? "text-[#8B5CF6] border-[#8B5CF6] shadow-[0_4px_4px_-2px_rgba(139, 92, 246,0.5)]"
                : "text-[#d5c4ac] border-transparent hover:text-[#e5e2e1]"
            }`}
          >
            <span>Todos os Registos</span>
            <span className="data-mono px-1.5 py-0.2 rounded bg-[#201f1f] text-xs text-[#d5c4ac] border border-[#414042]">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("confirmed")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "confirmed"
                ? "text-[#8B5CF6] border-[#8B5CF6] shadow-[0_4px_4px_-2px_rgba(139, 92, 246,0.5)]"
                : "text-[#d5c4ac] border-transparent hover:text-[#e5e2e1]"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Confirmados (Pagos)</span>
            <span className="data-mono px-1.5 py-0.2 rounded bg-[#201f1f] text-xs text-[#2D6A4F] border border-[#2D6A4F]/40">
              {counts.confirmed}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "pending"
                ? "text-[#8B5CF6] border-[#8B5CF6] shadow-[0_4px_4px_-2px_rgba(139, 92, 246,0.5)]"
                : "text-[#d5c4ac] border-transparent hover:text-[#e5e2e1]"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Pendentes</span>
            <span className="data-mono px-1.5 py-0.2 rounded bg-[#201f1f] text-xs text-[#8B5CF6] border border-[#8B5CF6]/40">
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("cancelled")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === "cancelled"
                ? "text-[#8B5CF6] border-[#8B5CF6] shadow-[0_4px_4px_-2px_rgba(139, 92, 246,0.5)]"
                : "text-[#d5c4ac] border-transparent hover:text-[#e5e2e1]"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-[#9B2226]" />
            <span>Cancelados / Atrasados</span>
            <span className="data-mono px-1.5 py-0.2 rounded bg-[#201f1f] text-xs text-[#ffb4ab] border border-[#9B2226]/40">
              {counts.cancelled}
            </span>
          </button>
        </div>
      </div>

      {/* Desktop Data Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#1c1b1b] border-b border-[#414042]">
              <th className="py-3 px-4 label-caps text-[#d5c4ac]">
                Ref / Transação
              </th>
              <th className="py-3 px-4 label-caps text-[#d5c4ac]">
                Aluno / Titular
              </th>
              <th className="py-3 px-4 label-caps text-[#d5c4ac]">
                Tipo de Pagamento
              </th>
              <th className="py-3 px-4 label-caps text-[#d5c4ac] text-right">
                Valor (Kz)
              </th>
              <th className="py-3 px-4 label-caps text-[#d5c4ac] text-center">
                Status
              </th>
              <th className="py-3 px-4 label-caps text-[#d5c4ac]">
                Data Liquidação
              </th>
              <th className="py-3 px-4 label-caps text-[#d5c4ac] text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#414042]/50 bg-[#121212]">
            {filteredPayments.map((payment, idx) => {
              const refId =
                payment.id ||
                `TX-${(idx + 1).toString().padStart(4, "0")}`;
              const studentName = payment.student?.name || "Aluno Não Identificado";
              const initials = studentName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <tr
                  key={payment.id || idx}
                  className="transition-colors duration-150 even:bg-[#FAFBFD] odd:bg-[#EDF0F3] dark:even:bg-[#121212] dark:odd:bg-[#151515] hover:bg-[#DDE2E7] dark:hover:bg-[#1A1A1A] group"
                >
                  {/* Ref ID */}
                  <td className="py-3.5 px-4 data-mono text-xs text-[#DDD6FE] whitespace-nowrap">
                    {refId.substring(0, 10)}
                  </td>

                  {/* Student */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-[#201f1f] border border-[#414042] flex items-center justify-center text-[10px] font-bold text-[#e5e2e1] shrink-0">
                        {initials}
                      </div>
                      <span className="font-medium text-[#e5e2e1]">
                        {studentName}
                      </span>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 text-xs text-[#d5c4ac] whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded bg-[#1c1b1b] border border-[#414042]">
                      {payment.type || "Mensalidade"}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right data-mono font-bold text-[#DDD6FE] whitespace-nowrap">
                    {(payment.amount || 0).toLocaleString()}{" "}
                    <span className="text-[10px] text-[#9d8f78] font-normal">
                      Kz
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 data-mono text-xs text-[#d5c4ac] whitespace-nowrap">
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleDateString("pt-PT")
                      : "-"}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenDetail(payment)}
                      className="h-7.5 px-2.5 bg-transparent border border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#201f1f] rounded text-xs gap-1.5 cursor-pointer transition-all inline-flex items-center"
                      title="Ver telemetria detalhada"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span>Detalhes</span>
                    </Button>
                  </td>
                </tr>
              );
            })}

            {filteredPayments.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-sm text-[#9d8f78] space-y-2"
                >
                  <Filter className="w-8 h-8 text-[#414042] mx-auto mb-2" />
                  <p className="font-medium text-[#e5e2e1]">
                    Nenhum registro de pagamento encontrado
                  </p>
                  <p className="text-xs text-[#9d8f78]">
                    Tente ajustar o termo de busca ou alternar a aba de filtros.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden divide-y divide-[#414042]/50">
        {filteredPayments.map((payment, idx) => (
          <div
            key={payment.id || idx}
            className="p-4 space-y-3 bg-[#121212] hover:bg-[#1A1A1A] transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="data-mono text-[10px] text-[#9d8f78] block">
                  {payment.id?.substring(0, 10) || `TX-${idx + 1}`}
                </span>
                <p className="font-semibold text-sm text-[#e5e2e1] truncate">
                  {payment.student?.name || "Aluno Não Identificado"}
                </p>
                <p className="text-xs text-[#d5c4ac] mt-0.5">
                  {payment.type || "Mensalidade"}
                </p>
              </div>
              <div className="shrink-0">{getStatusBadge(payment.status)}</div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#414042]/40 text-xs">
              <div>
                <span className="label-caps text-[#9d8f78] block text-[9px]">
                  VALOR
                </span>
                <span className="data-mono font-bold text-sm text-[#DDD6FE]">
                  {(payment.amount || 0).toLocaleString()} Kz
                </span>
              </div>
              <div className="text-right">
                <span className="label-caps text-[#9d8f78] block text-[9px]">
                  DATA
                </span>
                <span className="data-mono text-xs text-[#d5c4ac]">
                  {payment.paymentDate
                    ? new Date(payment.paymentDate).toLocaleDateString("pt-PT")
                    : "-"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenDetail(payment)}
                className="border-[#414042] text-[#e5e2e1] hover:bg-[#201f1f] hover:text-[#8B5CF6] rounded h-8 px-2.5 text-xs"
              >
                <Eye className="w-3.5 h-3.5 mr-1" /> Detalhes
              </Button>
            </div>
          </div>
        ))}

        {filteredPayments.length === 0 && (
          <div className="p-8 text-center text-sm text-[#9d8f78]">
            <p className="font-medium text-[#e5e2e1]">Nenhum pagamento encontrado</p>
            <p className="text-xs text-[#9d8f78] mt-1">
              Verifique os filtros selecionados.
            </p>
          </div>
        )}
      </div>

      {/* Table Footer Telemetry Bar */}
      <div className="p-3 sm:px-6 bg-[#1c1b1b] border-t border-[#414042] flex items-center justify-between text-xs text-[#d5c4ac]">
        <span className="data-mono">
          A exibir <strong className="text-[#DDD6FE]">{filteredPayments.length}</strong> de{" "}
          <strong className="text-[#e5e2e1]">{payments.length}</strong> transações
        </span>
        <span className="label-caps text-[#9d8f78] hidden sm:inline">
          yhankoEduca • High-Precision Ledger
        </span>
      </div>

      {/* Payment Detail Modal */}
      <PaymentDetailModal
        payment={selectedPayment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayment(null);
        }}
      />
    </div>
  );
}
