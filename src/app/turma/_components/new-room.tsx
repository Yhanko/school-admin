"use client"
import { Button } from "@/components/ui/button"
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "@/lib/icons";
import axiosInstance from "@/service/api";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ACADEMIC_LEVELS = [
  '1-6',
  '7-9',
  '10-13',
];

export interface RoomFormData {
  name: string;
  capacity: number;
  floor: string;
  academic_level: string;
  grade: string;
}

export function NewRoom() {
  const [formData, setFormData] = useState<RoomFormData>({
      name: '',
      capacity: 35,
      floor: '',
      academic_level: '1-6',
      grade: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.post('/rooms', {
        name: formData.name,
        capacity: formData.capacity,
        floor: formData.floor,
        academicLevel: formData.academic_level,
        grade: formData.grade || undefined,
      });
      toast({
        title: "Sucesso",
        description: "Sala registada com sucesso!",
      });
      setIsOpen(false);
      // Optional: reload or trigger a callback to update a list if we had one here
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Erro ao registar sala', error);
      toast({
        title: "Erro",
        description: "Erro ao registar a sala. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
            variant="outline"
            className="gap-2 rounded-full hover:cursor-pointer">
            <Plus className="w-4 h-4 " />
            Nova Sala
        </Button>
      </SheetTrigger>
      <SheetContent style={{minWidth:600}} className="w-[70rem] overflow-y-auto scrollbar-none p-8">
        <SheetHeader>
          <SheetTitle>Sala de Aula</SheetTitle>
          <SheetDescription>
            Registe uma nova sala de aula para atribuir posteriormente às turmas.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome ou Número da Sala
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: Sala 01 ou Laboratório B"
              />
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
                className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Andar / Bloco (Opcional)
              </label>
              <input
                type="text"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Ex: 1º Andar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nível Académico
              </label>
              <select
                required
                value={formData.academic_level}
                onChange={(e) => setFormData({ ...formData, academic_level: e.target.value, grade: '' })}
                className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {ACADEMIC_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level === '1-6' ? 'Ensino Primário (1-6)' : level === '7-9' ? 'Ensino Secundário I (7-9)' : 'Ensino Secundário II (10-13)'}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Atribuir a uma Classe Específica? (Opcional)
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Se deixar em branco, a sala estará disponível para todas as classes do Nível Académico selecionado.
              </p>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">-- Disponível para todas as classes do Cíclo --</option>
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

          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#5856eb] text-white hover:bg-[#423ff3]"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Sala
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
