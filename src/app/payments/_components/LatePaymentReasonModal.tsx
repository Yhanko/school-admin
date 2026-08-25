"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "@/lib/icons";

// ── Reason options ─────────────────────────────────────────────────────────
const LATE_REASONS = [
  { value: "tuition", emoji: "🎓", label: "Propina" },
  { value: "uniform", emoji: "👕", label: "Bata / Uniforme" },
  { value: "material", emoji: "📚", label: "Material Escolar" },
  { value: "confirmation", emoji: "✅", label: "Confirmação" },
  { value: "enrollment", emoji: "📝", label: "Matrícula" },
  { value: "other", emoji: "➕", label: "Outro" },
] as const;

type LateReason = (typeof LATE_REASONS)[number]["value"];

export interface LatePaymentReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  /** Callback when admin clicks "Registar Atraso" */
  onConfirm: (reason: LateReason, customReason?: string) => Promise<void>;
}

export function LatePaymentReasonModal({
  isOpen,
  onClose,
  studentName,
  onConfirm,
}: LatePaymentReasonModalProps) {
  const [selectedReason, setSelectedReason] = useState<LateReason>("tuition");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(
        selectedReason,
        selectedReason === "other" ? customReason.trim() : undefined,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1A1A1A] border border-[#414042] text-[#e5e2e1] shadow-[0_0_40px_rgba(251,191,36,0.08)] max-w-md p-0 rounded-lg font-hanken overflow-hidden">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#414042]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-900 border border-amber-700 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="headline-sm text-[#e5e2e1]">
                Registar Atraso de Pagamento
              </DialogTitle>
              <DialogDescription className="text-xs text-[#9d8f78] mt-0.5">
                Aluno:{" "}
                <span className="text-[#d5c4ac] font-semibold">
                  {studentName}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ── Body ───────────────────────────────────────────────────── */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-xs text-[#9d8f78]">
            Seleciona o motivo ou tipo de pagamento em atraso para registar
            corretamente na ficha do aluno.
          </p>

          {/* Reason cards */}
          <div className="grid grid-cols-2 gap-2">
            {LATE_REASONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setSelectedReason(r.value)}
                className={`flex items-center gap-2.5 px-3 py-3 rounded-lg border text-sm font-semibold transition-all cursor-pointer text-left ${
                  selectedReason === r.value
                    ? "border-amber-600 text-black shadow-[0_0_10px_rgba(251,191,36,0.15)]"
                    : "bg-[#1c1b1b] border-[#414042] text-[#C0C2C5] hover:border-[#C0C2C5] hover:text-[#e5e2e1]"
                }`}
              >
                <span className="text-base leading-none">{r.emoji}</span>
                <span className="text-xs">{r.label}</span>
              </button>
            ))}
          </div>

          {/* Custom reason input (only if "Outro" selected) */}
          {selectedReason === "other" && (
            <div className="space-y-1.5">
              <label className="label-caps text-[10px] text-[#9d8f78]">
                ESPECIFICA O MOTIVO
              </label>
              <input
                type="text"
                placeholder="Descreve o motivo do atraso..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                maxLength={120}
                className="w-full px-3 py-2.5 bg-[#0D0D0D] border border-[#414042] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/40 transition-all"
              />
            </div>
          )}

          {/* Summary pill */}
          <div className="flex items-center gap-2 p-2.5 rounded bg-[#0D0D0D] border border-[#414042]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <p className="text-[11px] text-[#d5c4ac]">
              O estado será alterado para{" "}
              <span className="font-bold text-amber-400">Em Atraso</span> com
              motivo:{" "}
              <span className="font-bold text-[#e5e2e1]">
                {selectedReason === "other"
                  ? customReason.trim() || "—"
                  : LATE_REASONS.find((r) => r.value === selectedReason)?.label}
              </span>
            </p>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="px-6 pb-6 pt-2 flex justify-end gap-3 border-t border-[#414042]">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-[#9d8f78] hover:text-[#e5e2e1] rounded text-xs"
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (selectedReason === "other" && !customReason.trim())
            }
            className="bg-amber-700 hover:bg-amber-600 text-white rounded text-xs font-bold px-5 gap-2 shadow-[0_0_12px_rgba(251,191,36,0.2)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {isSubmitting ? "A registar..." : "Registar Atraso"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
