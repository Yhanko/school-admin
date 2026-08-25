"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Award,
  BookOpen,
  Save,
  Printer,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";

interface ClassOption { id: string; name: string; grade?: string; }
interface SubjectOption { id: string; name: string; }
interface PautaTermData { mac: number | null; npt: number | null; mt: number | null; }
interface PautaStudent {
  student: { id: string; name: string; code?: string };
  terms: { first: PautaTermData; second: PautaTermData; third: PautaTermData; };
  final: { nee: number | null; neo: number | null; menc: number | null; mfd: number | null; };
}
interface PautaResponse {
  classInfo: { name: string; grade?: string; isExamClass: boolean };
  subjectInfo: { name?: string; isPortuguese: boolean };
  students: PautaStudent[];
}
interface LancamentoRow {
  studentId: string; studentName: string; studentCode: string;
  mac: number | ""; npt: number | "";
}
type Mode = "lancamento" | "pauta";
type Term = "first" | "second" | "third";
const TERM_LABELS: Record<Term, string> = { first: "1º Trimestre", second: "2º Trimestre", third: "3º Trimestre" };

const fmt = (v: number | null | undefined) => v !== null && v !== undefined ? v.toFixed(1) : "—";

const StatusBadge = ({ mfd, isExam }: { mfd: number | null; isExam: boolean }) => {
  if (mfd === null) return <span className="text-[10px] italic text-[#9d8f78]">Sem dados</span>;
  if (mfd >= 10) return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">Aprovado</span>;
  if (isExam && mfd >= 9.5) return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">Recurso</span>;
  return <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800">Reprovado</span>;
};

