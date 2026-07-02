"use client"
import { Button } from "@/components/ui/button"
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Plus,
} from "@/lib/icons";
import axiosInstance from "@/service/api";
import { Loader2 } from "lucide-react";

const PERIODS = ['Manhã', 'Tarde', 'Noite', 'Integral'];
const ACADEMIC_LEVELS = [
  'Educação Infantil',
  '1º Ano',
  '2º Ano',
  '3º Ano',
  '4º Ano',
  '5º Ano',
  '6º Ano',
  '7º Ano',
  '8º Ano',
  '9º Ano',
  '1º Ano - Ensino Médio',
  '2º Ano - Ensino Médio',
  '3º Ano - Ensino Médio',
];

export interface ClassFormData {
  name: string;
  period: string;
  academic_level: string;
  room: string;
  student_count: number;
  teacher_ids: string[];
  subject_ids: string[];
}

export function NewClass() {
  const [formData, setFormData] = useState<ClassFormData>({
      name: '',
      period: 'Manhã',
      academic_level: 'Educação Infantil',
      room: '',
      student_count: 0,
      teacher_ids: ["temp-teacher-id"],
      subject_ids: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axiosInstance.post('/classes', {
        name: formData.name,
        period: formData.period,
        academicLevel: formData.academic_level,
        room: formData.room,
        capacity: formData.student_count || 35,
        teacherIds: formData.teacher_ids,
      });
      alert('Turma criada com sucesso!');
      window.location.reload();
    } catch (error) {
      console.error('Erro ao criar turma', error);
      alert('Erro ao criar turma');
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Turma
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Turma A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nº de total de alunos 
              </label>
              <input
                type="number"
                required
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Sala 101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                required
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {PERIODS.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível Acadêmico *
              </label>
              <select
                required
                value={formData.academic_level}
                onChange={(e) => setFormData({ ...formData, academic_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ACADEMIC_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sala
              </label>
              <input
                type="text"
                required
                onChange={(e) =>
                  setFormData({ ...formData, student_count: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classe
              </label>
              <input
                type="text"
                required
                onChange={(e) =>
                  setFormData({ ...formData, student_count: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professores
            </label>
            <select
                required
                value={formData.academic_level}
                onChange={(e) => setFormData({ ...formData, academic_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ACADEMIC_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>   
          </div>
        <SheetFooter className="mt-6">
          <Button type="submit" disabled={isSubmitting} className="bg-[#5856eb] rounded-full text-white hover:cursor-pointer hover:text-white hover:bg-[#3c3ad6]">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save changes
          </Button>
        </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
