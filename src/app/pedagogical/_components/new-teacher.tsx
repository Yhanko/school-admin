"use client"
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/service/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from '@/lib/icons';
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus } from "@/lib/icons";
import { z } from "zod";

const safeStringRegex = /^[^<>';=]*$/;

const teacherSchema = z.object({
  firstName: z.string().trim().min(1, "Primeiro nome é obrigatório").max(100, "Texto demasiado longo").regex(safeStringRegex, "Caracteres inválidos"),
  lastName: z.string().trim().min(1, "Último nome é obrigatório").max(100, "Texto demasiado longo").regex(safeStringRegex, "Caracteres inválidos"),
  email: z.string().trim().min(1, "Email é obrigatório").email("Formato de email inválido"),
  phone: z.string().trim().min(1, "Telemóvel é obrigatório").regex(safeStringRegex, "Caracteres inválidos"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação da senha deve ter no mínimo 6 caracteres"),
  classId: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export function NewTeacher() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [classes, setClasses] = useState<{ id: string; name: string; academicLevel?: string; grade?: string }[]>([]);
  
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      classId: '',
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axiosInstance.get('/classes');
        setClasses(response.data);
      } catch (error) {
        console.error("Failed to fetch classes", error);
      }
    };
    if (isOpen) {
        fetchClasses();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Zod Validation Execution
    const result = teacherSchema.safeParse(formData);
    
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
    setIsLoading(true);

    const name = `${formData.firstName} ${formData.lastName}`.trim();
    
    try {
        await axiosInstance.post('/users/employee', {
            name,
            email: formData.email,
            password: formData.password,
            role: 'TEACHER',
            phone: formData.phone,
            classId: formData.classId || undefined,
        });

        toast({ title: 'Sucesso', description: 'Professor criado com sucesso!' });
        setFormData({
            firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', classId: ''
        });
        setIsOpen(false);
        // Reloading the page to fetch the new list of teachers
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast({ title: 'Erro', description: err.response?.data?.message || 'Falha ao criar professor', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-black h-10 px-5 text-sm font-hanken font-bold rounded shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] transition-all cursor-pointer w-full md:w-auto"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Novo Professor
        </Button>
      </SheetTrigger>
      <SheetContent style={{minWidth: 540}} className="w-full sm:max-w-xl bg-[#1A1A1A] border-l border-[#C0C2C5] text-[#e5e2e1] overflow-y-auto p-6 font-hanken">
        <SheetHeader className="border-b border-[#414042] pb-4">
          <SheetTitle className="headline-sm text-[#e5e2e1]">Adicionar Novo Professor</SheetTitle>
          <SheetDescription className="text-xs text-[#d5c4ac] mt-0.5">
            Cadastre um novo professor e atribua credenciais pedagógicas
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
            <div className="bg-[#201f1f] border border-[#414042] p-3 rounded flex items-center justify-between">
              <h2 className="label-caps text-[#DDD6FE]">Dados Pessoais & Credenciais</h2>
              <span className="text-[10px] text-[#9d8f78] data-mono">MÓDULO DOCENTE</span>
            </div>
            
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block label-caps text-[#d5c4ac] mb-1.5">Primeiro Nome *</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#414042] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] outline-none transition-colors" placeholder="Ex: António" />
                    {errors.firstName && <p className="text-[#ffb4ab] text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                    <label className="block label-caps text-[#d5c4ac] mb-1.5">Último Nome *</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#414042] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] outline-none transition-colors" placeholder="Ex: Silva" />
                    {errors.lastName && <p className="text-[#ffb4ab] text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block label-caps text-[#d5c4ac] mb-1.5">Email Institucional *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#414042] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] outline-none transition-colors" placeholder="professor@escola.ao" />
                    {errors.email && <p className="text-[#ffb4ab] text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label className="block label-caps text-[#d5c4ac] mb-1.5">Telemóvel *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#414042] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] outline-none transition-colors" placeholder="+244 9xx xxx xxx" />
                    {errors.phone && <p className="text-[#ffb4ab] text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block label-caps text-[#d5c4ac] mb-1.5">Senha de Acesso *</label>
                    <input required minLength={6} type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#414042] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] outline-none transition-colors" placeholder="Mínimo 6 caracteres" />
                    {errors.password && <p className="text-[#ffb4ab] text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                    <label className="block label-caps text-[#d5c4ac] mb-1.5">Confirmar Senha *</label>
                    <input required minLength={6} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#414042] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] outline-none transition-colors" placeholder="Confirme a senha" />
                    {errors.confirmPassword && <p className="text-[#ffb4ab] text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div>
                  <label className="block label-caps text-[#d5c4ac] mb-1.5">Vincular a uma Turma (Opcional)</label>
                  <select name="classId" value={formData.classId} onChange={handleChange} className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#414042] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] rounded text-sm text-[#e5e2e1] outline-none transition-colors">
                      <option value="">Nenhuma turma vinculada inicialmente</option>
                      {classes.map(c => (
                          <option key={c.id} value={c.id}>
                              {c.name} - {c.academicLevel === '1-6' ? 'Ensino Primário' : c.academicLevel === '7-9' ? 'Secundário I' : 'Secundário II'} {c.grade ? `(${c.grade})` : ''}
                          </option>
                      ))}
                  </select>
                  {errors.classId && <p className="text-[#ffb4ab] text-xs mt-1">{errors.classId}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-5 mt-2 border-t border-[#414042]">
              <Button type="button" variant="secondary" onClick={() => setIsOpen(false)} className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#201f1f] rounded text-xs font-semibold h-10 px-4">
                Cancelar
              </Button>
              <Button disabled={isLoading} type="submit" className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold rounded shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] transition-all h-10 px-5 text-xs sm:text-sm cursor-pointer">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Gravar Professor"}
              </Button>
            </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
