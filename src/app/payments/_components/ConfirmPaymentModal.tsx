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
import {
  CheckCircle,
  Download,
  FileText,
  AlertTriangle,
  Loader2,
} from "@/lib/icons";
import { ImageIcon, ExternalLink } from "lucide-react";

// ── Payment type labels (matches the rest of the module) ───────────────────
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

const PAYMENT_TYPE_OPTIONS = [
  { value: "tuition",      label: "Propina" },
  { value: "enrollment",   label: "Matrícula" },
  { value: "confirmation", label: "Confirmação" },
  { value: "material",     label: "Material Escolar" },
  { value: "uniform",      label: "Bata / Uniforme" },
  { value: "exam_sheet",   label: "Folha de Prova" },
  { value: "activity",     label: "Atividade" },
  { value: "other",        label: "Outro" },
];

const getTypeLabel = (t?: string): string =>
  t ? (TYPE_LABELS[t.toLowerCase()] ?? t) : "Pagamento";

const isImage = (url: string) =>
  /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i.test(url);

const isPdf = (url: string) => /\.pdf(\?|$)/i.test(url);

export interface ConfirmPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Student / payer name */
  studentName: string;
  /** Payment type key (e.g. "tuition") */
  paymentType?: string;
  /** Proof URL if available */
  proofUrl?: string | null;
  /** Amount in Kz */
  amount?: number;
  /** Callback when admin clicks "Confirm" — receives the (possibly corrected) type */
  onConfirm: (resolvedType: string) => Promise<void>;
}

export function ConfirmPaymentModal({
  isOpen,
  onClose,
  studentName,
  paymentType,
  proofUrl,
  amount,
  onConfirm,
}: ConfirmPaymentModalProps) {
  const [selectedType, setSelectedType] = useState<string>(
    paymentType || "tuition"
  );
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm(selectedType);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleDownload = () => {
    if (!proofUrl) return;
    const a = document.createElement("a");
    a.href = proofUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.download = `comprovativo_${studentName.replace(/\s/g, "_")}.pdf`;
    a.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1A1A1A] border border-[#414042] text-[#e5e2e1] shadow-[0_0_40px_rgba(34,197,94,0.1)] max-w-lg p-0 rounded-lg font-hanken overflow-hidden">
        {/* ── Header ───────────────────────────────────────────────────── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#414042]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-900/40 border border-emerald-700 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="headline-sm text-[#e5e2e1]">
                Confirmar Receção de Pagamento
              </DialogTitle>
              <DialogDescription className="text-xs text-[#9d8f78] mt-0.5">
                Aluno / Encarregado:{" "}
                <span className="text-[#d5c4ac] font-semibold">
                  {studentName}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* ── Amount highlight ─────────────────────────────────────── */}
          {amount !== undefined && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-900/20 border border-emerald-700/40">
              <span className="label-caps text-emerald-400 text-[10px]">
                VALOR A CONFIRMAR
              </span>
              <span className="data-mono text-xl font-bold text-emerald-400">
                {amount.toLocaleString()}{" "}
                <span className="text-sm font-normal text-[#9d8f78]">Kz</span>
              </span>
            </div>
          )}

          {/* ── Proof section ────────────────────────────────────────── */}
          <div>
            <p className="label-caps text-[#9d8f78] text-[10px] mb-2">
              COMPROVATIVO DE PAGAMENTO
            </p>
            {proofUrl ? (
              <div className="rounded-lg border border-[#414042] overflow-hidden bg-[#121212]">
                {/* Preview */}
                {isImage(proofUrl) ? (
                  <div className="relative w-full h-48 bg-[#0D0D0D] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={proofUrl}
                      alt="Comprovativo"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : isPdf(proofUrl) ? (
                  <div className="h-48 flex flex-col items-center justify-center gap-2 text-[#9d8f78] bg-[#0D0D0D]">
                    <FileText className="w-10 h-10 text-[#8B5CF6]" />
                    <span className="text-xs">Documento PDF anexado</span>
                  </div>
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center gap-2 text-[#9d8f78] bg-[#0D0D0D]">
                    <ImageIcon className="w-8 h-8 text-[#414042]" />
                    <span className="text-xs">Ficheiro anexado</span>
                  </div>
                )}

                {/* Actions row */}
                <div className="p-3 flex gap-2 border-t border-[#414042]">
                  <button
                    onClick={handleDownload}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#8B5CF6] text-xs font-bold hover:bg-[#8B5CF6]/25 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Descarregar
                  </button>
                  <button
                    onClick={() => window.open(proofUrl!, "_blank")}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded bg-[#201f1f] border border-[#414042] text-[#d5c4ac] text-xs font-bold hover:bg-[#252525] transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Abrir em separador
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-900/15 border border-amber-700/40">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-300">
                    Sem comprovativo anexado
                  </p>
                  <p className="text-[10px] text-[#9d8f78] mt-0.5">
                    O aluno/encarregado não enviou nenhum comprovativo. Podes
                    confirmar manualmente caso tenhas verificado o pagamento por
                    outro meio.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Payment type selector ────────────────────────────────── */}
          <div>
            <p className="label-caps text-[#9d8f78] text-[10px] mb-2">
              PARA QUE EFEITO É ESTE PAGAMENTO?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAYMENT_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedType(opt.value)}
                  className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer text-left truncate ${
                    selectedType === opt.value
                      ? "bg-emerald-900/40 border-emerald-600 text-emerald-300 shadow-[0_0_8px_rgba(34,197,94,0.2)]"
                      : "bg-[#1c1b1b] border-[#414042] text-[#9d8f78] hover:border-[#C0C2C5] hover:text-[#e5e2e1]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#9d8f78] mt-1.5">
              Tipo atual registado:{" "}
              <span className="text-[#d5c4ac] font-semibold">
                {getTypeLabel(paymentType)}
              </span>
              . Corrige se necessário antes de confirmar.
            </p>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div className="px-6 pb-6 pt-2 flex justify-end gap-3 border-t border-[#414042]">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isConfirming}
            className="text-[#9d8f78] hover:text-[#e5e2e1] rounded text-xs"
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={isConfirming}
            className="bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-bold px-5 gap-2 shadow-[0_0_12px_rgba(34,197,94,0.25)] transition-all cursor-pointer"
          >
            {isConfirming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {isConfirming ? "A confirmar..." : "Confirmar Pagamento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
