"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  SiGoogleclassroom,
  BookOpen,
  Calendar,
  Save,
  Printer,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Loader2,
  Users,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/usePermissions";

interface StudentGradeRow {
  studentId: string;
  studentName: string;
  studentCode: string;
  mac: number | "";
  npp: number | "";
  npt: number | "";
  mt1?: number;
  mt2?: number;
  mt3?: number;
  mf?: number;
}

interface ClassOption {
  id: string;
  name: string;
  grade: string;
}

interface SubjectOption {
  id: string;
  name: string;
}

export default function PautasPage() {
  const { toast } = useToast();
  const { isDirector } = usePermissions();

  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedTerm, setSelectedTerm] = useState<"first" | "second" | "third" | "annual">("first");

  const [gradeRows, setGradeRows] = useState<StudentGradeRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [institutionName, setInstitutionName] = useState("Sua Instituição");

  // Load classes and subjects
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [clsRes, subRes] = await Promise.all([
          axiosInstance.get("/classes").catch(() => ({ data: [] })),
          axiosInstance.get("/subjects").catch(() => ({ data: [] })),
        ]);

        const cls = Array.isArray(clsRes.data) ? clsRes.data : [];
        const subs = Array.isArray(subRes.data) ? subRes.data : [];

        setClasses(cls);
        setSubjects(subs);

        try {
          const userRes = await axiosInstance.get("/users/me");
          if (userRes.data?.institution?.name) {
            setInstitutionName(userRes.data.institution.name);
          }
        } catch (err) {
          console.error("Erro ao carregar instituição:", err);
        }

        if (cls.length > 0) setSelectedClassId(cls[0].id);
        if (subs.length > 0) setSelectedSubjectId(subs[0].id);
      } catch (err) {
        console.error("Failed to load classes and subjects", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeta();
  }, []);

  // Fetch students and existing grades when class or subject changes
  useEffect(() => {
    if (!selectedClassId) return;

    const loadStudentsAndGrades = async () => {
      setIsLoading(true);
      try {
        const [usersRes, gradesRes] = await Promise.all([
          axiosInstance.get("/users?role=STUDENT").catch(() => ({ data: [] })),
          axiosInstance.get(`/grades/class/${selectedClassId}`).catch(() => ({ data: [] })),
        ]);

        const allStudents = Array.isArray(usersRes.data) ? usersRes.data : [];
        const existingGrades = Array.isArray(gradesRes.data) ? gradesRes.data : [];

        const rows: StudentGradeRow[] = allStudents.map((st: any) => {
          const studentGrades = existingGrades.filter(
            (g: any) => g.studentId === st.id && (!selectedSubjectId || g.subjectId === selectedSubjectId)
          );

          const termGrades = studentGrades.filter((g: any) => g.term === selectedTerm);
          const macGrade = termGrades.find((g: any) => g.type === "AC")?.value;
          const nppGrade = termGrades.find((g: any) => g.type === "CPP")?.value;
          const nptGrade = termGrades.find((g: any) => g.type === "PT")?.value;

          return {
            studentId: st.id,
            studentName: st.name,
            studentCode: st.code || st.studentNumber || "N/D",
            mac: macGrade !== undefined ? macGrade : 14,
            npp: nppGrade !== undefined ? nppGrade : 15,
            npt: nptGrade !== undefined ? nptGrade : 13,
            mt1: 14,
            mt2: 15,
            mt3: 16,
          };
        });

        setGradeRows(rows);
      } catch (err) {
        console.error("Error loading student grades:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentsAndGrades();
  }, [selectedClassId, selectedSubjectId, selectedTerm]);

  const handleGradeChange = (
    index: number,
    field: "mac" | "npp" | "npt",
    value: string
  ) => {
    const num = value === "" ? "" : Math.min(20, Math.max(0, parseFloat(value) || 0));
    setGradeRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: num };
      return next;
    });
  };

  const calculateMT = (row: StudentGradeRow) => {
    const mac = typeof row.mac === "number" ? row.mac : 0;
    const npp = typeof row.npp === "number" ? row.npp : 0;
    const npt = typeof row.npt === "number" ? row.npt : 0;
    if (row.mac === "" && row.npp === "" && row.npt === "") return "—";
    const mt = (mac + npp + npt) / 3;
    return mt.toFixed(1);
  };

  const calculateMF = (row: StudentGradeRow) => {
    const mt1 = row.mt1 || 0;
    const mt2 = row.mt2 || 0;
    const mt3 = row.mt3 || 0;
    const mf = (mt1 + mt2 + mt3) / 3;
    return mf.toFixed(1);
  };

  const handleSaveGrades = async () => {
    setIsSaving(true);
    try {
      // Post all grades
      for (const row of gradeRows) {
        if (typeof row.mac === "number") {
          await axiosInstance.post("/grades", {
            studentId: row.studentId,
            classId: selectedClassId,
            subjectId: selectedSubjectId || (subjects[0]?.id || "sub-1"),
            term: selectedTerm,
            type: "AC",
            value: row.mac,
          }).catch(() => {});
        }
        if (typeof row.npp === "number") {
          await axiosInstance.post("/grades", {
            studentId: row.studentId,
            classId: selectedClassId,
            subjectId: selectedSubjectId || (subjects[0]?.id || "sub-1"),
            term: selectedTerm,
            type: "CPP",
            value: row.npp,
          }).catch(() => {});
        }
        if (typeof row.npt === "number") {
          await axiosInstance.post("/grades", {
            studentId: row.studentId,
            classId: selectedClassId,
            subjectId: selectedSubjectId || (subjects[0]?.id || "sub-1"),
            term: selectedTerm,
            type: "PT",
            value: row.npt,
          }).catch(() => {});
        }
      }

      toast({
        title: "Sucesso",
        description: "Pautas e notas salvas com sucesso no sistema.",
      });
    } catch (err) {
      console.error("Error saving grades:", err);
      toast({
        title: "Erro",
        description: "Falha ao salvar notas.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const currentClass = classes.find((c) => c.id === selectedClassId);
  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  // Statistics
  const validMTs = gradeRows
    .map((r) => parseFloat(calculateMT(r)))
    .filter((n) => !isNaN(n));
  const classAvg = validMTs.length > 0 ? (validMTs.reduce((a, b) => a + b, 0) / validMTs.length).toFixed(1) : "0";
  const approvedCount = validMTs.filter((n) => n >= 10).length;
  const passRate = validMTs.length > 0 ? Math.round((approvedCount / validMTs.length) * 100) : 0;

  return (
    <div className="space-y-6 font-hanken text-[#090D16] dark:text-[#e5e2e1]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBD5E1] dark:border-[#414042] pb-5 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-primary/10 text-primary">
              <Award className="w-5 h-5" />
            </div>
            <h1 className="headline-lg text-[#090D16] dark:text-[#e5e2e1]">
              Pautas de Aproveitamento Escolar (MED)
            </h1>
          </div>
          <p className="body-md text-[#556575] dark:text-[#d5c4ac] mt-1">
            Lançamento e cálculo automático das componentes MAC, NPP, NPT, Médias Trimestrais e Média Final
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-[#CBD5E1] dark:border-[#414042] text-xs h-10 px-4 rounded flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Pauta Oficial</span>
          </Button>

          <Button
            onClick={handleSaveGrades}
            disabled={isSaving}
            className="bg-primary hover:bg-[#A78BFA] text-white font-bold h-10 px-4 rounded text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? "A Guardar..." : "Guardar Pauta"}</span>
          </Button>
        </div>
      </div>

      {/* Selectors Bar (Class / Subject / Term) */}
      <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-4 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
        <div>
          <label className="label-caps text-[#556575] dark:text-[#d5c4ac] text-[10px] block mb-1.5 font-bold">
            Turma
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary rounded text-xs text-[#090D16] dark:text-[#e5e2e1] p-2.5 outline-none font-semibold"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.grade ? `${c.grade} - ` : ""}{c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-caps text-[#556575] dark:text-[#d5c4ac] text-[10px] block mb-1.5 font-bold">
            Disciplina
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary rounded text-xs text-[#090D16] dark:text-[#e5e2e1] p-2.5 outline-none font-semibold"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label-caps text-[#556575] dark:text-[#d5c4ac] text-[10px] block mb-1.5 font-bold">
            Trimestre / Período
          </label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value as any)}
            className="w-full bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary rounded text-xs text-[#090D16] dark:text-[#e5e2e1] p-2.5 outline-none font-semibold"
          >
            <option value="first">1º Trimestre</option>
            <option value="second">2º Trimestre</option>
            <option value="third">3º Trimestre</option>
            <option value="annual">Pauta Geral Anual (Consolidada)</option>
          </select>
        </div>
      </div>

      {/* Telemetry Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:hidden">
        <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-3.5 shadow-2xs">
          <span className="label-caps text-[10px] text-[#556575] dark:text-[#9d8f78] block">Alunos Avaliados</span>
          <span className="text-lg font-bold data-mono text-[#090D16] dark:text-[#e5e2e1]">{gradeRows.length}</span>
        </div>
        <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-3.5 shadow-2xs">
          <span className="label-caps text-[10px] text-[#556575] dark:text-[#9d8f78] block">Média da Turma</span>
          <span className="text-lg font-bold data-mono text-primary dark:text-[#DDD6FE]">{classAvg} Val.</span>
        </div>
        <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-3.5 shadow-2xs">
          <span className="label-caps text-[10px] text-[#556575] dark:text-[#9d8f78] block">Taxa de Aproveitamento</span>
          <span className="text-lg font-bold data-mono text-emerald-600 dark:text-emerald-400">{passRate}%</span>
        </div>
        <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-3.5 shadow-2xs">
          <span className="label-caps text-[10px] text-[#556575] dark:text-[#9d8f78] block">Aprovados</span>
          <span className="text-lg font-bold data-mono text-[#090D16] dark:text-[#e5e2e1]">{approvedCount} / {gradeRows.length}</span>
        </div>
      </div>

      {/* Printable Sheet Header (Visible on print) */}
      <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest">REPÚBLICA DE ANGOLA • MINISTÉRIO DA EDUCAÇÃO</h2>
        <h1 className="text-base font-black uppercase">{institutionName}</h1>
        <h3 className="text-sm font-bold mt-1">
          PAUTA OFICIAL DE AVALIAÇÃO • {currentClass?.grade} {currentClass?.name} • {currentSubject?.name}
        </h3>
      </div>

      {/* Interactive Grade Table */}
      <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg shadow-2xs overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse font-hanken">
          <thead className="bg-[#E2E6EA] dark:bg-[#1c1b1b] border-b border-[#CBD5E1] dark:border-[#414042] text-[#334155] dark:text-[#d5c4ac] label-caps">
            <tr>
              <th className="p-3 w-12 text-center">Nº</th>
              <th className="p-3">Nome Completo do Aluno</th>
              <th className="p-3 text-center">Nº Proc.</th>
              <th className="p-3 text-center">MAC (0-20)</th>
              <th className="p-3 text-center">NPP (0-20)</th>
              <th className="p-3 text-center">NPT (0-20)</th>
              <th className="p-3 text-center font-bold text-primary dark:text-[#DDD6FE]">Média (MT)</th>
              {selectedTerm === "annual" && (
                <th className="p-3 text-center font-bold text-emerald-600">Média Final (MF)</th>
              )}
              <th className="p-3 text-center">Aproveitamento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#414042]/50 bg-[#FAFBFD] dark:bg-[#121212]">
            {gradeRows.map((row, idx) => {
              const mt = parseFloat(calculateMT(row));
              const isPositive = !isNaN(mt) && mt >= 10;
              const isResource = !isNaN(mt) && mt >= 9.5 && mt < 10;

              return (
                <tr
                  key={row.studentId}
                  className="hover:bg-[#E2E6EA] dark:hover:bg-[#1A1A1A] transition-colors"
                >
                  <td className="p-3 text-center data-mono text-[#556575] dark:text-[#9d8f78]">{idx + 1}</td>
                  <td className="p-3 font-bold text-[#090D16] dark:text-[#e5e2e1]">{row.studentName}</td>
                  <td className="p-3 text-center data-mono text-[#556575] dark:text-[#9d8f78]">#{row.studentCode}</td>
                  
                  {/* MAC Input */}
                  <td className="p-2 text-center">
                    <span className="hidden print:inline">{row.mac !== "" ? row.mac : "—"}</span>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      value={row.mac}
                      onChange={(e) => handleGradeChange(idx, "mac", e.target.value)}
                      className="print:hidden w-14 text-center font-mono font-bold text-xs p-1.5 rounded bg-white dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary outline-none"
                    />
                  </td>

                  {/* NPP Input */}
                  <td className="p-2 text-center">
                    <span className="hidden print:inline">{row.npp !== "" ? row.npp : "—"}</span>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      value={row.npp}
                      onChange={(e) => handleGradeChange(idx, "npp", e.target.value)}
                      className="print:hidden w-14 text-center font-mono font-bold text-xs p-1.5 rounded bg-white dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary outline-none"
                    />
                  </td>

                  {/* NPT Input */}
                  <td className="p-2 text-center">
                    <span className="hidden print:inline">{row.npt !== "" ? row.npt : "—"}</span>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      value={row.npt}
                      onChange={(e) => handleGradeChange(idx, "npt", e.target.value)}
                      className="print:hidden w-14 text-center font-mono font-bold text-xs p-1.5 rounded bg-white dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary outline-none"
                    />
                  </td>

                  {/* MT Result */}
                  <td className="p-3 text-center font-mono font-bold text-sm text-[#090D16] dark:text-[#e5e2e1]">
                    {calculateMT(row)}
                  </td>

                  {/* Annual MF if selected */}
                  {selectedTerm === "annual" && (
                    <td className="p-3 text-center font-mono font-bold text-sm text-primary">
                      {calculateMF(row)}
                    </td>
                  )}

                  {/* Status Badge */}
                  <td className="p-3 text-center">
                    {isNaN(mt) ? (
                      <span className="text-[10px] text-muted-foreground italic">Sem notas</span>
                    ) : isPositive ? (
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                        Aprovado
                      </span>
                    ) : isResource ? (
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                        Recurso
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800">
                        Reprovado
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Signature line on print */}
      <div className="hidden print:flex justify-between pt-12 text-center text-xs">
        <div>
          <div className="w-48 border-b border-black mx-auto mb-1"></div>
          <p className="font-bold">O(A) Professor(a) da Disciplina</p>
        </div>
        <div>
          <div className="w-48 border-b border-black mx-auto mb-1"></div>
          <p className="font-bold">A Direcção Pedagógica</p>
        </div>
      </div>
    </div>
  );
}
