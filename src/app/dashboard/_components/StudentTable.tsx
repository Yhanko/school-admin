"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowRight } from "@/lib/icons";
import Link from "next/link";

interface DashboardPaymentItem {
  id?: string;
  type?: string;
  student?: { name?: string };
  amount?: number;
  status?: string;
  createdAt?: string;
}

export function StudentTable({
  payments = [],
}: {
  payments?: DashboardPaymentItem[];
}) {
  const getInitials = (name?: string) => {
    return name
      ? name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "AL";
  };

  const getStatusBadge = (status?: string) => {
    if (status === "pago" || status === "confirmed") {
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#2D6A4F] text-[#e5e2e1]">
          Confirmado
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#8B5CF6] text-black shadow-[0_0_6px_rgba(139, 92, 246,0.3)]">
        Pendente
      </span>
    );
  };

  return (
    <div className="bg-[#121212] border border-[#414042] rounded-lg p-5 font-hanken text-[#e5e2e1] space-y-4">
      <div className="flex items-center justify-between border-b border-[#414042] pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#8B5CF6]" />
          <h2 className="headline-sm text-[#e5e2e1]">Pagamentos Recentes</h2>
        </div>
        <Link
          href="/payments"
          className="text-xs text-[#DDD6FE] hover:text-[#8B5CF6] font-semibold flex items-center gap-1 transition-colors"
        >
          <span>Ver Todos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto rounded border border-[#414042]">
        <table className="min-w-full divide-y divide-[#414042]">
          <thead className="bg-[#1c1b1b]">
            <tr>
              <th className="px-4 py-3 text-left label-caps text-[#d5c4ac]">
                Aluno
              </th>
              <th className="px-4 py-3 text-left label-caps text-[#d5c4ac]">
                Ref. ID
              </th>
              <th className="px-4 py-3 text-left label-caps text-[#d5c4ac]">
                Serviço / Estado
              </th>
              <th className="px-4 py-3 text-right label-caps text-[#d5c4ac]">
                Valor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#414042]/50 bg-[#121212]">
            {payments.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-xs text-[#9d8f78] italic"
                >
                  Nenhum pagamento pendente ou recente registado no momento.
                </td>
              </tr>
            ) : (
              payments.map((payment, index) => (
                <tr
                  key={index}
                  className="even:bg-[#FAFBFD] odd:bg-[#EDF0F3] dark:even:bg-[#121212] dark:odd:bg-[#151515] hover:bg-[#DDE2E7] dark:hover:bg-[#1A1A1A] transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-8 w-8 bg-[#201f1f] border border-[#414042] rounded-full flex items-center justify-center">
                        <span className="text-[#DDD6FE] data-mono font-bold text-xs">
                          {getInitials(payment.student?.name)}
                        </span>
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-[#e5e2e1] truncate max-w-[150px] sm:max-w-[200px]">
                        {payment.student?.name || "Desconhecido"}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="data-mono text-xs text-[#DDD6FE]">
                      #{payment.id ? payment.id.split("-")[0] : "TX-000"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#d5c4ac]">
                        {payment.type || "Propina"}
                      </span>
                      {getStatusBadge(payment.status)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-xs sm:text-sm text-[#e5e2e1] data-mono">
                    {(payment.amount || 0).toLocaleString()} Kz
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {payments.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2 text-xs text-[#d5c4ac]">
          <p className="data-mono">
            A exibir{" "}
            <span className="font-semibold text-[#DDD6FE]">
              1-{Math.min(payments.length, 5)}
            </span>{" "}
            de <span className="font-semibold text-[#e5e2e1]">{payments.length}</span>{" "}
            registos
          </p>
          <div className="flex space-x-1.5">
            <Button
              size="sm"
              className="h-7 w-7 p-0 bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold rounded shadow-[0_0_8px_rgba(139, 92, 246,0.3)] text-xs"
            >
              1
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 w-7 p-0 border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#1c1b1b] rounded text-xs"
            >
              2
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}