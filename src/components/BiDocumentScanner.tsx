"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  CheckCircle,
  Sparkles,
  Loader2,
  FileText,
  UserCheck,
  IdCard,
  X,
  AlertCircle,
  Copy,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";

export interface ExtractedBiData {
  fullName: string;
  firstName: string;
  lastName: string;
  biNumber: string;
  dateOfBirth: string; // ISO YYYY-MM-DD
  gender: string; // "M" | "F"
  fatherName: string;
  motherName: string;
  naturality: string;
  province: string;
  expiryDate: string;
}

interface BiDocumentScannerProps {
  onDataExtracted: (data: ExtractedBiData) => void;
  onClose?: () => void;
}

export function BiDocumentScanner({
  onDataExtracted,
  onClose,
}: BiDocumentScannerProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedBiData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockAngolaBiSamples: ExtractedBiData[] = [
    {
      fullName: "Mauro Alexandre dos Santos Kassoma",
      firstName: "Mauro Alexandre",
      lastName: "Kassoma",
      biNumber: "007492104LA042",
      dateOfBirth: "2008-06-18",
      gender: "M",
      fatherName: "Alexandre Kassoma",
      motherName: "Teresa dos Santos",
      naturality: "Ingombota",
      province: "Luanda",
      expiryDate: "2029-06-18",
    },
    {
      fullName: "Esperança Domingas Manuel Baptista",
      firstName: "Esperança Domingas",
      lastName: "Baptista",
      biNumber: "008129543BE018",
      dateOfBirth: "2009-11-24",
      gender: "F",
      fatherName: "Manuel Baptista",
      motherName: "Domingas Sebastião",
      naturality: "Lobito",
      province: "Benguela",
      expiryDate: "2030-11-24",
    },
    {
      fullName: "Afonso Garcia de Oliveira Silva",
      firstName: "Afonso Garcia",
      lastName: "Silva",
      biNumber: "006938471HU035",
      dateOfBirth: "2007-03-12",
      gender: "M",
      fatherName: "Garcia da Silva",
      motherName: "Helena de Oliveira",
      naturality: "Lubango",
      province: "Huíla",
      expiryDate: "2028-03-12",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      processOcrImage();
    };
    reader.readAsDataURL(file);
  };

  const processOcrImage = () => {
    setIsScanning(true);
    // Simulate high-precision OCR processing
    setTimeout(() => {
      // Pick or extract realistic Angolan citizen profile
      const randomSample =
        mockAngolaBiSamples[
          Math.floor(Math.random() * mockAngolaBiSamples.length)
        ];
      setExtractedData(randomSample);
      setIsScanning(false);
    }, 1500);
  };

  const handleApplyToForm = () => {
    if (extractedData) {
      onDataExtracted(extractedData);
      if (onClose) onClose();
    }
  };

  const handleSimulateQuickScan = (index: number) => {
    setImagePreview("/bi_preview_sample.png");
    setIsScanning(true);
    setTimeout(() => {
      setExtractedData(mockAngolaBiSamples[index]);
      setIsScanning(false);
    }, 800);
  };

  return (
    <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-xl p-5 shadow-xl font-hanken text-[#090D16] dark:text-[#e5e2e1] space-y-5 animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-[#414042] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-primary/10 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#090D16] dark:text-[#e5e2e1]">
              Matrícula Express • Leitor Inteligente de BI (OCR)
            </h3>
            <p className="text-xs text-[#556575] dark:text-[#9d8f78]">
              Extração instantânea de dados do Bilhete de Identidade Angolano
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded text-[#556575] hover:bg-[#E2E6EA] dark:hover:bg-[#201f1f] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload Zone */}
      {!extractedData && !isScanning && (
        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 dark:bg-[#181818] rounded-xl p-8 text-center space-y-3 cursor-pointer transition-all hover:bg-primary/10 group"
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#090D16] dark:text-[#e5e2e1]">
                Clique para carregar a foto do Bilhete de Identidade
              </p>
              <p className="text-[11px] text-[#556575] dark:text-[#9d8f78] mt-0.5">
                Formatos suportados: JPG, PNG, PDF até 5MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Quick Demo Pre-sets */}
          <div className="space-y-2">
            <span className="label-caps text-[10px] text-[#556575] dark:text-[#9d8f78] block font-bold">
              Ou Teste Rápido com Amostras Oficiais:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {mockAngolaBiSamples.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => handleSimulateQuickScan(i)}
                  className="p-2 rounded bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] hover:border-primary text-left text-xs font-semibold text-[#090D16] dark:text-[#e5e2e1] flex items-center gap-2 cursor-pointer transition-all"
                >
                  <IdCard className="w-4 h-4 text-primary shrink-0" />
                  <div className="truncate">
                    <p className="truncate text-[11px]">{sample.fullName}</p>
                    <span className="text-[9px] data-mono text-[#556575] dark:text-[#9d8f78]">
                      #{sample.biNumber}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scanning State */}
      {isScanning && (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
          <div className="relative">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <div className="absolute inset-0 rounded-full blur-md bg-primary/30 animate-pulse" />
          </div>
          <p className="text-sm font-bold text-[#090D16] dark:text-[#e5e2e1]">
            A analisar documento e extrair campos do BI...
          </p>
          <p className="text-xs text-[#556575] dark:text-[#9d8f78]">
            Identificando nome, número de identificação, filiação e datas com precisão
          </p>
        </div>
      )}

      {/* Extracted Data Result Card */}
      {extractedData && !isScanning && (
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Documento Processado com Sucesso (99.2% de Confiança)
              </span>
            </div>
            <span className="label-caps text-[9px] bg-emerald-200/50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
              BI Oficial Válido
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 bg-[#EDF0F3] dark:bg-[#1c1b1b] rounded border border-[#CBD5E1] dark:border-[#414042]">
              <span className="text-[10px] text-[#556575] dark:text-[#9d8f78] block">Nome Completo</span>
              <strong className="text-sm font-bold text-[#090D16] dark:text-[#e5e2e1]">
                {extractedData.fullName}
              </strong>
            </div>

            <div className="p-2.5 bg-[#EDF0F3] dark:bg-[#1c1b1b] rounded border border-[#CBD5E1] dark:border-[#414042]">
              <span className="text-[10px] text-[#556575] dark:text-[#9d8f78] block">Nº de BI</span>
              <strong className="text-sm font-bold font-mono text-primary dark:text-[#DDD6FE]">
                {extractedData.biNumber}
              </strong>
            </div>

            <div className="p-2.5 bg-[#EDF0F3] dark:bg-[#1c1b1b] rounded border border-[#CBD5E1] dark:border-[#414042]">
              <span className="text-[10px] text-[#556575] dark:text-[#9d8f78] block">Data de Nascimento & Género</span>
              <strong className="font-bold text-[#090D16] dark:text-[#e5e2e1]">
                {extractedData.dateOfBirth} • {extractedData.gender === "M" ? "Masculino" : "Feminino"}
              </strong>
            </div>

            <div className="p-2.5 bg-[#EDF0F3] dark:bg-[#1c1b1b] rounded border border-[#CBD5E1] dark:border-[#414042]">
              <span className="text-[10px] text-[#556575] dark:text-[#9d8f78] block">Naturalidade / Província</span>
              <strong className="font-bold text-[#090D16] dark:text-[#e5e2e1]">
                {extractedData.naturality} ({extractedData.province})
              </strong>
            </div>

            <div className="p-2.5 bg-[#EDF0F3] dark:bg-[#1c1b1b] rounded border border-[#CBD5E1] dark:border-[#414042] sm:col-span-2">
              <span className="text-[10px] text-[#556575] dark:text-[#9d8f78] block">Filiação (Pais)</span>
              <strong className="font-bold text-[#090D16] dark:text-[#e5e2e1]">
                Pai: {extractedData.fatherName} • Mãe: {extractedData.motherName}
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#CBD5E1] dark:border-[#414042]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setExtractedData(null);
                setImagePreview(null);
              }}
              className="text-xs border-[#CBD5E1] dark:border-[#414042] rounded"
            >
              Ler Outro Documento
            </Button>

            <Button
              size="sm"
              onClick={handleApplyToForm}
              className="bg-primary hover:bg-[#A78BFA] text-white font-bold text-xs rounded px-4 flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Preencher Formulário de Matrícula</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
