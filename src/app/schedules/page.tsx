"use client"
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Trash2 } from "@/lib/icons";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import { NewSchedule } from "./_components/new-schedule";

interface Schedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  subject?: { name: string };
  teacher?: { name: string };
  room?: { name: string };
}

interface ClassEntity {
    id: string;
    name: string;
    course: string;
}

export default function SchedulesPage() {
  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchClasses = async () => {
      try {
          const res = await axiosInstance.get('/classes');
          setClasses(res.data);
          if (res.data.length > 0) {
              setSelectedClassId(res.data[0].id);
          }
      } catch (error) {
          console.error("Failed to fetch classes", error);
      }
  };

  useEffect(() => {
      fetchClasses();
  }, []);

  const fetchSchedules = useCallback(async () => {
      if (!selectedClassId) return;
      setIsLoading(true);
      try {
          const res = await axiosInstance.get(`/schedules/class/${selectedClassId}`);
          setSchedules(res.data);
      } catch (error) {
          console.error("Failed to fetch schedules", error);
          setSchedules([]);
      } finally {
          setIsLoading(false);
      }
  }, [selectedClassId]);

  useEffect(() => {
      fetchSchedules();
  }, [fetchSchedules]);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem a certeza que deseja eliminar este horário?")) return;
    try {
        await axiosInstance.delete(`/schedules/${id}`);
        toast({ title: "Sucesso", description: "Horário eliminado com sucesso!" });
        fetchSchedules();
    } catch {
        toast({ title: "Erro", description: "Falha ao eliminar horário.", variant: "destructive" });
    }
  }

  const daysOfWeekMap = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

  return (
      <div className="space-y-5">
        <Card className="bg-card border border-border shadow-none rounded-lg">
          <CardHeader className="bg-card border-b border-border">
            <CardTitle className="text-2xl sm:text-3xl font-bold font-hanken text-foreground tracking-tight flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                Gestão de Horários
            </CardTitle>
          </CardHeader>
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            <div className="w-full sm:w-1/2 lg:w-1/3">
                <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
                    Selecione a Turma
                </label>
                <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-input border border-border focus:border-secondary-foreground rounded-sm text-sm font-hanken text-foreground"
                >
                    <option value="" disabled>Escolha uma turma...</option>
                    {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name} - {c.course}</option>
                    ))}
                </select>
            </div>
            <div className="w-full sm:w-auto">
                <NewSchedule onCreated={fetchSchedules} />
            </div>
          </div>
          <CardContent className="px-0 pb-0">
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-gray-100">
                  <tr>
                    <th className="text-left py-3 px-4 font-jetbrains text-[11px] font-bold text-secondary-foreground uppercase tracking-widest">Dia da Semana</th>
                    <th className="text-left py-3 px-4 font-jetbrains text-[11px] font-bold text-secondary-foreground uppercase tracking-widest">Horário</th>
                    <th className="text-left py-3 px-4 font-jetbrains text-[11px] font-bold text-secondary-foreground uppercase tracking-widest">Disciplina</th>
                    <th className="text-left py-3 px-4 font-jetbrains text-[11px] font-bold text-secondary-foreground uppercase tracking-widest">Professor</th>
                    <th className="text-left py-3 px-4 font-jetbrains text-[11px] font-bold text-secondary-foreground uppercase tracking-widest">Sala</th>
                    <th className="text-center py-3 px-4 font-jetbrains text-[11px] font-bold text-secondary-foreground uppercase tracking-widest">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                      <tr>
                          <td colSpan={6} className="py-8 text-center">
                              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                          </td>
                      </tr>
                  ) : schedules.length === 0 ? (
                      <tr>
                          <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                              Nenhum horário definido para esta turma.
                          </td>
                      </tr>
                  ) : schedules
                        .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
                        .map((schedule) => (
                    <tr key={schedule.id} className="border-b border-gray-100 hover:bg-muted transition-colors">
                      <td className="py-3 px-4 font-bold font-hanken text-foreground whitespace-nowrap">{daysOfWeekMap[schedule.dayOfWeek]}</td>
                      <td className="py-3 px-4">
                        <span className="font-jetbrains text-[11px] font-bold bg-muted text-foreground rounded-sm px-2 py-1 whitespace-nowrap">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium whitespace-nowrap">{schedule.subject?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{schedule.teacher?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{schedule.room?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(schedule.id)} className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                          </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-border">
              {isLoading ? (
                <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : schedules.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Nenhum horário definido.</p>
              ) : schedules
                  .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
                  .map((schedule) => (
                <div key={schedule.id} className="p-4 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground">{daysOfWeekMap[schedule.dayOfWeek]}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{schedule.subject?.name || 'N/A'}</p>
                    </div>
                    <span className="font-jetbrains text-[11px] font-bold bg-muted text-foreground rounded-sm px-2 py-1 whitespace-nowrap shrink-0">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      <span>{schedule.teacher?.name || 'N/A'}</span>
                      {schedule.room?.name && <span className="ml-2 text-muted-foreground">· {schedule.room.name}</span>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(schedule.id)} className="h-7 w-7 p-0 text-red-500 hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
