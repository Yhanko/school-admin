"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, ShieldCheck, Loader2 } from "@/lib/icons";
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

const permissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome é obrigatório")
    .max(255, "Nome muito longo")
    .regex(/^[^<>';=]*$/, "Caracteres inválidos (Não use < > ' ; =)"),
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .min(1, "O e-mail é obrigatório")
    .max(255, "E-mail muito longo")
    .regex(/^[^<>';=]*$/, "Caracteres inválidos"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .max(255, "Senha muito longa"),
  role: z.string().min(1, "A função é obrigatória"),
});

export function AddNewUserPermission({ onCreated }: { onCreated?: () => void }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "SECRETARY",
  });

  useEffect(() => {
    if (isOpen && !formData.password) {
      handleGeneratePassword();
    }
  }, [isOpen]);

  const [permissions, setPermissions] = useState<Record<string, boolean>>(
    PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.key]: false }), {})
  );

  const handleGeneratePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < 8; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    
    setFormData(prev => ({ ...prev, password: pwd }));
    toast({ title: 'Senha Gerada', description: 'A senha foi gerada e copiada.' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      permissionSchema.parse(formData);
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create the user
      const userRes = await axiosInstance.post("/users", formData);
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
        name: "",
        email: "",
        password: "",
        role: "SECRETARY",
      });
      setPermissions(
        PERMISSIONS.reduce((acc, p) => ({ ...acc, [p.key]: false }), {})
      );

      if (onCreated) {
        onCreated();
      }
    } catch (error) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Erro",
        description:
          err.response?.data?.message || "Ocorreu um erro ao criar o utilizador.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold rounded h-10 px-4 text-xs sm:text-sm shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] cursor-pointer transition-all flex items-center gap-1.5 font-hanken">
          <Plus className="w-4 h-4" />
          <span>Novo Utilizador</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-4 sm:p-6 bg-[#1A1A1A] border-l border-[#C0C2C5] text-[#e5e2e1] font-hanken">
        <SheetHeader className="border-b border-[#414042] pb-4">
          <SheetTitle className="headline-sm text-[#e5e2e1] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#8B5CF6]" />
            Utilizador e Permissões
          </SheetTitle>
          <SheetDescription className="body-md text-[#d5c4ac]">
            Crie um novo utilizador no sistema e configure o nível de acesso
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="label-caps text-[#d5c4ac] block mb-1.5">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                className={`w-full px-3 py-2 bg-[#0D0D0D] border rounded text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:outline-none placeholder:text-[#9d8f78] ${
                  errors.name
                    ? "border-[#ffb4ab] bg-[#9B2226]/10 text-[#ffb4ab]"
                    : "border-[#414042]"
                }`}
                placeholder="Ex: Manuel Silva"
              />
              {errors.name && (
                <p className="text-[#ffb4ab] text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="label-caps text-[#d5c4ac] block mb-1.5">
                E-mail Institucional *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={`w-full px-3 py-2 bg-[#0D0D0D] border rounded text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:outline-none placeholder:text-[#9d8f78] ${
                  errors.email
                    ? "border-[#ffb4ab] bg-[#9B2226]/10 text-[#ffb4ab]"
                    : "border-[#414042]"
                }`}
                placeholder="email@escola.com"
              />
              {errors.email && (
                <p className="text-[#ffb4ab] text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label-caps text-[#d5c4ac]">
                  Senha de Acesso *
                </label>
                <button type="button" onClick={handleGeneratePassword} className="text-[10px] text-[#8B5CF6] hover:underline font-bold uppercase">Gerar Senha</button>
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
                className={`w-full px-3 py-2 bg-[#0D0D0D] border rounded text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:outline-none placeholder:text-[#9d8f78] ${
                  errors.password
                    ? "border-[#ffb4ab] bg-[#9B2226]/10 text-[#ffb4ab]"
                    : "border-[#414042]"
                }`}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && (
                <p className="text-[#ffb4ab] text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="label-caps text-[#d5c4ac] block mb-1.5">
                Função do Sistema *
              </label>
              <select
                value={formData.role}
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value });
                  if (errors.role) setErrors((prev) => ({ ...prev, role: "" }));
                }}
                className={`w-full px-3 py-2 bg-[#0D0D0D] border rounded text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:outline-none ${
                  errors.role
                    ? "border-[#ffb4ab] bg-[#9B2226]/10 text-[#ffb4ab]"
                    : "border-[#414042]"
                }`}
              >
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value} className="bg-[#1A1A1A] text-[#e5e2e1]">
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-[#ffb4ab] text-xs mt-1">{errors.role}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="label-caps text-[#DDD6FE] mb-3">
              Permissões Modulares de Acesso
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PERMISSIONS.map((perm) => (
                <label
                  key={perm.key}
                  className={`flex items-center space-x-3 p-3 border rounded transition-all cursor-pointer ${
                    permissions[perm.key]
                      ? "bg-[#201f1f] border-[#8B5CF6]/60 text-[#DDD6FE]"
                      : "bg-[#121212] border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions[perm.key]}
                    onChange={(e) =>
                      setPermissions({
                        ...permissions,
                        [perm.key]: e.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-[#8B5CF6] bg-[#0D0D0D] border-[#414042] rounded"
                  />
                  <span className="text-xs font-semibold">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <SheetFooter className="mt-6 pt-4 border-t border-[#414042] flex justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
              className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#201f1f] rounded text-xs font-semibold h-10 px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold rounded h-10 px-5 text-xs sm:text-sm shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A guardar...</span>
                </>
              ) : (
                "Guardar Utilizador"
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
