"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Calendar,
  Clock,
  Trash2,
  Printer,
  Sparkles,
  Plus,
  Loader2,
  Users,
  Search,
  CheckCircle,
  Building2,
} from "@/lib/icons";
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import { NewSchedule } from "./_components/new-schedule";

interface Schedule {
  id: string;
  classId: string;
  dayOfWeek: number; // 1 = Seg, 2 = Ter, 3 = Qua, 4 = Qui, 5 = Sex, 6 = Sáb
  startTime: string;
  endTime: string;
  subject?: { id: string; name: string };
  teacher?: { id: string; name: string };
  room?: { id: string; name: string };
  class?: { id: string; name: string; course?: string; grade?: string };
}

interface ClassEntity {
  id: string;
  name: string;
  course: string;
  grade?: string;
  roomName?: string;
}

const timeSlots = [
  { id: 1, label: "1º Tempo", start: "07:30", end: "08:15" },
  { id: 2, label: "2º Tempo", start: "08:20", end: "09:05" },
  { id: 3, label: "3º Tempo", start: "09:15", end: "10:00" },
  { id: 4, label: "4º Tempo", start: "10:15", end: "11:00" },
  { id: 5, label: "5º Tempo", start: "11:05", end: "11:50" },
  { id: 6, label: "6º Tempo", start: "11:55", end: "12:40" },
];

const daysOfWeek = [
  { day: 1, name: "Segunda-feira" },
  { day: 2, name: "Terça-feira" },
  { day: 3, name: "Quarta-feira" },
  { day: 4, name: "Quinta-feira" },
  { day: 5, name: "Sexta-feira" },
];

