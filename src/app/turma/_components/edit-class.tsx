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
  Edit
} from "@/lib/icons";

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

export function EditClass() {
    const [formData, setFormData] = useState<ClassFormData>({
        name: '',
        period: 'Manhã',
        academic_level: 'Educação Infantil',
        room: '',
        student_count: 0,
        teacher_ids: [],
        subject_ids: [],
    });


  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="bg-transparent text-secondary-foreground hover:bg-muted hover:text-primary transition-all rounded-sm h-8 w-8 p-0 flex items-center justify-center">
            <Edit className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-4 sm:p-6">
        <SheetHeader>
          <SheetTitle>Turma</SheetTitle>
          <SheetDescription>
            Ataulizar nova turma
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
                Nome da Turma
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Turma A"
              />
            </div>

            <div>
              <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
                Classe 
              </label>
              <input
                type="text"
                required
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Sala 101"
              />
            </div>

            <div>
              <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
                Período
              </label>
              <select
                required
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {PERIODS.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
                Nível Acadêmico *
              </label>
              <select
                required
                value={formData.academic_level}
                onChange={(e) => setFormData({ ...formData, academic_level: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ACADEMIC_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
                Sala
              </label>
              <input
                type="text"
                required
                onChange={(e) =>
                  setFormData({ ...formData, student_count: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold font-hanken text-secondary-foreground mb-2">
              Professores
            </label>
            <div className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-4 max-h-48 overflow-y-auto">
              <div className="space-y-2">
                <label
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded"
                >
                    <input
                        type="checkbox"
                        className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-foreground">Osvaldo Pedro</span>
                </label>
              </div>
            </div>
          </div>
        <SheetFooter>
          <Button type="submit" className="bg-primary text-primary-foreground border-none rounded-sm hover:bg-[#A78BFA] hover:shadow-[0_0_12px_rgba(139, 92, 246,0.4)] transition-all font-bold font-hanken text-sm px-4 py-2 h-10">Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}