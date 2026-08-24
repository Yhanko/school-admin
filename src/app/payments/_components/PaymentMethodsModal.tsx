"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/service/api";
import { Loader2 } from "@/lib/icons";

interface PaymentMethodsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentMethodsModal({ open, onOpenChange }: PaymentMethodsModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [data, setData] = useState({
    iban: "",
    multicaixaExpress: "",
    paymentReference: ""
  });

  useEffect(() => {
    if (open) {
      loadInstitutionData();
    }
  }, [open]);

  const loadInstitutionData = async () => {
    setIsLoading(true);
    try {
      // The API probably has an endpoint to get the institution details
      const response = await axiosInstance.get("/institutions/me/subscription"); 
      // Using /me/subscription because it returns the institution data in current implementation.
      const inst = response.data?.institution || response.data; 
      
      setData({
        iban: inst?.iban || "",
        multicaixaExpress: inst?.multicaixaExpress || "",
        paymentReference: inst?.paymentReference || "",
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os métodos de pagamento atuais.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.patch("/institutions/me", data);
      toast({
        title: "Sucesso",
        description: "Métodos de pagamento atualizados.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao guardar dados:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar os métodos de pagamento.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#FAFBFD] dark:bg-[#1A1A1A] text-[#090D16] dark:text-[#e5e2e1] border-[#CBD5E1] dark:border-[#414042]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-hanken">Configurar Métodos de Pagamento</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-5 mt-2">
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN Principal</Label>
              <Input
                id="iban"
                placeholder="AO06 0000 0000 0000 0000 0000 0"
                value={data.iban}
                onChange={(e) => setData({ ...data, iban: e.target.value })}
                className="bg-white dark:bg-[#131313] border-[#CBD5E1] dark:border-[#414042]"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">Usado para transferências bancárias regulares.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="multicaixaExpress">Número Multicaixa Express</Label>
              <Input
                id="multicaixaExpress"
                placeholder="Ex: 923 000 000"
                value={data.multicaixaExpress}
                onChange={(e) => setData({ ...data, multicaixaExpress: e.target.value })}
                className="bg-white dark:bg-[#131313] border-[#CBD5E1] dark:border-[#414042]"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">Número de telefone associado à conta para pagamento direto via MCX.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentReference">Dados de Pagamento por Referência</Label>
              <Input
                id="paymentReference"
                placeholder="Ex: Entidade: 00000"
                value={data.paymentReference}
                onChange={(e) => setData({ ...data, paymentReference: e.target.value })}
                className="bg-white dark:bg-[#131313] border-[#CBD5E1] dark:border-[#414042]"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">Entidade ou outras instruções para pagamentos por referência.</p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-[#CBD5E1] dark:border-[#414042]"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary hover:bg-[#A78BFA] text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    A Guardar...
                  </>
                ) : (
                  "Guardar Alterações"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
