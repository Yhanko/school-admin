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
import { Plus } from "@/lib/icons";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";

const ROLES = [
  { value: "ADMIN", label: "Diretor / Administrador" },
  { value: "SECRETARY", label: "Secretaria / Tesouraria" },
];

const PERMISSIONS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "students", label: "Gestão de Alunos" },
  { key: "teachers", label: "Gestão de Professores" },
  { key: "classes", label: "Gestão de Turmas" },
  { key: "financial", label: "Relatório Financeiro" },
  { key: "activities", label: "Atividades e Eventos" },
  { key: "payments", label: "Pagamentos" },
  { key: "attendance", label: "Frequência" },
  { key: "discipline", label: "Gestão Disciplinar" },
  { key: "permissions", label: "Gestão de Permissões" },
];

export function AddNewUserPermission({ onCreated }: { onCreated?: () => void }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SECRETARY',
  });

  const [permissions, setPermissions] = useState<Record<string, boolean>>(
    PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.key]: false }), {})
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Create the user
      const userRes = await axiosInstance.post('/users', formData);
      const newUser = userRes.data;

      // 2. Set the permissions
      await axiosInstance.patch(`/permissions/${newUser.id}`, permissions);

      toast({
        title: "Sucesso",
        description: "Utilizador criado e permissões atribuídas com sucesso.",
      });

      setIsOpen(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'SECRETARY',
      });
      setPermissions(PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.key]: false }), {}));

      if (onCreated) {
        onCreated();
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Ocorreu um erro ao criar o utilizador.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2 rounded-full hover:cursor-pointer bg-[#5856eb] text-white hover:text-white hover:bg-[#2d2add]">
            <Plus className="w-4 h-4" />
            Novo usuário
        </Button>
      </SheetTrigger>
      <SheetContent style={{minWidth:600}} className="w-[70rem] overflow-y-auto scrollbar-none p-8">
        <SheetHeader>
          <SheetTitle>Utilizador e Permissões</SheetTitle>
          <SheetDescription>
            Crie um novo utilizador e atribua as suas permissões de acesso
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail 
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@escola.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Função (Role)
                </label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">Permissões de Acesso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PERMISSIONS.map((perm) => (
                <label key={perm.key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissions[perm.key]}
                    onChange={(e) => setPermissions({ ...permissions, [perm.key]: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <SheetFooter className="mt-8">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#5856eb] rounded-full text-white hover:cursor-pointer hover:text-white hover:bg-[#3c3ad6]"
            >
              {isSubmitting ? "A guardar..." : "Salvar utilizador"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
