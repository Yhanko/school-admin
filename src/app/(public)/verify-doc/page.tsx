"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, CheckCircle2, Building, Calendar, User, FileText, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function VerifyDocContent() {
  const searchParams = useSearchParams();
  const docNumber = searchParams.get("doc") || "DOC-2025/741892";
  const docType = searchParams.get("type") || "matricula";

  const getDocTypeName = (t: string) => {
    switch (t) {
      case "matricula":
        return "Declaração de Matrícula e Frequência";
      case "matricula_notas":
        return "Declaração com Notas de Aproveitamento";
      case "certificado":
        return "Certificado de Habilitações Literárias";
      case "transferencia":
        return "Guia Oficial de Transferência Escolar";
      default:
        return "Declaração Oficial Escolar";
    }
  };

  return (
    <div className="min-h-screen bg-[#ECEEF1] dark:bg-[#0B0F19] text-[#090D16] dark:text-[#F1F5F9] font-hanken flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Verification Success Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white text-center space-y-2">
          <div className="w-14 h-14 mx-auto bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/40 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold">Documento Autêntico e Válido</h1>
          <p className="text-xs text-emerald-100">
            Registo certificado e autenticado na base de dados oficial Yhanko Educa
          </p>
        </div>

        {/* Verified Data Details */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-[#EDF0F3] dark:bg-[#1c1b1b] rounded-lg border border-[#CBD5E1] dark:border-[#414042] space-y-1">
            <span className="label-caps text-[10px] text-[#556575] dark:text-[#9d8f78] block font-bold">
              Número de Registo Oficial
            </span>
            <p className="text-base font-bold data-mono text-primary dark:text-[#DDD6FE]">
              {docNumber}
            </p>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center gap-3 p-2.5 rounded bg-white dark:bg-[#161616] border border-[#CBD5E1] dark:border-[#333]">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <div>
                <span className="text-[10px] text-[#556575] dark:text-[#9d8f78] block">Tipo de Documento</span>
                <span className="font-bold text-[#090D16] dark:text-[#e5e2e1]">{getDocTypeName(docType)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded bg-white dark:bg-[#161616] border border-[#CBD5E1] dark:border-[#333]">
              <Building className="w-4 h-4 text-primary shrink-0" />
              <div>
                <span className="text-[10px] text-[#556575] dark:text-[#9d8f78] block">Instituição Emissora</span>
                <span className="font-bold text-[#090D16] dark:text-[#e5e2e1]">Complexo Escolar Yhanko Educa</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded bg-white dark:bg-[#161616] border border-[#CBD5E1] dark:border-[#333]">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <div>
                <span className="text-[10px] text-[#556575] dark:text-[#9d8f78] block">Ano Letivo de Referência</span>
                <span className="font-bold text-[#090D16] dark:text-[#e5e2e1]">2024 / 2025</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded bg-white dark:bg-[#161616] border border-[#CBD5E1] dark:border-[#333]">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-[#556575] dark:text-[#9d8f78] block">Assinatura Digital</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Certificado Criptograficamente Válido</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link href="/login">
              <Button variant="outline" className="w-full h-10 border-[#CBD5E1] dark:border-[#414042] text-xs font-semibold rounded">
                Aceder ao Portal Institucional
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#E2E6EA] dark:bg-[#181818] border-t border-[#CBD5E1] dark:border-[#414042] text-center text-[10px] text-[#556575] dark:text-[#9d8f78]">
          Sistema de Verificação e Autenticação Documental • Yhanko Educa
        </div>
      </div>
    </div>
  );
}

export default function VerifyDocPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm font-semibold">Validando documento...</p>
        </div>
      }
    >
      <VerifyDocContent />
    </Suspense>
  );
}
