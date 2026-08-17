"use client";

import React, { useState, useMemo } from "react";
import {
  Receipt,
  Printer,
  DollarSign,
  CreditCard,
  Building2,
  CheckCircle,
  Clock,
  UserCheck,
  Calendar,
  X,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Modal } from "@/app/student/_components/modal";
import { PaymentRecord } from "./PaymentDetailModal";
import { useAuth } from "@/store/useAuth";

export function DailyCashCloseModal({
  isOpen,
  onClose,
  payments,
}: {
  isOpen: boolean;
  onClose: () => void;
  payments: PaymentRecord[];
}) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [operatorFilter, setOperatorFilter] = useState("all");

  // Filter payments for the selected day that are confirmed/paid
  const dayPayments = useMemo(() => {
    return payments.filter((p) => {
      const pDate = p.createdAt || p.paymentDate;
      if (!pDate) return false;
      const isDay = pDate.startsWith(selectedDate);
      const isPaid = p.status === "confirmed" || p.status === "pago";
      return isDay && isPaid;
    });
  }, [payments, selectedDate]);

  // Breakdown by method
  const totals = useMemo(() => {
    let cash = 0;
    let tpa = 0;
    let transfer = 0;

    dayPayments.forEach((p) => {
      const amount = Number(p.amount) || 0;
      const method = (p.paymentMethod || "").toLowerCase();
      if (method.includes("dinheiro") || method.includes("cash") || method.includes("numerario")) {
        cash += amount;
      } else if (method.includes("tpa") || method.includes("multicaixa") || method.includes("card")) {
        tpa += amount;
      } else {
        transfer += amount;
      }
    });

    const total = cash + tpa + transfer;
    return { cash, tpa, transfer, total, count: dayPayments.length };
  }, [dayPayments]);

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Fecho de Caixa Diário"
      size="lg"
    >
      <div className="space-y-5 font-hanken text-[#090D16] dark:text-[#e5e2e1]">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-[#FAFBFD] dark:bg-[#161616] border border-[#CBD5E1] dark:border-[#414042] rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <label className="text-xs font-bold">Data do Fecho:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white dark:bg-[#201f1f] border border-[#CBD5E1] dark:border-[#414042] rounded px-2.5 py-1 text-xs font-semibold outline-none focus:border-primary"
            />
          </div>

          <Button
            size="sm"
            onClick={handlePrintSlip}
            className="bg-primary hover:bg-[#A78BFA] text-white font-bold rounded text-xs flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Talão de Fecho</span>
          </Button>
        </div>

        {/* Totals Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded">
            <span className="label-caps text-[9px] text-emerald-700 dark:text-emerald-400 block font-bold">
              Total Arrecadado
            </span>
            <p className="text-base font-bold data-mono text-emerald-800 dark:text-emerald-300">
              {totals.total.toLocaleString()} Kz
            </p>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
              {totals.count} pagamentos
            </span>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded">
            <span className="label-caps text-[9px] text-blue-700 dark:text-blue-400 block font-bold">
              Numerário (Dinheiro)
            </span>
            <p className="text-base font-bold data-mono text-blue-800 dark:text-blue-300">
              {totals.cash.toLocaleString()} Kz
            </p>
            <span className="text-[10px] text-blue-600 dark:text-blue-400">Caixa físico</span>
          </div>

          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded">
            <span className="label-caps text-[9px] text-purple-700 dark:text-purple-400 block font-bold">
              TPA / Multicaixa
            </span>
            <p className="text-base font-bold data-mono text-purple-800 dark:text-purple-300">
              {totals.tpa.toLocaleString()} Kz
            </p>
            <span className="text-[10px] text-purple-600 dark:text-purple-400">Terminal POS</span>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded">
            <span className="label-caps text-[9px] text-amber-700 dark:text-amber-400 block font-bold">
              Transferência
            </span>
            <p className="text-base font-bold data-mono text-amber-800 dark:text-amber-300">
              {totals.transfer.toLocaleString()} Kz
            </p>
            <span className="text-[10px] text-amber-600 dark:text-amber-400">Bancária</span>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="space-y-2">
          <span className="label-caps text-xs font-bold text-[#556575] dark:text-[#d5c4ac] block">
            Extrato de Transações do Dia ({dayPayments.length})
          </span>

          <div className="border border-[#CBD5E1] dark:border-[#414042] rounded-lg overflow-hidden max-h-60 overflow-y-auto">
            {dayPayments.length > 0 ? (
              <table className="w-full text-xs text-left">
                <thead className="bg-[#E2E6EA] dark:bg-[#1c1b1b] border-b border-[#CBD5E1] dark:border-[#414042] text-[#334155] dark:text-[#d5c4ac] label-caps">
                  <tr>
                    <th className="p-2.5">Aluno</th>
                    <th className="p-2.5">Descrição</th>
                    <th className="p-2.5">Método</th>
                    <th className="p-2.5 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#414042]/50 bg-[#FAFBFD] dark:bg-[#121212]">
                  {dayPayments.map((p, i) => (
                    <tr key={i} className="hover:bg-[#E2E6EA] dark:hover:bg-[#1A1A1A]">
                      <td className="p-2.5 font-semibold text-[#090D16] dark:text-[#e5e2e1]">
                        {p.student?.name || p.studentName || "Aluno Geral"}
                      </td>
                      <td className="p-2.5 text-[#556575] dark:text-[#d5c4ac] truncate max-w-[150px]">
                        {p.description || p.type || "Mensalidade"}
                      </td>
                      <td className="p-2.5 capitalize text-[#556575] dark:text-[#d5c4ac]">
                        {p.paymentMethod || "Multicaixa"}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-[#090D16] dark:text-[#e5e2e1]">
                        {Number(p.amount || 0).toLocaleString()} Kz
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center text-xs text-[#556575] dark:text-[#9d8f78]">
                Nenhum pagamento liquidado registrado nesta data ({selectedDate}).
              </div>
            )}
          </div>
        </div>

        {/* Footer info & Cashier Signature */}
        <div className="pt-4 border-t border-[#CBD5E1] dark:border-[#414042] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-[11px] text-[#556575] dark:text-[#9d8f78]">
            Operador de Caixa: <strong className="text-[#090D16] dark:text-[#e5e2e1]">{user?.name || "Secretaria Geral"}</strong>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-[#CBD5E1] dark:border-[#414042] text-xs font-semibold rounded"
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
