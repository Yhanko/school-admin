"use client"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Loader2 } from "@/lib/icons";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface ClassEntity { id: string; name: string; course: string; }
interface SubjectEntity { id: string; name: string; }
interface TeacherEntity { id: string; name: string; }
interface RoomEntity { id: string; name: string; }

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

const scheduleSchema = z.object({
  classId: z.string().min(1, "Selecione uma turma"),
  subjectId: z.string().min(1, "Selecione uma disciplina"),
  teacherId: z.string().min(1, "Selecione um professor"),
  roomId: z.string().optional(),
  dayOfWeek: z.number().min(0).max(6, "Dia da semana inválido"),
  startTime: z.string().regex(timeRegex, "Hora inválida (formato HH:MM)"),
  endTime: z.string().regex(timeRegex, "Hora inválida (formato HH:MM)"),
}).refine(data => {
  return data.startTime < data.endTime;
}, {
  message: "A hora de fim deve ser posterior à hora de início",
  path: ["endTime"]
});

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
    
    const [formData, setFormData] = useState<ScheduleFormData>({
        classId: '',
        subjectId: '',
        teacherId: '',
        roomId: '',
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '09:30'
    });

    useEffect(() => {
        if (!isOpen) return;

        const fetchFormData = async () => {
            setIsLoadingData(true);
            try {
                const [classesRes, subjectsRes, teachersRes, roomsRes] = await Promise.all([
                    axiosInstance.get('/classes'),
                    axiosInstance.get('/subjects'),
                    axiosInstance.get('/users?role=TEACHER'),
                    axiosInstance.get('/rooms')
                ]);
                
                setClasses(classesRes.data);
                setSubjects(subjectsRes.data);
                setTeachers(teachersRes.data);
                setRooms(roomsRes.data);

                // Pre-select first items if available
                setFormData(prev => ({
                    ...prev,
                    classId: prev.classId || (classesRes.data[0]?.id || ''),
                    subjectId: prev.subjectId || (subjectsRes.data[0]?.id || ''),
                    teacherId: prev.teacherId || (teachersRes.data[0]?.id || ''),
                    roomId: prev.roomId || (roomsRes.data[0]?.id || '')
                }));
            } catch (error) {
                console.error("Failed to fetch form data", error);
                toast({ title: 'Erro', description: 'Não foi possível carregar os dados.', variant: 'destructive' });
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchFormData();
    }, [isOpen, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Zod Validation Execution
        const result = scheduleSchema.safeParse(formData);
        
        if (!result.success) {
          const newErrors: Record<string, string> = {};
          result.error.errors.forEach(err => {
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
            await axiosInstance.post('/schedules', {
                ...formData,
                dayOfWeek: Number(formData.dayOfWeek)
            });

            toast({ title: 'Sucesso', description: 'Horário criado com sucesso!' });
            setIsOpen(false);
            if (onCreated) onCreated();
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            toast({ title: 'Erro', description: err.response?.data?.message || 'Falha ao criar horário.', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
            className="gap-2 bg-primary text-primary-foreground border-none rounded-sm hover:bg-[#A78BFA] hover:shadow-[0_0_12px_rgba(139, 92, 246,0.4)] transition-all font-bold font-hanken">
            <Plus className="w-4 h-4 " />
            Novo Horário
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg border-secondary-foreground bg-popover shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-y-auto p-4 sm:p-6">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold font-hanken text-foreground">Alocar Horário</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Adicione uma nova disciplina à grelha horária
          </SheetDescription>
        </SheetHeader>
        
        {isLoadingData ? (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">Turma *</label>
                        <select required value={formData.classId} onChange={(e) => setFormData({ ...formData, classId: e.target.value })} className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors bg-card focus:border-secondary-foreground">
                            <option value="" disabled>Selecione...</option>
                            {classes.map((c) => (<option key={c.id} value={c.id}>{c.name} ({c.course})</option>))}
                        </select>
                        {errors.classId && <p className="text-red-500 text-xs mt-1">{errors.classId}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">Disciplina *</label>
                        <select required value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors bg-card focus:border-secondary-foreground">
                            <option value="" disabled>Selecione...</option>
                            {subjects.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                        </select>
                        {errors.subjectId && <p className="text-red-500 text-xs mt-1">{errors.subjectId}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">Professor *</label>
                        <select required value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors bg-card focus:border-secondary-foreground">
                            <option value="" disabled>Selecione...</option>
                            {teachers.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                        </select>
                        {errors.teacherId && <p className="text-red-500 text-xs mt-1">{errors.teacherId}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">Sala (Opcional)</label>
                        <select value={formData.roomId} onChange={(e) => setFormData({ ...formData, roomId: e.target.value })} className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors bg-card focus:border-secondary-foreground">
                            <option value="">Nenhuma</option>
                            {rooms.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
                        </select>
                        {errors.roomId && <p className="text-red-500 text-xs mt-1">{errors.roomId}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">Dia da Semana *</label>
                        <select required value={formData.dayOfWeek} onChange={(e) => setFormData({ ...formData, dayOfWeek: Number(e.target.value) })} className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors bg-card focus:border-secondary-foreground">
                            <option value={1}>Segunda-feira</option>
                            <option value={2}>Terça-feira</option>
                            <option value={3}>Quarta-feira</option>
                            <option value={4}>Quinta-feira</option>
                            <option value={5}>Sexta-feira</option>
                            <option value={6}>Sábado</option>
                            <option value={0}>Domingo</option>
                        </select>
                        {errors.dayOfWeek && <p className="text-red-500 text-xs mt-1">{errors.dayOfWeek}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">Hora de Início *</label>
                        <input type="time" required value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-secondary-foreground" />
                        {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">Hora de Fim *</label>
                        <input type="time" required value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-secondary-foreground" />
                        {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
                    </div>
                </div>

                <SheetFooter className="mt-5 pt-4 border-t border-gray-100">
                    <Button disabled={isSubmitting} type="submit" className="w-full bg-primary text-primary-foreground border-none rounded-sm hover:bg-[#A78BFA] hover:shadow-[0_0_12px_rgba(139, 92, 246,0.4)] transition-all font-hanken font-bold h-11 font-semibold text-sm">
                        {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                        {isSubmitting ? "A guardar..." : "Guardar Horário"}
                    </Button>
                </SheetFooter>
            </form>
        )}
      </SheetContent>
    </Sheet>
  )
}
