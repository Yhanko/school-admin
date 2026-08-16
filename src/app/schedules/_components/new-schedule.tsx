"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Loader2, Clock, Sparkles } from "@/lib/icons";
import { AlertTriangle, CheckCircle } from "lucide-react";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface ClassEntity {
  id: string;
  name: string;
  course: string;
}
interface SubjectEntity {
  id: string;
  name: string;
}
interface TeacherEntity {
  id: string;
  name: string;
}
interface RoomEntity {
  id: string;
  name: string;
}
interface ExistingSchedule {
  id: string;
  classId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  teacher?: { id: string; name: string };
  room?: { id: string; name: string };
  class?: { id: string; name: string };
}

interface ScheduleFormData {
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM 24h format

const scheduleSchema = z
  .object({
    classId: z.string().min(1, "Selecione uma turma"),
    subjectId: z.string().min(1, "Selecione uma disciplina"),
    teacherId: z.string().min(1, "Selecione um professor"),
    roomId: z.string().optional(),
    dayOfWeek: z.number().min(0).max(6, "Dia da semana inválido"),
    startTime: z.string().regex(timeRegex, "Hora inválida (formato HH:MM)"),
    endTime: z.string().regex(timeRegex, "Hora inválida (formato HH:MM)"),
  })
  .refine(
    (data) => {
      return data.startTime < data.endTime;
    },
    {
      message: "A hora de fim deve ser posterior à hora de início",
      path: ["endTime"],
    }
  );

export function NewSchedule({ onCreated }: { onCreated?: () => void }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [classes, setClasses] = useState<ClassEntity[]>([]);
  const [subjects, setSubjects] = useState<SubjectEntity[]>([]);
  const [teachers, setTeachers] = useState<TeacherEntity[]>([]);
  const [rooms, setRooms] = useState<RoomEntity[]>([]);
  const [allSchedules, setAllSchedules] = useState<ExistingSchedule[]>([]);

  const [formData, setFormData] = useState<ScheduleFormData>({
    classId: "",
    subjectId: "",
    teacherId: "",
    roomId: "",
    dayOfWeek: 1,
    startTime: "07:30",
    endTime: "08:15",
  });

  useEffect(() => {
    if (!isOpen) return;

    const fetchFormData = async () => {
      setIsLoadingData(true);
      try {
        const [classesRes, subjectsRes, teachersRes, roomsRes, schedulesRes] =
          await Promise.all([
            axiosInstance.get("/classes"),
            axiosInstance.get("/subjects"),
            axiosInstance.get("/users?role=TEACHER"),
            axiosInstance.get("/rooms"),
            axiosInstance.get("/schedules").catch(() => ({ data: [] })),
          ]);

        setClasses(classesRes.data);
        setSubjects(subjectsRes.data);
        setTeachers(teachersRes.data);
        setRooms(roomsRes.data);
        if (Array.isArray(schedulesRes.data)) {
          setAllSchedules(schedulesRes.data);
        }

        // Pre-select first items if available
        setFormData((prev) => ({
          ...prev,
          classId: prev.classId || classesRes.data[0]?.id || "",
          subjectId: prev.subjectId || subjectsRes.data[0]?.id || "",
          teacherId: prev.teacherId || teachersRes.data[0]?.id || "",
          roomId: prev.roomId || roomsRes.data[0]?.id || "",
        }));
      } catch (error) {
        console.error("Failed to fetch form data", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchFormData();
  }, [isOpen, toast]);

  // Conflict Detection
  const teacherConflict = useMemo(() => {
    if (!formData.teacherId || !formData.startTime || !formData.endTime)
      return null;

    const conflicting = allSchedules.find(
      (s) =>
        s.teacher?.id === formData.teacherId &&
        s.dayOfWeek === Number(formData.dayOfWeek) &&
        s.classId !== formData.classId &&
        ((formData.startTime >= s.startTime && formData.startTime < s.endTime) ||
          (formData.endTime > s.startTime && formData.endTime <= s.endTime) ||
          (formData.startTime <= s.startTime && formData.endTime >= s.endTime))
    );

    return conflicting;
  }, [formData, allSchedules]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Zod Validation Execution
    const result = scheduleSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await axiosInstance.post("/schedules", {
        ...formData,
        dayOfWeek: Number(formData.dayOfWeek),
      });

      toast({
        title: "Sucesso",
        description: "Horário alocado com sucesso!",
      });
      setIsOpen(false);
      if (onCreated) onCreated();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Erro",
        description:
          err.response?.data?.message || "Falha ao criar horário.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground border-none rounded hover:bg-[#A78BFA] transition-all font-bold font-hanken h-10 px-4 cursor-pointer shadow-xs">
          <Plus className="w-4 h-4" />
          <span>Novo Horário</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg border-secondary-foreground bg-popover shadow-xl overflow-y-auto p-4 sm:p-6 font-hanken">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-primary/10 text-primary">
              <Clock className="w-4 h-4" />
            </div>
            <SheetTitle className="text-lg font-bold font-hanken text-foreground">
              Alocar Horário Inteligente
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            Adicione uma nova disciplina à grelha com validação anti-conflito em tempo real
          </SheetDescription>
        </SheetHeader>

        {isLoadingData ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Live Anti-Conflict Warning Banner */}
            {teacherConflict && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-lg flex items-start gap-2 text-xs text-amber-900 dark:text-amber-300 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">
                    ⚠️ Atenção: Possível Choque de Horário
                  </strong>
                  <span>
                    Este professor já leciona na turma{" "}
                    <strong>{teacherConflict.class?.name || "Outra Turma"}</strong>{" "}
                    neste dia ({teacherConflict.startTime} - {teacherConflict.endTime}).
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold font-hanken text-[#556575] dark:text-[#d5c4ac] mb-1">
                  Turma *
                </label>
                <select
                  required
                  value={formData.classId}
                  onChange={(e) =>
                    setFormData({ ...formData, classId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input border border-border rounded text-xs font-hanken text-foreground font-semibold outline-none focus:border-primary"
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.course})
                    </option>
                  ))}
                </select>
                {errors.classId && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.classId}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold font-hanken text-[#556575] dark:text-[#d5c4ac] mb-1">
                  Disciplina *
                </label>
                <select
                  required
                  value={formData.subjectId}
                  onChange={(e) =>
                    setFormData({ ...formData, subjectId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input border border-border rounded text-xs font-hanken text-foreground font-semibold outline-none focus:border-primary"
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.subjectId && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.subjectId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold font-hanken text-[#556575] dark:text-[#d5c4ac] mb-1">
                  Professor *
                </label>
                <select
                  required
                  value={formData.teacherId}
                  onChange={(e) =>
                    setFormData({ ...formData, teacherId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input border border-border rounded text-xs font-hanken text-foreground font-semibold outline-none focus:border-primary"
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {errors.teacherId && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.teacherId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold font-hanken text-[#556575] dark:text-[#d5c4ac] mb-1">
                  Sala (Opcional)
                </label>
                <select
                  value={formData.roomId}
                  onChange={(e) =>
                    setFormData({ ...formData, roomId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input border border-border rounded text-xs font-hanken text-foreground font-semibold outline-none focus:border-primary"
                >
                  <option value="">Nenhuma</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {errors.roomId && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.roomId}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold font-hanken text-[#556575] dark:text-[#d5c4ac] mb-1">
                  Dia da Semana *
                </label>
                <select
                  required
                  value={formData.dayOfWeek}
                  onChange={(e) =>
                    setFormData({ ...formData, dayOfWeek: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 bg-input border border-border rounded text-xs font-hanken text-foreground font-semibold outline-none focus:border-primary"
                >
                  <option value={1}>Segunda-feira</option>
                  <option value={2}>Terça-feira</option>
                  <option value={3}>Quarta-feira</option>
                  <option value={4}>Quinta-feira</option>
                  <option value={5}>Sexta-feira</option>
                  <option value={6}>Sábado</option>
                  <option value={0}>Domingo</option>
                </select>
                {errors.dayOfWeek && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.dayOfWeek}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold font-hanken text-[#556575] dark:text-[#d5c4ac] mb-1">
                  Hora de Início *
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input border border-border rounded text-xs font-hanken text-foreground font-semibold outline-none focus:border-primary"
                />
                {errors.startTime && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.startTime}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold font-hanken text-[#556575] dark:text-[#d5c4ac] mb-1">
                  Hora de Fim *
                </label>
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-input border border-border rounded text-xs font-hanken text-foreground font-semibold outline-none focus:border-primary"
                />
                {errors.endTime && (
                  <p className="text-red-500 text-[10px] mt-1">
                    {errors.endTime}
                  </p>
                )}
              </div>
            </div>

            <SheetFooter className="mt-5 pt-4 border-t border-border">
              <Button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-primary text-white border-none rounded hover:bg-[#A78BFA] transition-all font-hanken font-bold h-10 text-xs cursor-pointer shadow-xs"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                {isSubmitting ? "A guardar..." : "Guardar Horário"}
              </Button>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
