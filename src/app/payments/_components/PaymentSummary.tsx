"use client";

import React from "react";
import { DollarSign, Percent, ShieldCheck } from "@/lib/icons";

interface PaymentSummaryProps {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  cancelledAmount: number;
  paidRate: number;
}

export function PaymentSummary({
  totalAmount,
  paidAmount,
  pendingAmount,
  cancelledAmount,
  paidRate,
}: PaymentSummaryProps) {
  return (
    <div className="bg-[#121212] border border-[#414042] rounded-lg p-5 sm:p-6 transition-all duration-200 hover:border-[#C0C2C5]/60 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#414042]/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
            <h2 className="headline-sm text-[#e5e2e1]">
              Resumo de Arrecadação & Desempenho Financeiro
            </h2>
          </div>
          <p className="body-md text-[#d5c4ac] mt-0.5">
            Monitoramento consolidado de liquidação de mensalidades e receitas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="label-caps px-2.5 py-1 rounded bg-[#201f1f] text-[#d5c4ac] border border-[#414042]">
            TELEMETRIA EM TEMPO REAL
          </span>
        </div>
      </div>

      {/* 4-Column Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Esperado */}
        <div className="p-4 rounded bg-[#1c1b1b] border border-[#414042]/80 space-y-1.5">
          <span className="label-caps text-[#d5c4ac] flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#9d8f78]" />
            Total Esperado
          </span>
          <div className="data-mono text-xl sm:text-2xl font-bold text-[#e5e2e1]">
            {totalAmount.toLocaleString()} <span className="text-xs text-[#9d8f78] font-normal">Kz</span>
          </div>
          <p className="text-[11px] text-[#9d8f78]">100% da carteira prevista</p>
        </div>

        {/* Total Recebido */}
        <div className="p-4 rounded bg-[#1c1b1b] border border-[#2D6A4F]/50 space-y-1.5">
          <span className="label-caps text-[#2D6A4F] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
            Total Recebido (Pago)
          </span>
          <div className="data-mono text-xl sm:text-2xl font-bold text-[#DDD6FE]">
            {paidAmount.toLocaleString()} <span className="text-xs text-[#9d8f78] font-normal">Kz</span>
          </div>
          <p className="text-[11px] text-[#d5c4ac]">
            Liquidado com sucesso ({paidRate.toFixed(1)}%)
          </p>
        </div>

        {/* Total Pendente */}
        <div className="p-4 rounded bg-[#1c1b1b] border border-[#8B5CF6]/40 space-y-1.5">
          <span className="label-caps text-[#8B5CF6] flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Total Pendente
          </span>
          <div className="data-mono text-xl sm:text-2xl font-bold text-[#e5e2e1]">
            {pendingAmount.toLocaleString()} <span className="text-xs text-[#9d8f78] font-normal">Kz</span>
          </div>
          <p className="text-[11px] text-[#d5c4ac]">Em processo de cobrança</p>
        </div>

        {/* Taxa de Eficácia */}
        <div className="p-4 rounded bg-[#1c1b1b] border border-[#414042]/80 space-y-1.5">
          <span className="label-caps text-[#d5c4ac] flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Taxa de Arrecadação
          </span>
          <div className="data-mono text-xl sm:text-2xl font-bold text-[#8B5CF6]">
            {paidRate.toFixed(1)}%
          </div>
          <p className="text-[11px] text-[#9d8f78]">Índice de liquidez corrente</p>
        </div>
      </div>

      {/* High-Precision Progress Bar */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between items-center text-xs">
          <span className="label-caps text-[#d5c4ac]">
            Progresso Geral de Arrecadação
          </span>
          <div className="flex items-center gap-3 data-mono text-xs">
            <span className="text-[#2D6A4F] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#2D6A4F]" /> Pago: {paidRate.toFixed(1)}%
            </span>
            <span className="text-[#8B5CF6] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Pendente: {totalAmount ? ((pendingAmount / totalAmount) * 100).toFixed(1) : 0}%
            </span>
            {cancelledAmount > 0 && (
              <span className="text-[#ffb4ab] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#9B2226]" /> Atraso: {totalAmount ? ((cancelledAmount / totalAmount) * 100).toFixed(1) : 0}%
              </span>
            )}
          </div>
        </div>

        {/* Dual / Tri-Segment Progress Bar */}
        <div className="w-full bg-[#0e0e0e] border border-[#414042] rounded h-3.5 overflow-hidden flex p-0.5 gap-0.5">
          {/* Confirmed portion */}
          <div
            className="bg-[#2D6A4F] h-full rounded-l transition-all duration-500 shadow-[0_0_8px_rgba(45,106,79,0.5)]"
            style={{ width: `${Math.min(paidRate, 100)}%` }}
            title={`Pago: ${paidRate.toFixed(1)}%`}
          />
          {/* Pending portion */}
          <div
            className="bg-[#8B5CF6] h-full transition-all duration-500 shadow-[0_0_8px_rgba(139, 92, 246,0.5)]"
            style={{
              width: `${totalAmount ? Math.min((pendingAmount / totalAmount) * 100, 100 - paidRate) : 0}%`,
            }}
            title="Pendente"
          />
          {/* Cancelled portion */}
          {cancelledAmount > 0 && (
            <div
              className="bg-[#9B2226] h-full rounded-r transition-all duration-500"
              style={{
                width: `${totalAmount ? Math.min((cancelledAmount / totalAmount) * 100, 100) : 0}%`,
              }}
              title="Atrasado / Cancelado"
            />
          )}
        </div>
      </div>
    </div>
  );
}
