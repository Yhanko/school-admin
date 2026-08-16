"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileCheck,
  Printer,
  Download,
  Search,
  CheckCircle,
  QrCode,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Loader2,
  Calendar,
  Sparkles,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import { useAuth } from "@/store/useAuth";

interface StudentOption {
  id: string;
  name: string;
  code?: string;
  email?: string;
  dateOfBirth?: string;
  class?: string;
  course?: string;
  academicYear?: string;
}

export default function DocumentsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchStudent, setSearchStudent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(null);

  // Document configuration
  const [docType, setDocType] = useState<
    "matricula" | "matricula_notas" | "certificado" | "transferencia" | "ficha"
  >("matricula");
  const [docPurpose, setDocPurpose] = useState("Efeito de Confirmação Académica");
  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [directorName, setDirectorName] = useState(user?.name || "A Direcção da Escola");
  const [docNumber, setDocNumber] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate unique doc number
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const yr = new Date().getFullYear();
    const generatedNum = `DOC-${yr}/${randomCode}`;
    setDocNumber(generatedNum);

    // Generate verification QR code
    const verificationUrl = typeof window !== "undefined"
      ? `${window.location.origin}/verify-doc?doc=${encodeURIComponent(generatedNum)}&type=${encodeURIComponent(docType)}`
      : `https://yhankoeduca.ao/verify-doc?doc=${generatedNum}`;

    QRCode.toDataURL(verificationUrl, { width: 140, margin: 1 })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));

    // Fetch students list
    const fetchStudents = async () => {
      try {
        const res = await axiosInstance.get("/users?role=STUDENT");
        const list = (res.data || []).map((u: any) => ({
          id: u.id,
          name: u.name,
          code: u.code || u.studentNumber || "N/D",
          email: u.email || "",
          class:
            u.enrollments && u.enrollments.length > 0 && u.enrollments[0].class
              ? `${u.enrollments[0].class.grade} - ${u.enrollments[0].class.name}`
              : "Ensino Secundário Geral",
          course: "Ciências Físicas e Biológicas",
          academicYear: "2024/2025",
        }));
        setStudents(list);
        if (list.length > 0) {
          setSelectedStudent(list[0]);
        }
      } catch (err) {
        console.error("Error loading students", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [docType]);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      (s.code && s.code.includes(searchStudent))
  );

  const handlePrint = () => {
    window.print();
  };

  const getDocTitle = () => {
    switch (docType) {
      case "matricula":
        return "DECLARAÇÃO DE MATRÍCULA";
      case "matricula_notas":
        return "DECLARAÇÃO COM NOTAS DE APROVEITAMENTO";
      case "certificado":
        return "CERTIFICADO DE HABILITAÇÕES LITERÁRIAS";
      case "transferencia":
        return "GUIA OFICIAL DE TRANSFERÊNCIA ESCOLAR";
      case "ficha":
        return "FICHA BIOGRÁFICA DO ESTUDANTE";
      default:
        return "DECLARAÇÃO ESCOLAR";
    }
  };

  const todayFormatted = new Date().toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 font-hanken text-[#090D16] dark:text-[#e5e2e1]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBD5E1] dark:border-[#414042] pb-5 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-primary/10 text-primary">
              <FileCheck className="w-5 h-5" />
            </div>
            <h1 className="headline-lg text-[#090D16] dark:text-[#e5e2e1]">
              Emissão de Documentos Oficiais
            </h1>
          </div>
          <p className="body-md text-[#556575] dark:text-[#d5c4ac] mt-1">
            Geração automatizada de declarações, certificados e guias com autenticação por QR Code
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handlePrint}
            className="bg-primary hover:bg-[#A78BFA] text-white font-bold h-10 px-4 rounded text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Gerar PDF</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Controls vs Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        {/* Left Column: Form & Configuration (Hidden on Print) */}
        <div className="lg:col-span-4 space-y-5 print:hidden">
          {/* Tipo de Documento */}
          <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-4 shadow-2xs space-y-3">
            <span className="label-caps text-[#6D28D9] dark:text-[#DDD6FE] block font-bold text-xs">
              1. Selecionar Documento
            </span>
            <div className="space-y-1.5">
              {[
                { id: "matricula", label: "Declaração de Matrícula" },
                { id: "matricula_notas", label: "Declaração com Notas" },
                { id: "certificado", label: "Certificado de Habilitações" },
                { id: "transferencia", label: "Guia de Transferência" },
                { id: "ficha", label: "Ficha de Matrícula" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setDocType(item.id as any)}
                  className={`w-full text-left p-2.5 rounded text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    docType === item.id
                      ? "bg-primary text-white shadow-xs"
                      : "bg-[#EDF0F3] dark:bg-[#1c1b1b] text-[#090D16] dark:text-[#e5e2e1] hover:bg-[#E2E6EA] dark:hover:bg-[#252525] border border-[#CBD5E1] dark:border-[#414042]"
                  }`}
                >
                  <span>{item.label}</span>
                  {docType === item.id && <CheckCircle className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Selecionar Estudante */}
          <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-4 shadow-2xs space-y-3">
            <span className="label-caps text-[#6D28D9] dark:text-[#DDD6FE] block font-bold text-xs">
              2. Selecionar Estudante
            </span>
            
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#556575] dark:text-[#9d8f78] absolute left-3 top-3" />
              <input
                type="text"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                placeholder="Pesquisar por nome ou código..."
                className="w-full bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary rounded text-xs text-[#090D16] dark:text-[#e5e2e1] pl-8 pr-3 py-2 outline-none"
              />
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {filteredStudents.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStudent(st)}
                  className={`w-full text-left p-2 rounded text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    selectedStudent?.id === st.id
                      ? "bg-primary/10 border border-primary text-primary font-bold"
                      : "hover:bg-[#EDF0F3] dark:hover:bg-[#1c1b1b] text-[#090D16] dark:text-[#e5e2e1]"
                  }`}
                >
                  <div className="truncate">
                    <p className="truncate">{st.name}</p>
                    <span className="text-[10px] data-mono text-[#556575] dark:text-[#9d8f78]">
                      #{st.code}
                    </span>
                  </div>
                  {selectedStudent?.id === st.id && (
                    <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Finalidade & Opções */}
          <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-4 shadow-2xs space-y-3">
            <span className="label-caps text-[#6D28D9] dark:text-[#DDD6FE] block font-bold text-xs">
              3. Finalidade & Metadados
            </span>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#556575] dark:text-[#d5c4ac]">
                Finalidade do Documento
              </label>
              <input
                type="text"
                value={docPurpose}
                onChange={(e) => setDocPurpose(e.target.value)}
                className="w-full bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary rounded text-xs text-[#090D16] dark:text-[#e5e2e1] p-2 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#556575] dark:text-[#d5c4ac]">
                Assinado Por (Direcção / Secretaria)
              </label>
              <input
                type="text"
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                className="w-full bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary rounded text-xs text-[#090D16] dark:text-[#e5e2e1] p-2 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Timbrado Document Preview (A4 standard) */}
        <div className="lg:col-span-8">
          <div
            ref={printRef}
            className="bg-white text-black p-8 sm:p-12 rounded-lg border border-[#CBD5E1] shadow-xl min-h-[750px] relative font-serif flex flex-col justify-between print:border-none print:shadow-none print:p-0"
          >
            {/* Document Header Timbrado */}
            <div className="text-center space-y-2 border-b-2 border-slate-900 pb-5">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                ANG
              </div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-800">
                REPÚBLICA DE ANGOLA
              </h2>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                GOVERNO PROVINCIAL DE LUANDA • MINISTÉRIO DA EDUCAÇÃO
              </h3>
              <h1 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-950 font-sans">
                COMPLEXO ESCOLAR YHANKO EDUCA
              </h1>
              <p className="text-[10px] text-slate-600 font-sans">
                Ensino Primário e Secundário • NIF: 5417089201 • Luanda, Angola
              </p>
            </div>

            {/* Document Title */}
            <div className="my-6 text-center space-y-1">
              <h2 className="text-lg sm:text-xl font-bold tracking-wider underline decoration-2 underline-offset-4 text-slate-900 font-sans">
                {getDocTitle()}
              </h2>
              <p className="text-xs font-mono font-semibold text-slate-600">
                Nº de Registo: {docNumber}
              </p>
            </div>

            {/* Document Body */}
            <div className="space-y-4 text-xs sm:text-sm text-justify leading-relaxed text-slate-900 font-sans">
              <p>
                Para os devidos efeitos e a pedido da parte interessada, declara-se que o(a) estudante{" "}
                <strong className="uppercase font-bold underline">
                  {selectedStudent ? selectedStudent.name : "__________________________"}
                </strong>
                , portador(a) do processo individual nº{" "}
                <strong className="font-mono">{selectedStudent?.code || "_______"}</strong>, encontra-se
                regularmente matriculado(a) e com aproveitamento pedagógico ativo no presente Ano Letivo de{" "}
                <strong>{academicYear}</strong>, frequentando a classe/curso de{" "}
                <strong>{selectedStudent?.class || "Ensino Geral"}</strong>.
              </p>

              {docType === "matricula_notas" && (
                <div className="my-4 border border-slate-400 rounded overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 border-b border-slate-400 font-bold text-slate-800">
                      <tr>
                        <th className="p-2">Disciplina</th>
                        <th className="p-2 text-center">1º Trimestre</th>
                        <th className="p-2 text-center">2º Trimestre</th>
                        <th className="p-2 text-center">3º Trimestre</th>
                        <th className="p-2 text-center">Média Final</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      <tr>
                        <td className="p-2 font-medium">Língua Portuguesa</td>
                        <td className="p-2 text-center font-mono">14</td>
                        <td className="p-2 text-center font-mono">15</td>
                        <td className="p-2 text-center font-mono">16</td>
                        <td className="p-2 text-center font-mono font-bold">15</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Matemática</td>
                        <td className="p-2 text-center font-mono">16</td>
                        <td className="p-2 text-center font-mono">17</td>
                        <td className="p-2 text-center font-mono">15</td>
                        <td className="p-2 text-center font-mono font-bold">16</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Física</td>
                        <td className="p-2 text-center font-mono">13</td>
                        <td className="p-2 text-center font-mono">14</td>
                        <td className="p-2 text-center font-mono">15</td>
                        <td className="p-2 text-center font-mono font-bold">14</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">Química</td>
                        <td className="p-2 text-center font-mono">15</td>
                        <td className="p-2 text-center font-mono">15</td>
                        <td className="p-2 text-center font-mono">16</td>
                        <td className="p-2 text-center font-mono font-bold">15</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <p>
                Por ser verdade e ter sido solicitada para <strong>{docPurpose}</strong>, passa-se a presente
                declaração que vai por mim assinada e autenticada com o carimbo a óleo em uso nesta instituição de ensino.
              </p>

              <p className="text-right pt-4">
                Luanda, aos {todayFormatted}.
              </p>
            </div>

            {/* Signatures and QR Code Footer */}
            <div className="pt-8 border-t border-slate-300 flex items-end justify-between font-sans">
              {/* QR Code de Autenticação */}
              <div className="flex items-center gap-3">
                {qrCodeUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={qrCodeUrl}
                    alt="QR Code de Verificação"
                    className="w-20 h-20 border border-slate-300 p-1 bg-white"
                  />
                )}
                <div className="text-[9px] text-slate-600 max-w-[170px] space-y-0.5">
                  <span className="font-bold uppercase text-slate-800 block flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Documento Autêntico
                  </span>
                  <p>Escaneie o QR Code com a câmara do telemóvel para validar a autenticidade deste registo oficial.</p>
                </div>
              </div>

              {/* Signature Line */}
              <div className="text-center space-y-1 min-w-[200px]">
                <div className="w-48 border-b border-slate-900 mx-auto" />
                <p className="text-xs font-bold uppercase text-slate-900">{directorName}</p>
                <p className="text-[10px] text-slate-600 uppercase">A Direcção / Secretaria Geral</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