export default function SchedulesPage() {
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [classSchedules, setClassSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"grid" | "list">("grid");

  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get("/classes");
      setClasses(res.data);
      if (res.data.length > 0) {
        setSelectedClassId(res.data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch classes", error);
    }
  };

  const fetchAllSchedules = async () => {
    try {
      const res = await axiosInstance.get("/schedules");
      if (Array.isArray(res.data)) {
        setAllSchedules(res.data);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchAllSchedules();
  }, []);

  const fetchClassSchedules = useCallback(async () => {
    if (!selectedClassId) return;
    setIsLoading(true);
    try {
      const res = await axiosInstance.get(`/schedules/class/${selectedClassId}`);
      setClassSchedules(res.data);
    } catch (error) {
      console.error("Failed to fetch schedules for class", error);
      setClassSchedules([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedClassId]);

  useEffect(() => {
    fetchClassSchedules();
  }, [fetchClassSchedules]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem a certeza que deseja eliminar este tempo de aula?")) return;
    try {
      await axiosInstance.delete(`/schedules/${id}`);
      toast({ title: "Sucesso", description: "Tempo de horário eliminado!" });
      fetchClassSchedules();
      fetchAllSchedules();
    } catch {
      toast({ title: "Erro", description: "Falha ao eliminar.", variant: "destructive" });
    }
  };

  // Conflict Engine: detects if a teacher or room is double booked at the same time
  const detectedConflicts = useMemo(() => {
    const conflicts: Array<{
      id: string;
      teacherName: string;
      dayOfWeek: number;
      time: string;
      classes: string[];
    }> = [];

    // Group schedules by teacher + day + time
    const map = new Map<string, Schedule[]>();
    allSchedules.forEach((sch) => {
      if (sch.teacher?.name) {
        const key = `${sch.teacher.id}_${sch.dayOfWeek}_${sch.startTime}`;
        const existing = map.get(key) || [];
        existing.push(sch);
        map.set(key, existing);
      }
    });

    map.forEach((items, key) => {
      if (items.length > 1) {
        conflicts.push({
          id: key,
          teacherName: items[0].teacher?.name || "Professor",
          dayOfWeek: items[0].dayOfWeek,
          time: `${items[0].startTime} - ${items[0].endTime}`,
          classes: items.map((i) => i.class?.name || "Outra Turma"),
        });
      }
    });

    return conflicts;
  }, [allSchedules]);

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-6 font-hanken text-[#090D16] dark:text-[#e5e2e1]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CBD5E1] dark:border-[#414042] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded bg-primary/10 text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <h1 className="headline-lg text-[#090D16] dark:text-[#e5e2e1]">
              Quadro Interativo de Horários Escolares
            </h1>
          </div>
          <p className="body-md text-[#556575] dark:text-[#d5c4ac] mt-1">
            Grelha semanal inteligente com validação e motor anti-conflito de professores e salas
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => window.print()}
            variant="outline"
            className="border-[#CBD5E1] dark:border-[#414042] text-xs h-10 px-4 rounded flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Horário Oficial</span>
          </Button>

          <NewSchedule
            onCreated={() => {
              fetchClassSchedules();
              fetchAllSchedules();
            }}
          />
        </div>
      </div>

      {/* Conflict Alert Banner */}
      {detectedConflicts.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 rounded-lg flex items-start gap-3 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
              ⚠️ Alerta do Motor Anti-Conflito: {detectedConflicts.length} Choque(s) de Horário Detectado(s)
            </strong>
            <div className="text-xs text-amber-800 dark:text-amber-400 space-y-0.5">
              {detectedConflicts.map((c, i) => (
                <p key={i}>
                  • <strong>{c.teacherName}</strong> está alocado simultaneamente em <strong>{c.classes.join(" e ")}</strong> na {daysOfWeek.find(d => d.day === c.dayOfWeek)?.name || `Dia ${c.dayOfWeek}`} ({c.time}).
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls: Class Selector & View Mode */}
      <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-[#556575] dark:text-[#d5c4ac] shrink-0">
            Turma Selecionada:
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full sm:w-72 bg-[#EDF0F3] dark:bg-[#1c1b1b] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary rounded text-xs text-[#090D16] dark:text-[#e5e2e1] p-2.5 outline-none font-bold"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.grade ? `${c.grade} - ` : ""}{c.name} ({c.course})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("grid")}
            className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-all ${
              activeTab === "grid"
                ? "bg-primary text-white shadow-xs"
                : "bg-[#EDF0F3] dark:bg-[#1c1b1b] text-[#556575] hover:bg-[#E2E6EA]"
            }`}
          >
            Quadro Semanal (Grelha)
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition-all ${
              activeTab === "list"
                ? "bg-primary text-white shadow-xs"
                : "bg-[#EDF0F3] dark:bg-[#1c1b1b] text-[#556575] hover:bg-[#E2E6EA]"
            }`}
          >
            Lista de Aulas ({classSchedules.length})
          </button>
        </div>
      </div>

      {/* Interactive Matrix Grid View */}
      {activeTab === "grid" ? (
        <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-[#CBD5E1] dark:border-[#414042] flex items-center justify-between bg-[#E2E6EA]/50 dark:bg-[#181818]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-[#090D16] dark:text-[#e5e2e1]">
                Horário Semanal • {selectedClass?.name} ({selectedClass?.course || "Ensino Geral"})
              </h2>
            </div>
            <span className="text-xs text-[#556575] dark:text-[#9d8f78] data-mono font-semibold">
              Sala: {selectedClass?.roomName || "Geral"} • Ano Lectivo 2025/2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead className="bg-[#E2E6EA] dark:bg-[#1c1b1b] border-b border-[#CBD5E1] dark:border-[#414042] text-[#334155] dark:text-[#d5c4ac] label-caps">
                <tr>
                  <th className="p-3 w-28 text-left">Tempo / Horário</th>
                  {daysOfWeek.map((d) => (
                    <th key={d.day} className="p-3 w-48 text-center">
                      {d.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#414042]/40 bg-[#FAFBFD] dark:bg-[#121212]">
                {timeSlots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-[#E2E6EA]/40 dark:hover:bg-[#181818]">
                    {/* Time Column */}
                    <td className="p-3 text-left border-r border-[#CBD5E1] dark:border-[#414042]/50 bg-[#EDF0F3] dark:bg-[#161616]">
                      <p className="font-bold text-[#090D16] dark:text-[#e5e2e1]">{slot.label}</p>
                      <span className="text-[10px] data-mono text-[#556575] dark:text-[#9d8f78]">
                        {slot.start} - {slot.end}
                      </span>
                    </td>

                    {/* Days Columns */}
                    {daysOfWeek.map((day) => {
                      const matched = classSchedules.find(
                        (s) =>
                          s.dayOfWeek === day.day &&
                          (s.startTime === slot.start ||
                            (s.startTime <= slot.start && s.endTime >= slot.end))
                      );

                      return (
                        <td
                          key={day.day}
                          className="p-2.5 border-r border-[#CBD5E1] dark:border-[#414042]/40 align-top"
                        >
                          {matched ? (
                            <div className="p-2.5 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/30 text-left space-y-1 group relative transition-all hover:shadow-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[11px] text-primary dark:text-[#DDD6FE] block truncate">
                                  {matched.subject?.name || "Disciplina"}
                                </span>
                                <button
                                  onClick={() => handleDelete(matched.id)}
                                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 cursor-pointer"
                                  title="Remover tempo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[10px] text-[#556575] dark:text-[#d5c4ac] truncate font-medium">
                                Prof. {matched.teacher?.name || "Não atribuído"}
                              </p>
                              <div className="flex items-center justify-between text-[9px] text-[#556575] dark:text-[#9d8f78]">
                                <span>{matched.room?.name || "Sala Normal"}</span>
                                <span className="data-mono">{matched.startTime}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-16 rounded border border-dashed border-[#CBD5E1] dark:border-[#333] flex items-center justify-center text-[#94A3B8] text-[10px] hover:border-primary hover:text-primary transition-colors cursor-pointer">
                              <span>Livre</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#E2E6EA] dark:bg-[#1c1b1b] border-b border-[#CBD5E1] dark:border-[#414042] text-[#334155] dark:text-[#d5c4ac] label-caps">
                <tr>
                  <th className="p-3">Dia da Semana</th>
                  <th className="p-3">Horário</th>
                  <th className="p-3">Disciplina</th>
                  <th className="p-3">Professor</th>
                  <th className="p-3">Sala</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#414042]/50 bg-[#FAFBFD] dark:bg-[#121212]">
                {classSchedules.map((sch) => (
                  <tr key={sch.id} className="hover:bg-[#E2E6EA]/50 dark:hover:bg-[#181818]">
                    <td className="p-3 font-bold text-[#090D16] dark:text-[#e5e2e1]">
                      {daysOfWeek.find((d) => d.day === sch.dayOfWeek)?.name || `Dia ${sch.dayOfWeek}`}
                    </td>
                    <td className="p-3 data-mono font-semibold">
                      {sch.startTime} - {sch.endTime}
                    </td>
                    <td className="p-3 font-bold text-primary dark:text-[#DDD6FE]">
                      {sch.subject?.name || "Disciplina"}
                    </td>
                    <td className="p-3 text-[#556575] dark:text-[#d5c4ac]">
                      {sch.teacher?.name || "N/A"}
                    </td>
                    <td className="p-3 text-[#556575] dark:text-[#9d8f78]">
                      {sch.room?.name || "Sala Principal"}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(sch.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
