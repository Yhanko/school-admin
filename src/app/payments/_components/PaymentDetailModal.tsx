"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/service/api";
import { useState } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Copy,
  User,
  Calendar,
  CreditCard,
  Hash,
} from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";
import { ShareWhatsappDialog } from "@/components/whatsapp/ShareWhatsappDialog";

export interface PaymentRecord {
  id?: string;
  student?: { name?: string; email?: string; id?: string };
  studentName?: string; // flat name fallback (some API responses omit nested student)
  type?: string;
  description?: string;
  amount?: number;
  status?: string;
  paymentMethod?: string;
  paymentDate?: string;
  createdAt?: string;
  proofUrl?: string;
}

interface PaymentDetailModalProps {
  payment: PaymentRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export function PaymentDetailModal({
  payment,
  isOpen,
  onClose,
  onUpdate,
}: PaymentDetailModalProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!payment) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await axiosInstance.patch(`/finance/payments/${payment.id}/status`, { status: newStatus });
      toast({
        title: "Status Atualizado",
        description: `O pagamento foi marcado como ${newStatus}.`,
      });
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do pagamento.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded label-caps bg-[#2D6A4F] text-[#e5e2e1] border border-[#2D6A4F]">
            <CheckCircle className="w-3.5 h-3.5" />
            CONFIRMADO (PAGO)
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded label-caps bg-[#8B5CF6] text-[#000000] border border-[#8B5CF6] font-bold">
            <Clock className="w-3.5 h-3.5" />
            PENDENTE
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded label-caps bg-[#9B2226] text-[#e5e2e1] border border-[#9B2226]">
            <AlertCircle className="w-3.5 h-3.5" />
            CANCELADO / ATRASADO
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded label-caps bg-[#353534] text-[#e5e2e1] border border-[#414042]">
            {status || "N/A"}
          </span>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1A1A1A] border border-[#C0C2C5] text-[#e5e2e1] shadow-[0_0_30px_rgba(139, 92, 246,0.12)] max-w-lg p-6 rounded-lg font-hanken">
        <DialogHeader className="border-b border-[#414042] pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="headline-sm text-[#e5e2e1]">
                  Telemetria do Pagamento
                </DialogTitle>
                <DialogDescription className="text-xs text-[#d5c4ac] mt-0.5">
                  Registro de transação e auditoria financeira
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Status & Amount Highlight */}
          <div className="p-4 rounded bg-[#121212] border border-[#414042] flex items-center justify-between">
            <div>
              <span className="label-caps text-[#9d8f78] block mb-1">
                STATUS ATUAL
              </span>
              {getStatusBadge(payment.status)}
            </div>
            <div className="text-right">
              <span className="label-caps text-[#9d8f78] block mb-1">
                VALOR LIQUIDADO
              </span>
              <div className="data-mono text-2xl font-bold text-[#DDD6FE]">
                {(payment.amount || 0).toLocaleString()} Kz
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3 text-sm">
            {/* Transaction ID */}
            <div className="flex items-center justify-between p-2.5 rounded bg-[#201f1f] border border-[#414042]">
              <span className="label-caps text-[#d5c4ac] flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-[#9d8f78]" />
                ID da Transação
              </span>
              <div className="flex items-center gap-2">
                <span className="data-mono text-xs text-[#DDD6FE] max-w-[180px] truncate">
                  {payment.id || "REC-" + Math.random().toString(36).substr(2, 9).toUpperCase()}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      payment.id || "REC-N/A",
                      "ID da Transação"
                    )
                  }
                  className="text-[#9d8f78] hover:text-[#DDD6FE] p-1 rounded transition-colors"
                  title="Copiar ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Student Info */}
            <div className="flex items-center justify-between p-2.5 rounded bg-[#201f1f] border border-[#414042]">
              <span className="label-caps text-[#d5c4ac] flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#9d8f78]" />
                Aluno / Titular
              </span>
              <span className="font-semibold text-[#e5e2e1]">
                {payment.student?.name || "Aluno Desconhecido"}
              </span>
            </div>

            {/* Payment Type */}
            <div className="flex items-center justify-between p-2.5 rounded bg-[#201f1f] border border-[#414042]">
              <span className="label-caps text-[#d5c4ac] flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-[#9d8f78]" />
                Tipo / Categoria
              </span>
              <span className="text-[#e5e2e1] px-2 py-0.5 rounded bg-[#121212] border border-[#414042] text-xs">
                {payment.type || "Mensalidade Escolar"}
              </span>
            </div>

            {/* Payment Date */}
            <div className="flex items-center justify-between p-2.5 rounded bg-[#201f1f] border border-[#414042]">
              <span className="label-caps text-[#d5c4ac] flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#9d8f78]" />
                Data de Liquidação
              </span>
              <span className="data-mono text-xs text-[#e5e2e1]">
                {payment.paymentDate
                  ? new Date(payment.paymentDate).toLocaleString("pt-PT")
                  : "Pendente"}
              </span>
            </div>

            {/* Registered at */}
            {payment.createdAt && (
              <div className="flex items-center justify-between p-2.5 rounded bg-[#201f1f] border border-[#414042]">
                <span className="label-caps text-[#d5c4ac] flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#9d8f78]" />
                  Data de Emissão
                </span>
                <span className="data-mono text-xs text-[#d5c4ac]">
                  {new Date(payment.createdAt).toLocaleString("pt-PT")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-4 border-t border-[#414042] flex justify-between gap-3 flex-wrap">
          <div className="flex gap-2">
            {payment.proofUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(payment.proofUrl, '_blank')}
                className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded text-xs gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                Ver Comprovativo
              </Button>
            )}
            {payment.proofUrl && payment.student?.id && (
              <ShareWhatsappDialog 
                contactId={payment.student.id} 
                mediaUrl={payment.proofUrl} 
              />
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={isUpdating || payment.status === 'cancelled'}
              style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none' }}
              className="rounded text-xs font-semibold hover:opacity-90"
            >
              Marcar Atraso
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusUpdate('pending')}
              disabled={isUpdating || payment.status === 'pending'}
              className="border-[#B45309] text-[#B45309] hover:bg-[#B45309]/10 rounded text-xs"
            >
              Marcar Pendente
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusUpdate('confirmed')}
              disabled={isUpdating || payment.status === 'confirmed'}
              style={{ backgroundColor: '#ffffff', color: '#16a34a', border: '1.5px solid #16a34a' }}
              className="rounded text-xs font-semibold hover:opacity-90"
            >
              Confirmar Pagamento
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isUpdating}
              className="border-[#C0C2C5] text-[#e5e2e1] hover:bg-[#201f1f] hover:border-white rounded text-xs cursor-pointer"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
