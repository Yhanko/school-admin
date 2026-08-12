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
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
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
            className="gap-2 bg-[#5856eb] rounded-full text-white hover:bg-[#423ff3] hover:text-white hover:cursor-pointer">
            <Plus className="w-4 h-4 " />
            Nova Turma
        </Button>
      </SheetTrigger>
      <SheetContent style={{minWidth:600}} className="w-[70rem] overflow-y-auto scrollbar-none p-8">
        <SheetHeader>
          <SheetTitle>Turma</SheetTitle>
          <SheetDescription>
            Adicione uma nova turma
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome da Turma
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: 1ª Classe A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nível Acadêmico *
              </label>
              <select
                required
                value={formData.academic_level}
                onChange={(e) => setFormData({ ...formData, academic_level: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {ACADEMIC_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level === '1-6' ? 'Ensino Primário (1-6)' : level === '7-9' ? 'Ensino Secundário I (7-9)' : 'Ensino Secundário II (10-13)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Classe / Ano
              </label>
              <select
                required
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
            </div>

            {formData.academic_level === '10-13' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Curso / Profissão
                </label>
                <input
                  type="text"
                  required
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: Ciências Físicas e Biológicas"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Período
              </label>
              <select
                required
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {PERIODS.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sala
              </label>
              <select
                required
                value={formData.roomName}
                onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Selecione uma sala</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.name}>
                    {room.name} {room.floor ? `(${room.floor})` : ''} - Cap: {room.capacity}
                  </option>
                ))}
              </select>
              {rooms.length === 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  Nenhuma sala cadastrada para este Cíclo/Classe.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Capacidade Máxima (Alunos)
              </label>
              <input
                type="number"
                required
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

        <SheetFooter className="mt-8">
          <Button type="submit" disabled={isSubmitting} className="bg-[#5856eb] rounded-full text-white hover:cursor-pointer hover:text-white hover:bg-[#3c3ad6]">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Salvar Turma
          </Button>
        </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
