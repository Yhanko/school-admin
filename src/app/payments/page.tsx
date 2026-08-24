"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Loader2, RefreshCw, DollarSign, ShieldAlert, Receipt } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { PaymentStats } from "./_components/PaymentStats";
import { PaymentSummary } from "./_components/PaymentSummary";
import { PaymentTable } from "./_components/PaymentTable";
import { LatePaymentsAlert } from "./_components/LatePaymentsAlert";
import { PaymentRecord } from "./_components/PaymentDetailModal";
import { DailyCashCloseModal } from "./_components/DailyCashCloseModal";
import { PaymentMethodsModal } from "./_components/PaymentMethodsModal";
import { Settings } from "lucide-react";

export default function Payments() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCashCloseOpen, setIsCashCloseOpen] = useState(false);
  const [isPaymentMethodsOpen, setIsPaymentMethodsOpen] = useState(false);

  const fetchPayments = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const response = await axiosInstance.get("/finance/payments");
      setPayments(response.data.data || response.data || []);
      if (isManualRefresh) {
        toast({
          title: "Telemetria Atualizada",
          description: "Dados financeiros sincronizados com o servidor.",
        });
      }
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
      toast({
        title: "Falha na Conexão",
        description: "Não foi possível carregar os registros de pagamentos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Dynamic calculations
  const stats = useMemo(() => {
    const total = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const paid = payments
      .filter((p) => p.status === "confirmed" || p.status === "pago")
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const pending = payments
      .filter((p) => p.status === "pending" || p.status === "pendente")
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const cancelled = payments
      .filter((p) => p.status === "cancelled")
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const paidRate = total > 0 ? (paid / total) * 100 : 0;
    const pendingRate = total > 0 ? (pending / total) * 100 : 0;
    const cancelledRate = total > 0 ? (cancelled / total) * 100 : 0;

    return {
      total,
      paid,
      pending,
      cancelled,
      paidRate,
      pendingRate,
      cancelledRate,
      totalCount: payments.length,
      cancelledCount: payments.filter((p) => p.status === "cancelled").length,
    };
  }, [payments]);

  // Export to PDF with yhankoEduca branded styling
  const exportToPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();

      // Mission Control Dark Header Band
      doc.setFillColor(19, 19, 19);
      doc.rect(0, 0, 210, 35, "F");

      // Title & Subtitle in Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(139, 92, 246); // Yhanko Purple
      doc.text("Yhanko Educa • Relatório Financeiro", 14, 16);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(200, 200, 200);
      doc.text(
        `Emitido em: ${new Date().toLocaleDateString("pt-PT")} às ${new Date().toLocaleTimeString("pt-PT")}`,
        14,
        24
      );

      // Section: Summary Cards in PDF
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      doc.text("Resumo de Desempenho & Arrecadação", 14, 46);

      // Draw Summary Box
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(14, 50, 182, 26, 2, 2, "F");

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text("TOTAL ESPERADO", 20, 58);
      doc.text("TOTAL RECEBIDO", 70, 58);
      doc.text("TOTAL PENDENTE", 120, 58);
      doc.text("TAXA EFICÁCIA", 165, 58);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 20, 20);
      doc.text(`${stats.total.toLocaleString()} Kz`, 20, 68);

      doc.setTextColor(45, 106, 79); // Green
      doc.text(`${stats.paid.toLocaleString()} Kz`, 70, 68);

      doc.setTextColor(180, 120, 0); // Gold/Amber
      doc.text(`${stats.pending.toLocaleString()} Kz`, 120, 68);

      doc.setTextColor(20, 20, 20);
      doc.text(`${stats.paidRate.toFixed(1)}%`, 165, 68);

      let currentY = 88;

      // Table helper
      const drawTable = (
        title: string,
        data: PaymentRecord[],
        startY: number,
        headerColor: [number, number, number]
      ) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
        doc.text(title, 14, startY);

        const tableData = data.map((payment, idx) => [
          payment.id?.substring(0, 8) || `TX-${idx + 1}`,
          payment.student?.name || "Desconhecido",
          payment.type || "Mensalidade",
          `${(payment.amount || 0).toLocaleString()} Kz`,
          payment.status === "confirmed" || payment.status === "pago"
            ? "Pago"
            : payment.status === "pending" || payment.status === "pendente"
            ? "Pendente"
            : "Cancelado",
          payment.paymentDate
            ? new Date(payment.paymentDate).toLocaleDateString("pt-PT")
            : "-",
        ]);

        autoTable(doc, {
          startY: startY + 4,
          head: [["ID / Ref", "Aluno", "Tipo", "Valor", "Status", "Data Liquidação"]],
          body: tableData,
          theme: "grid",
          headStyles: {
            fillColor: headerColor,
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          styles: {
            fontSize: 8,
            cellPadding: 3,
          },
        });

        // @ts-ignore - jspdf-autotable adds lastAutoTable
        return doc.lastAutoTable.finalY + 12;
      };

      const paidPayments = payments.filter((p) => p.status === "confirmed" || p.status === "pago");
      const pendingPayments = payments.filter((p) => p.status === "pending" || p.status === "pendente");

      if (paidPayments.length > 0) {
        currentY = drawTable(
          "PAGAMENTOS CONFIRMADOS / RECEBIDOS",
          paidPayments,
          currentY,
          [45, 106, 79]
        );
      }
      if (pendingPayments.length > 0) {
        currentY = drawTable(
          "PAGAMENTOS PENDENTES / EM COBRANÇA",
          pendingPayments,
          currentY,
          [180, 120, 0]
        );
      }

      doc.save("YhankoEduca_Relatorio_Pagamentos.pdf");
      toast({
        title: "Relatório Gerado",
        description: "O documento PDF foi exportado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast({
        title: "Erro ao Gerar PDF",
        description: "Ocorreu um erro durante a compilação do relatório.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center w-full min-h-[70vh] bg-[#FAFBFD] dark:bg-[#131313] text-[#090D16] dark:text-[#e5e2e1] space-y-4 font-hanken">
        <div className="relative">
          <Loader2 className="w-10 h-10 animate-spin text-[#7C3AED] dark:text-[#8B5CF6]" />
          <div className="absolute inset-0 rounded-full blur-md bg-primary/20 dark:bg-[#8B5CF6]/30 animate-pulse" />
        </div>
        <div className="text-center space-y-1">
          <p className="headline-sm text-[#090D16] dark:text-[#e5e2e1]">Carregando Telemetria</p>
          <p className="label-caps text-[#556575] dark:text-[#d5c4ac]">
            A conectar com o módulo financeiro yhankoEduca...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-full bg-[#FAFBFD] dark:bg-[#131313] text-[#090D16] dark:text-[#e5e2e1] px-4 sm:px-6 lg:px-8 py-6 space-y-6 overflow-x-hidden min-h-screen font-hanken">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#CBD5E1] dark:border-[#414042] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_#7C3AED]" />
            <h1 className="headline-lg text-[#090D16] dark:text-[#e5e2e1]">
              Gestão Financeira & Caixa
            </h1>
          </div>
          <p className="body-md text-[#556575] dark:text-[#d5c4ac] mt-1">
            Auditoria, conciliação, fecho de caixa diário e telemetria de propinas
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => setIsPaymentMethodsOpen(true)}
            variant="outline"
            className="border-[#CBD5E1] dark:border-[#414042] text-[#090D16] dark:text-[#e5e2e1] hover:bg-[#E2E6EA] dark:hover:bg-[#1A1A1A] rounded h-9 px-3.5 text-xs sm:text-sm font-semibold gap-2 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Métodos de Pagamento</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setIsCashCloseOpen(true)}
            className="bg-primary hover:bg-[#A78BFA] text-white font-bold rounded h-9 px-3.5 text-xs sm:text-sm gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>Fecho de Caixa Diário</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchPayments(true)}
            disabled={isRefreshing}
            className="border-[#CBD5E1] dark:border-[#414042] text-[#090D16] dark:text-[#e5e2e1] hover:bg-[#E2E6EA] dark:hover:bg-[#1A1A1A] rounded h-9 px-3.5 text-xs sm:text-sm font-semibold gap-2 transition-all cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-primary" : "text-[#556575] dark:text-[#d5c4ac]"}`}
            />
            <span>{isRefreshing ? "A Atualizar..." : "Sincronizar"}</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <PaymentStats
        totalAmount={stats.total}
        paidAmount={stats.paid}
        pendingAmount={stats.pending}
        cancelledAmount={stats.cancelled}
        totalCount={stats.totalCount}
        paidRate={stats.paidRate}
        pendingRate={stats.pendingRate}
        cancelledRate={stats.cancelledRate}
      />

      {/* Financial Summary & Gauge */}
      <PaymentSummary
        totalAmount={stats.total}
        paidAmount={stats.paid}
        pendingAmount={stats.pending}
        cancelledAmount={stats.cancelled}
        paidRate={stats.paidRate}
      />

      {/* Late Payments Alert Notice */}
      <LatePaymentsAlert
        cancelledCount={stats.cancelledCount}
        cancelledAmount={stats.cancelled}
      />

      {/* Payments Table & Subsystem */}
      <PaymentTable
        payments={payments}
        onExportPDF={exportToPDF}
        isExporting={isExporting}
      />

      {/* Daily Cash Close Modal */}
      <DailyCashCloseModal
        isOpen={isCashCloseOpen}
        onClose={() => setIsCashCloseOpen(false)}
        payments={payments}
      />
      <PaymentMethodsModal 
        open={isPaymentMethodsOpen}
        onOpenChange={setIsPaymentMethodsOpen}
      />
    </section>
  );
}