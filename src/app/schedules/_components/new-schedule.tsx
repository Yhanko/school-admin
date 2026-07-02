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

interface ClassEntity { id: string; name: string; course: string; }
interface SubjectEntity { id: string; name: string; }
interface TeacherEntity { id: string; profile?: { firstName: string; lastName: string; } }
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

export function NewSchedule({ onCreated }: { onCreated?: () => void }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
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
        if (isOpen) {
            fetchFormData();
        }
    }, [isOpen]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axiosInstance.post('/schedules', {
                ...formData,
                dayOfWeek: Number(formData.dayOfWeek)
            });

            toast({ title: 'Sucesso', description: 'Horário criado com sucesso!' });
            setIsOpen(false);
            if (onCreated) onCreated();
        } catch (error: any) {
            toast({ title: 'Erro', description: error.response?.data?.message || 'Falha ao criar horário.', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
            className="gap-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors shadow-sm">
            <Plus className="w-4 h-4 " />
            Novo Horário
        </Button>
      </SheetTrigger>
      <SheetContent style={{minWidth:600}} className="w-[40rem] overflow-y-auto p-8">
        <SheetHeader>
          <SheetTitle>Alocar Horário</SheetTitle>
          <SheetDescription>
            Adicione uma nova disciplina à grelha horária
          </SheetDescription>
        </SheetHeader>
        
        {isLoadingData ? (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Turma *</label>
                        <select required value={formData.classId} onChange={(e) => setFormData({ ...formData, classId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                            <option value="" disabled>Selecione...</option>
                            {classes.map((c) => (<option key={c.id} value={c.id}>{c.name} ({c.course})</option>))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Disciplina *</label>
                        <select required value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                            <option value="" disabled>Selecione...</option>
                            {subjects.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Professor *</label>
                        <select required value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                            <option value="" disabled>Selecione...</option>
                            {teachers.map((t) => (<option key={t.id} value={t.id}>{t.profile?.firstName} {t.profile?.lastName}</option>))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sala (Opcional)</label>
                        <select value={formData.roomId} onChange={(e) => setFormData({ ...formData, roomId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                            <option value="">Nenhuma</option>
                            {rooms.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dia da Semana *</label>
                        <select required value={formData.dayOfWeek} onChange={(e) => setFormData({ ...formData, dayOfWeek: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                            <option value={1}>Segunda-feira</option>
                            <option value={2}>Terça-feira</option>
                            <option value={3}>Quarta-feira</option>
                            <option value={4}>Quinta-feira</option>
                            <option value={5}>Sexta-feira</option>
                            <option value={6}>Sábado</option>
                            <option value={0}>Domingo</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Início *</label>
                        <input type="time" required value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hora de Fim *</label>
                        <input type="time" required value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                </div>

                <SheetFooter className="mt-8">
                    <Button disabled={isSubmitting} type="submit" className="bg-indigo-600 rounded-full text-white hover:bg-indigo-700">
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
