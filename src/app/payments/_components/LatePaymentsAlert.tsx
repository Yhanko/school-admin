"use client";

import React from "react";
import { AlertCircle, Send, Bell } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LatePaymentsAlertProps {
  cancelledCount: number;
  cancelledAmount: number;
}

export function LatePaymentsAlert({
  cancelledCount,
  cancelledAmount,
}: LatePaymentsAlertProps) {
  const { toast } = useToast();

  const handleSendReminders = () => {
    toast({
      title: "Notificações Enviadas",
      description: `Lembretes de cobrança enviados para os ${cancelledCount} responsáveis.`,
    });
  };

  if (cancelledCount === 0) return null;

  return (
    <div className="bg-[#121212] border border-[#9B2226]/60 rounded-lg p-5 sm:p-6 transition-all duration-200 hover:border-[#9B2226] shadow-[0_0_20px_rgba(155,34,38,0.1)]">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded bg-[#9B2226]/20 border border-[#9B2226]/50 text-[#ffb4ab] shrink-0 mt-0.5">
            <AlertCircle className="w-6 h-6 text-[#ffb4ab]" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="headline-sm text-[#ffb4ab]">
                Atenção Operacional: Pagamentos Atrasados / Cancelados
              </h3>
              <span className="label-caps px-2 py-0.5 rounded bg-[#9B2226] text-[#e5e2e1] text-[10px]">
                {cancelledCount} REGISTROS
              </span>
            </div>
            <p className="body-md text-[#d5c4ac] max-w-3xl">
              Existem{" "}
              <strong className="text-[#e5e2e1] font-semibold">
                {cancelledCount} pagamentos
              </strong>{" "}
              não liquidados, totalizando{" "}
              <span className="data-mono font-bold text-[#DDD6FE]">
                {cancelledAmount.toLocaleString()} Kz
              </span>
              . Recomenda-se acionar o protocolo de notificação aos responsáveis e encarregados de educação.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:self-center shrink-0">
          <Button
            onClick={handleSendReminders}
            className="bg-[#9B2226] text-[#e5e2e1] hover:bg-[#b02a2f] border border-[#9B2226] rounded text-xs sm:text-sm font-semibold h-10 px-4 gap-2 transition-all duration-200 cursor-pointer shadow-[0_0_12px_rgba(155,34,38,0.3)]"
          >
            <Send className="w-4 h-4" />
            <span>Emitir Notificações</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
