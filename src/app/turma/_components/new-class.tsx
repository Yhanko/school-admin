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
import { Plus } from "@/lib/icons";
import axiosInstance from "@/service/api";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const PERIODS = ['Manhã', 'Tarde', 'Noite', 'Integral'];
const ACADEMIC_LEVELS = [
  '1-6',
  '7-9',
  '10-13',
];

export interface ClassFormData {
  name: string;
  period: string;
  academic_level: string;
  grade: string;
  course: string;
  roomName: string;
  capacity: number;
}

const safeStringRegex = /^[^<>';=]*$/;

const classSchema = z.object({
  name: z.string().trim().min(1, "Campo obrigatório").max(100, "Texto demasiado longo").regex(safeStringRegex, "Caracteres inválidos"),
  period: z.string().min(1, "Selecione um período"),
  academic_level: z.string().min(1, "Selecione o nível académico"),
  grade: z.string().min(1, "Selecione a classe"),
  course: z.string().regex(safeStringRegex, "Caracteres inválidos").optional(),
  roomName: z.string().min(1, "Selecione uma sala"),
  capacity: z.number().min(1, "A capacidade deve ser maior que 0"),
});

export function NewClass() {
  const [formData, setFormData] = useState<ClassFormData>({
      name: '',
      period: 'Manhã',
      academic_level: '1-6',
      grade: '',
      course: '',
      roomName: '',
      capacity: 35,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rooms, setRooms] = useState<{ id: string; name: string; floor?: string; capacity?: number }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let url = `/rooms?academicLevel=${encodeURIComponent(formData.academic_level)}`;
        if (formData.grade) {
          url += `&grade=${encodeURIComponent(formData.grade)}`;
        }
        const response = await axiosInstance.get(url);
        setRooms(response.data);
      } catch (error) {
        console.error("Failed to fetch rooms", error);
      }
    };
    fetchRooms();
  }, [formData.academic_level, formData.grade]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Zod Validation Execution
    const result = classSchema.safeParse(formData);
    
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
    
    if (formData.academic_level === '10-13' && !formData.course?.trim()) {
      setErrors({ ...errors, course: "Curso é obrigatório no Secundário II" });
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    try {
      await axiosInstance.post('/classes', {
        name: formData.name,
        period: formData.period,
        academicLevel: formData.academic_level,
        grade: formData.grade,
        course: formData.course,
        room: formData.roomName, // DTO expects 'room'
        capacity: formData.capacity,
      });
      toast({
        title: "Sucesso",
        description: "Turma criada com sucesso!",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Erro ao criar turma', error);
      toast({
        title: "Erro",
        description: "Erro ao criar turma. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
            className="gap-2 flex items-center bg-primary text-primary-foreground border-none rounded-sm hover:bg-[#A78BFA] hover:shadow-[0_0_12px_rgba(139, 92, 246,0.4)] transition-all font-bold font-hanken text-sm px-4 py-2 h-10">
            <Plus className="w-4 h-4 " />
            Nova Turma
        </Button>
      </SheetTrigger>
      <SheetContent style={{minWidth:600}} className="w-[70rem] border-secondary-foreground bg-popover shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-y-auto scrollbar-none p-8">
        <SheetHeader>
          <SheetTitle>Turma</SheetTitle>
          <SheetDescription>
            Adicione uma nova turma
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
                Nome da Turma
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: 1ª Classe A"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
                Nível Acadêmico *
              </label>
              <select
                required
                value={formData.academic_level}
                onChange={(e) => setFormData({ ...formData, academic_level: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {ACADEMIC_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level === '1-6' ? 'Ensino Primário (1-6)' : level === '7-9' ? 'Ensino Secundário I (7-9)' : 'Ensino Secundário II (10-13)'}
                  </option>
                ))}
              </select>
              {errors.academic_level && <p className="text-red-500 text-xs mt-1">{errors.academic_level}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
                Classe / Ano
              </label>
              <select
                required
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Selecione a classe</option>
                {formData.academic_level === '1-6' && (
                  <>
                    <option value="1ª Classe">1ª Classe</option>
                    <option value="2ª Classe">2ª Classe</option>
                    <option value="3ª Classe">3ª Classe</option>
                    <option value="4ª Classe">4ª Classe</option>
                    <option value="5ª Classe">5ª Classe</option>
                    <option value="6ª Classe">6ª Classe</option>
                  </>
                )}
                {formData.academic_level === '7-9' && (
                  <>
                    <option value="7ª Classe">7ª Classe</option>
                    <option value="8ª Classe">8ª Classe</option>
                    <option value="9ª Classe">9ª Classe</option>
                  </>
                )}
                {formData.academic_level === '10-13' && (
                  <>
                    <option value="10ª Classe">10ª Classe</option>
                    <option value="11ª Classe">11ª Classe</option>
                    <option value="12ª Classe">12ª Classe</option>
                    <option value="13ª Classe">13ª Classe</option>
                  </>
                )}
              </select>
              {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
            </div>

            {formData.academic_level === '10-13' && (
              <div>
                <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
                  Curso / Profissão
                </label>
                <input
                  type="text"
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: Ciências Físicas e Biológicas"
                />
                {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
                Período
              </label>
              <select
                required
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {PERIODS.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
              {errors.period && <p className="text-red-500 text-xs mt-1">{errors.period}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
                Sala
              </label>
              <select
                required
                value={formData.roomName}
                onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Selecione uma sala</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.name}>
                    {room.name} {room.floor ? `(${room.floor})` : ''} - Cap: {room.capacity}
                  </option>
                ))}
              </select>
              {errors.roomName && <p className="text-red-500 text-xs mt-1">{errors.roomName}</p>}
              {rooms.length === 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  Nenhuma sala cadastrada para este Cíclo/Classe.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
                Capacidade Máxima (Alunos)
              </label>
              <input
                type="number"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
            </div>
          </div>

        <SheetFooter className="mt-8">
          <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground border-none rounded-sm hover:bg-[#A78BFA] hover:shadow-[0_0_12px_rgba(139, 92, 246,0.4)] transition-all font-bold font-hanken text-sm px-4 py-2 h-10">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Salvar Turma
          </Button>
        </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