export default function PautasPage() {
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("lancamento");
  const [selectedTerm, setSelectedTerm] = useState<Term>("first");
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [institutionName, setInstitutionName] = useState("Instituicao");
  const [lancRows, setLancRows] = useState<LancamentoRow[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [pautaData, setPautaData] = useState<PautaResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [clsRes, subRes, meRes] = await Promise.all([
          axiosInstance.get("/classes").catch(() => ({ data: [] })),
          axiosInstance.get("/subjects").catch(() => ({ data: [] })),
          axiosInstance.get("/users/me").catch(() => ({ data: {} })),
        ]);
        const cls: ClassOption[] = Array.isArray(clsRes.data) ? clsRes.data : [];
        const subs: SubjectOption[] = Array.isArray(subRes.data) ? subRes.data : [];
        setClasses(cls);
        setSubjects(subs);
        if (meRes.data?.institution?.name) setInstitutionName(meRes.data.institution.name);
        if (cls.length > 0) setSelectedClassId(cls[0].id);
        if (subs.length > 0) setSelectedSubjectId(subs[0].id);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    if (mode !== "lancamento" || !selectedClassId || !selectedSubjectId) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const [usersRes, gradesRes] = await Promise.all([
          axiosInstance.get("/users?role=STUDENT").catch(() => ({ data: [] })),
          axiosInstance.get(`/grades/class/${selectedClassId}`).catch(() => ({ data: [] })),
        ]);
        const students: any[] = Array.isArray(usersRes.data) ? usersRes.data : [];
        const grades: any[] = Array.isArray(gradesRes.data) ? gradesRes.data : [];
        const rows: LancamentoRow[] = students.map((s: any) => {
          const sGrades = grades.filter((g: any) => g.studentId === s.id && g.subjectId === selectedSubjectId && g.term === selectedTerm);
          const mac = sGrades.find((g: any) => g.type === "AC")?.value;
          const npt = sGrades.find((g: any) => g.type === "NPT" || g.type === "PT")?.value;
          return { studentId: s.id, studentName: s.name, studentCode: s.code || s.studentNumber || "N/D", mac: mac !== undefined ? mac : "", npt: npt !== undefined ? npt : "" };
        });
        setLancRows(rows);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [mode, selectedClassId, selectedSubjectId, selectedTerm]);

  const loadPauta = useCallback(async () => {
    if (!selectedClassId || !selectedSubjectId) return;
    setIsLoading(true);
    setPautaData(null);
    try {
      const res = await axiosInstance.get(`/grades/pauta/class/${selectedClassId}/subject/${selectedSubjectId}`);
      setPautaData(res.data);
    } catch {
      toast({ title: "Erro", description: "Nao foi possivel carregar a pauta.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [selectedClassId, selectedSubjectId, toast]);

  useEffect(() => { if (mode === "pauta") loadPauta(); }, [mode, loadPauta]);

  const handleChange = (idx: number, field: "mac" | "npt", raw: string) => {
    const num = raw === "" ? "" : Math.min(20, Math.max(0, parseFloat(raw) || 0));
    setLancRows((prev) => { const next = [...prev]; next[idx] = { ...next[idx], [field]: num }; return next; });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const row of lancRows) {
        if (typeof row.mac === "number") await axiosInstance.post("/grades", { studentId: row.studentId, classId: selectedClassId, subjectId: selectedSubjectId, term: selectedTerm, type: "AC", value: row.mac }).catch(() => {});
        if (typeof row.npt === "number") await axiosInstance.post("/grades", { studentId: row.studentId, classId: selectedClassId, subjectId: selectedSubjectId, term: selectedTerm, type: "NPT", value: row.npt }).catch(() => {});
      }
      toast({ title: "Guardado", description: "Notas guardadas com sucesso." });
    } catch {
      toast({ title: "Erro", description: "Falha ao guardar notas.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const pautaStats = React.useMemo(() => {
    if (!pautaData) return null;
    const mfds = pautaData.students.map((s) => s.final.mfd).filter((v): v is number => v !== null);
    if (mfds.length === 0) return null;
    const avg = mfds.reduce((a, b) => a + b, 0) / mfds.length;
    const approved = mfds.filter((v) => v >= 10).length;
    return { avg, approved, total: pautaData.students.length };
  }, [pautaData]);

  const currentClass = classes.find((c) => c.id === selectedClassId);
  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);
  const isExamClass = pautaData?.classInfo?.isExamClass ?? false;
  const isPortuguese = pautaData?.subjectInfo?.isPortuguese ?? false;

  const thCls = (bg: string) => `p-2 text-center ${bg}`;
  const tdCls = (bg: string) => `p-2 text-center font-mono ${bg}`;
  const tdBold = (bg: string, txt: string) => `p-2 text-center font-mono font-bold ${bg} ${txt}`;

  return (
    <div className="space-y-6 font-hanken text-[#090D16] dark:text-[#e5e2e1]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBD5E1] dark:border-[#414042] pb-5 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-primary/10 text-primary"><Award className="w-5 h-5" /></div>
            <h1 className="headline-lg">Pautas de Aproveitamento Escolar</h1>
          </div>
          <p className="body-md text-[#556575] dark:text-[#d5c4ac] mt-1">Lancamento de notas por trimestre · Pauta Consolidada Anual com MFD</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button onClick={() => window.print()} variant="outline" className="border-[#CBD5E1] dark:border-[#414042] text-xs h-10 px-4 rounded flex items-center gap-2 cursor-pointer">
            <Printer className="w-4 h-4" /><span>Imprimir</span>
          </Button>
          {mode === "lancamento" && (
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-[#A78BFA] text-white font-bold h-10 px-4 rounded text-xs flex items-center gap-2 cursor-pointer">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? "A Guardar..." : "Guardar Notas"}</span>
            </Button>
          )}
          {mode === "pauta" && (
            <Button onClick={loadPauta} variant="outline" className="border-[#CBD5E1] dark:border-[#414042] text-xs h-10 px-4 rounded flex items-center gap-2 cursor-pointer">
              <RefreshCw className="w-4 h-4 text-primary" /><span>Atualizar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-1 w-fit print:hidden">
        {(["lancamento", "pauta"] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 rounded text-xs font-bold transition-all ${mode === m ? "bg-white dark:bg-[#121212] text-primary shadow" : "text-[#556575] dark:text-[#9d8f78] hover:text-primary"}`}>
            {m === "lancamento" ? "Lancamento de Notas" : "Pauta Consolidada (Anual)"}
          </button>
        ))}
      </div>

      {/* Selectors */}
      <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-4 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
        <div>
          <label className="label-caps text-[10px] text-[#556575] dark:text-[#d5c4ac] block mb-1.5 font-bold">Turma</label>
          <select value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)} className="w-full bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] rounded text-xs text-[#090D16] dark:text-[#e5e2e1] p-2.5 outline-none font-semibold">
            {classes.map((c) => <option key={c.id} value={c.id}>{c.grade ? `${c.grade} - ` : ""}{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label-caps text-[10px] text-[#556575] dark:text-[#d5c4ac] block mb-1.5 font-bold">Disciplina</label>
          <select value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)} className="w-full bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] rounded text-xs text-[#090D16] dark:text-[#e5e2e1] p-2.5 outline-none font-semibold">
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        {mode === "lancamento" && (
          <div>
            <label className="label-caps text-[10px] text-[#556575] dark:text-[#d5c4ac] block mb-1.5 font-bold">Trimestre</label>
            <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value as Term)} className="w-full bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] rounded text-xs text-[#090D16] dark:text-[#e5e2e1] p-2.5 outline-none font-semibold">
              {(Object.keys(TERM_LABELS) as Term[]).map((t) => <option key={t} value={t}>{TERM_LABELS[t]}</option>)}
            </select>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
          <span className="text-sm text-[#9d8f78]">A carregar dados...</span>
        </div>
      )}

      {/* LANCAMENTO MODE */}
      {!isLoading && mode === "lancamento" && (
        <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg shadow-2xs overflow-x-auto">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-[#CBD5E1] dark:border-[#414042]">
            <BookOpen className="w-4 h-4 text-primary" />
            <h2 className="headline-sm">{TERM_LABELS[selectedTerm]}</h2>
            <span className="ml-auto label-caps text-[10px] text-[#9d8f78]">MT = (MAC + NPT) / 2</span>
          </div>
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#E2E6EA] dark:bg-[#1c1b1b] text-[#334155] dark:text-[#d5c4ac] label-caps">
              <tr>
                <th className="p-3 w-10 text-center">Nr</th>
                <th className="p-3">Nome do Aluno</th>
                <th className="p-3 text-center">Nr Proc.</th>
                <th className="p-3 text-center">MAC (0-20)</th>
                <th className="p-3 text-center">NPT (0-20)</th>
                <th className="p-3 text-center font-bold text-primary dark:text-[#DDD6FE]">MT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#414042]/50">
              {lancRows.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-xs text-[#9d8f78] italic">Nenhum aluno encontrado para esta turma.</td></tr>}
              {lancRows.map((row, idx) => {
                const mac = typeof row.mac === "number" ? row.mac : null;
                const npt = typeof row.npt === "number" ? row.npt : null;
                const mt = mac !== null && npt !== null ? (mac + npt) / 2 : null;
                return (
                  <tr key={row.studentId} className="hover:bg-[#E2E6EA] dark:hover:bg-[#1A1A1A] transition-colors">
                    <td className="p-3 text-center text-[#9d8f78]">{idx + 1}</td>
                    <td className="p-3 font-bold">{row.studentName}</td>
                    <td className="p-3 text-center font-mono text-[#9d8f78]">#{row.studentCode}</td>
                    <td className="p-2 text-center"><input type="number" min="0" max="20" step="0.1" value={row.mac} onChange={(e) => handleChange(idx, "mac", e.target.value)} className="w-16 text-center font-mono font-bold text-xs p-1.5 rounded bg-white dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary outline-none" /></td>
                    <td className="p-2 text-center"><input type="number" min="0" max="20" step="0.1" value={row.npt} onChange={(e) => handleChange(idx, "npt", e.target.value)} className="w-16 text-center font-mono font-bold text-xs p-1.5 rounded bg-white dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary outline-none" /></td>
                    <td className={`p-3 text-center font-mono font-bold text-sm ${mt === null ? "text-[#9d8f78]" : mt >= 10 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{mt !== null ? mt.toFixed(1) : "---"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* PAUTA CONSOLIDADA MODE */}
      {!isLoading && mode === "pauta" && pautaData && (
        <>
          {pautaStats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:hidden">
              {[
                { label: "Total de Alunos", value: String(pautaStats.total), color: "" },
                { label: "Media Final da Turma", value: `${pautaStats.avg.toFixed(1)} val.`, color: "text-primary dark:text-[#DDD6FE]" },
                { label: "Aprovados", value: `${pautaStats.approved} / ${pautaStats.total}`, color: "text-emerald-600 dark:text-emerald-400" },
                { label: "Taxa de Aproveitamento", value: `${Math.round((pautaStats.approved / pautaStats.total) * 100)}%`, color: "text-emerald-600 dark:text-emerald-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-3.5 shadow-2xs">
                  <span className="label-caps text-[10px] text-[#9d8f78] block">{label}</span>
                  <span className={`text-lg font-bold font-mono ${color || "text-[#090D16] dark:text-[#e5e2e1]"}`}>{value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${isExamClass ? "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800" : "bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800"}`}>
              {isExamClass ? "Classe de Exame" : "Classe de Transicao"}
            </span>
            {isExamClass && isPortuguese && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800">
                Lingua Portuguesa - MENC = (NEE + NEO) / 2
              </span>
            )}
          </div>

          <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest">REPUBLICA DE ANGOLA - MINISTERIO DA EDUCACAO</h2>
            <h1 className="text-base font-black uppercase">{institutionName}</h1>
            <h3 className="text-sm font-bold mt-1">PAUTA OFICIAL - {currentClass?.grade} {currentClass?.name} - {currentSubject?.name}</h3>
          </div>

          {/* TRANSITION class table */}
          {!isExamClass && (
            <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg shadow-2xs overflow-x-auto">
              <div className="px-5 py-3 border-b border-[#CBD5E1] dark:border-[#414042]">
                <h2 className="headline-sm">Pauta Consolidada - Classe de Transicao</h2>
                <p className="text-[10px] text-[#9d8f78] mt-0.5">MT(1,2,3) = (MAC + NPT) / 2 - MFD = (MT1 + MT2 + MT3) / 3</p>
              </div>
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#E2E6EA] dark:bg-[#1c1b1b] text-[#334155] dark:text-[#d5c4ac] label-caps">
                  <tr>
                    <th className="p-3 w-10 text-center">Nr</th>
                    <th className="p-3">Nome</th>
                    <th className="p-3 text-center">Nr Proc.</th>
                    <th className={thCls("bg-sky-50 dark:bg-sky-950/20")}>MAC1</th>
                    <th className={thCls("bg-sky-50 dark:bg-sky-950/20")}>NPT1</th>
                    <th className={thCls("bg-sky-100 dark:bg-sky-950/30 font-bold text-sky-700 dark:text-sky-300")}>MT1</th>
                    <th className={thCls("bg-violet-50 dark:bg-violet-950/20")}>MAC2</th>
                    <th className={thCls("bg-violet-50 dark:bg-violet-950/20")}>NPT2</th>
                    <th className={thCls("bg-violet-100 dark:bg-violet-950/30 font-bold text-violet-700 dark:text-violet-300")}>MT2</th>
                    <th className={thCls("bg-amber-50 dark:bg-amber-950/20")}>MAC3</th>
                    <th className={thCls("bg-amber-50 dark:bg-amber-950/20")}>NPT3</th>
                    <th className={thCls("bg-amber-100 dark:bg-amber-950/30 font-bold text-amber-700 dark:text-amber-300")}>MT3</th>
                    <th className={thCls("bg-emerald-50 dark:bg-emerald-950/30 font-bold text-emerald-700 dark:text-emerald-300 p-3")}>MFD</th>
                    <th className="p-3 text-center">Situacao</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#414042]/50">
                  {pautaData.students.map((s, idx) => (
                    <tr key={s.student.id} className="hover:bg-[#E2E6EA] dark:hover:bg-[#1A1A1A] transition-colors">
                      <td className="p-3 text-center text-[#9d8f78]">{idx + 1}</td>
                      <td className="p-3 font-bold">{s.student.name}</td>
                      <td className="p-3 text-center font-mono text-[#9d8f78]">#{s.student.code || "N/D"}</td>
                      <td className={tdCls("bg-sky-50/50 dark:bg-sky-950/10")}>{fmt(s.terms.first.mac)}</td>
                      <td className={tdCls("bg-sky-50/50 dark:bg-sky-950/10")}>{fmt(s.terms.first.npt)}</td>
                      <td className={tdBold("bg-sky-100/50 dark:bg-sky-950/20", "text-sky-700 dark:text-sky-300")}>{fmt(s.terms.first.mt)}</td>
                      <td className={tdCls("bg-violet-50/50 dark:bg-violet-950/10")}>{fmt(s.terms.second.mac)}</td>
                      <td className={tdCls("bg-violet-50/50 dark:bg-violet-950/10")}>{fmt(s.terms.second.npt)}</td>
                      <td className={tdBold("bg-violet-100/50 dark:bg-violet-950/20", "text-violet-700 dark:text-violet-300")}>{fmt(s.terms.second.mt)}</td>
                      <td className={tdCls("bg-amber-50/50 dark:bg-amber-950/10")}>{fmt(s.terms.third.mac)}</td>
                      <td className={tdCls("bg-amber-50/50 dark:bg-amber-950/10")}>{fmt(s.terms.third.npt)}</td>
                      <td className={tdBold("bg-amber-100/50 dark:bg-amber-950/20", "text-amber-700 dark:text-amber-300")}>{fmt(s.terms.third.mt)}</td>
                      <td className={`p-3 text-center font-mono font-bold text-sm bg-emerald-50/50 dark:bg-emerald-950/10 ${s.final.mfd === null ? "text-[#9d8f78]" : s.final.mfd >= 10 ? "text-emerald-700 dark:text-emerald-300" : "text-red-600 dark:text-red-400"}`}>{fmt(s.final.mfd)}</td>
                      <td className="p-3 text-center"><StatusBadge mfd={s.final.mfd} isExam={false} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* EXAM class table */}
          {isExamClass && (
            <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg shadow-2xs overflow-x-auto">
              <div className="px-5 py-3 border-b border-[#CBD5E1] dark:border-[#414042]">
                <h2 className="headline-sm">Pauta Consolidada - Classe de Exame</h2>
                <p className="text-[10px] text-[#9d8f78] mt-0.5">MT1/MT2=(MAC+NPT)/2 | MT3=(MT1+MT2+MAC3)/3 | MFD=(MT3x0.6)+(MENCx0.4){isPortuguese ? " | MENC=(NEE+NEO)/2" : " | MENC=NEE"}</p>
              </div>
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-[#E2E6EA] dark:bg-[#1c1b1b] text-[#334155] dark:text-[#d5c4ac] label-caps">
                  <tr>
                    <th className="p-3 w-10 text-center">Nr</th>
                    <th className="p-3">Nome</th>
                    <th className="p-3 text-center">Nr Proc.</th>
                    <th className={thCls("bg-sky-50 dark:bg-sky-950/20")}>MAC1</th>
                    <th className={thCls("bg-sky-50 dark:bg-sky-950/20")}>NPT1</th>
                    <th className={thCls("bg-sky-100 dark:bg-sky-950/30 font-bold text-sky-700 dark:text-sky-300")}>MT1</th>
                    <th className={thCls("bg-violet-50 dark:bg-violet-950/20")}>MAC2</th>
                    <th className={thCls("bg-violet-50 dark:bg-violet-950/20")}>NPT2</th>
                    <th className={thCls("bg-violet-100 dark:bg-violet-950/30 font-bold text-violet-700 dark:text-violet-300")}>MT2</th>
                    <th className={thCls("bg-amber-50 dark:bg-amber-950/20")}>MAC3</th>
                    <th className={thCls("bg-amber-100 dark:bg-amber-950/30 font-bold text-amber-700 dark:text-amber-300")}>MT3</th>
                    <th className={thCls("bg-red-50 dark:bg-red-950/20")}>NEE</th>
                    {isPortuguese && <th className={thCls("bg-red-50 dark:bg-red-950/20")}>NEO</th>}
                    <th className={thCls("bg-red-100 dark:bg-red-950/30 font-bold text-red-700 dark:text-red-300")}>MENC</th>
                    <th className={thCls("bg-emerald-50 dark:bg-emerald-950/30 font-bold text-emerald-700 dark:text-emerald-300 p-3")}>MFD</th>
                    <th className="p-3 text-center">Situacao</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#414042]/50">
                  {pautaData.students.map((s, idx) => (
                    <tr key={s.student.id} className="hover:bg-[#E2E6EA] dark:hover:bg-[#1A1A1A] transition-colors">
                      <td className="p-3 text-center text-[#9d8f78]">{idx + 1}</td>
                      <td className="p-3 font-bold">{s.student.name}</td>
                      <td className="p-3 text-center font-mono text-[#9d8f78]">#{s.student.code || "N/D"}</td>
                      <td className={tdCls("bg-sky-50/50 dark:bg-sky-950/10")}>{fmt(s.terms.first.mac)}</td>
                      <td className={tdCls("bg-sky-50/50 dark:bg-sky-950/10")}>{fmt(s.terms.first.npt)}</td>
                      <td className={tdBold("bg-sky-100/50 dark:bg-sky-950/20", "text-sky-700 dark:text-sky-300")}>{fmt(s.terms.first.mt)}</td>
                      <td className={tdCls("bg-violet-50/50 dark:bg-violet-950/10")}>{fmt(s.terms.second.mac)}</td>
                      <td className={tdCls("bg-violet-50/50 dark:bg-violet-950/10")}>{fmt(s.terms.second.npt)}</td>
                      <td className={tdBold("bg-violet-100/50 dark:bg-violet-950/20", "text-violet-700 dark:text-violet-300")}>{fmt(s.terms.second.mt)}</td>
                      <td className={tdCls("bg-amber-50/50 dark:bg-amber-950/10")}>{fmt(s.terms.third.mac)}</td>
                      <td className={tdBold("bg-amber-100/50 dark:bg-amber-950/20", "text-amber-700 dark:text-amber-300")}>{fmt(s.terms.third.mt)}</td>
                      <td className={tdCls("bg-red-50/50 dark:bg-red-950/10")}>{fmt(s.final.nee)}</td>
                      {isPortuguese && <td className={tdCls("bg-red-50/50 dark:bg-red-950/10")}>{fmt(s.final.neo)}</td>}
                      <td className={tdBold("bg-red-100/50 dark:bg-red-950/20", "text-red-700 dark:text-red-300")}>{fmt(s.final.menc)}</td>
                      <td className={`p-3 text-center font-mono font-bold text-sm bg-emerald-50/50 dark:bg-emerald-950/10 ${s.final.mfd === null ? "text-[#9d8f78]" : s.final.mfd >= 10 ? "text-emerald-700 dark:text-emerald-300" : "text-red-600 dark:text-red-400"}`}>{fmt(s.final.mfd)}</td>
                      <td className="p-3 text-center"><StatusBadge mfd={s.final.mfd} isExam={true} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="hidden print:flex justify-between pt-12 text-center text-xs">
            <div><div className="w-48 border-b border-black mx-auto mb-1" /><p className="font-bold">O(A) Professor(a) da Disciplina</p></div>
            <div><div className="w-48 border-b border-black mx-auto mb-1" /><p className="font-bold">A Direccao Pedagogica</p></div>
          </div>
        </>
      )}

      {!isLoading && mode === "pauta" && !pautaData && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-[#9d8f78]">
          <AlertTriangle className="w-10 h-10 opacity-40" />
          <p className="text-sm">Selecione uma turma e disciplina para gerar a pauta consolidada.</p>
        </div>
      )}
    </div>
  );
}
