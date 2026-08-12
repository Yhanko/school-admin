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
      <div className="space-y-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-card to-muted/30 border-b">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                    <Calendar className="w-6 h-6" />
                </div>
                Gestão de Horários
            </CardTitle>
          </CardHeader>
          <div className="p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione a Turma
                </label>
                <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                    <option value="" disabled>Escolha uma turma...</option>
                    {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name} - {c.course}</option>
                    ))}
                </select>
            </div>
            <div className="w-full sm:w-auto mt-6 sm:mt-0">
                <NewSchedule onCreated={fetchSchedules} />
            </div>
          </div>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Dia da Semana</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Horário</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Disciplina</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Professor</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Sala</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                      <tr>
                          <td colSpan={6} className="py-8 text-center">
                              <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
                          </td>
                      </tr>
                  ) : schedules.length === 0 ? (
                      <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500">
                              Nenhum horário definido para esta turma.
                          </td>
                      </tr>
                  ) : schedules
                        .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime))
                        .map((schedule) => (
                    <tr key={schedule.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900">{daysOfWeekMap[schedule.dayOfWeek]}</td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-xs bg-gray-100 rounded px-2 inline-block mt-2 ml-4">
                          {schedule.startTime} - {schedule.endTime}
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">{schedule.subject?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-gray-600">
                          {schedule.teacher?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{schedule.room?.name || 'N/A'}</td>
                      <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(schedule.id)} className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                              <Trash2 className="w-4 h-4" />
                          </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
