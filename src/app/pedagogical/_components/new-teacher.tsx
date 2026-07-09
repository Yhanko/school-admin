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

export function NewTeacher() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  
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
      
      if (formData.password !== formData.confirmPassword) {
          toast({ title: 'Erro', description: 'As senhas não coincidem.', variant: 'destructive' });
          return;
      }

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
      } catch (error: any) {
          toast({ title: 'Erro', description: error.response?.data?.message || 'Falha ao criar professor', variant: 'destructive' });
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline" 
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-6 h-10 font-medium cursor-pointer w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Professor
        </Button>
      </SheetTrigger>
      <SheetContent style={{minWidth:600}} className="w-[40rem] overflow-y-auto scrollbar-none p-8">
        <SheetHeader>
          <SheetTitle>Adicionar Novo Professor</SheetTitle>
          <SheetDescription>
            Registe um novo professor na área pedagógica.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
            <div className="bg-indigo-600 text-white p-3 rounded-md">
              <h2 className="text-sm font-semibold">Dados Pessoais e Acesso</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Primeiro Nome *</label>
                    <input required type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Nome" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Último Nome *</label>
                    <input required type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Sobrenome" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="exemplo@email.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Telemóvel *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="(xxx) xxx-xxxx" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Senha de Acesso *</label>
                    <input required minLength={6} type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Mínimo 6 caracteres" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Confirmar Senha *</label>
                    <input required minLength={6} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Confirme a senha" />
                </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Vincular a uma Turma (Opcional)</label>
                  <select name="classId" value={formData.classId} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="">Nenhuma</option>
                      {classes.map(c => (
                          <option key={c.id} value={c.id}>
                              {c.name} - {c.academicLevel === '1-6' ? 'Ensino Primário' : c.academicLevel === '7-9' ? 'Secundário I' : 'Secundário II'} {c.grade ? `(${c.grade})` : ''}
                          </option>
                      ))}
                  </select>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button disabled={isLoading} type="submit" className="bg-[#5856eb] text-white hover:bg-[#423ff3]">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Gravar Professor"}
              </Button>
            </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
