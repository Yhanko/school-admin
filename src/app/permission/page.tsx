"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Download,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  Users,
  GraduationCap,
} from "@/lib/icons";
import { ShieldCheck, UserCheck, ShieldAlert } from "lucide-react";
import { AddNewUserPermission } from "./_components/add_permission";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/usePermissions";

interface UserPermissionItem {
  id: string;
  name: string;
  email?: string;
  role: string;
  userPermission?: Record<string, boolean>;
}

export default function Permission() {
  const { toast } = useToast();
  const { isDirector } = usePermissions();
  const [users, setUsers] = useState<UserPermissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPermissionDetails, setShowPermissionDetails] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const handleSearch = () => {
    setActiveSearch(searchTerm.toLowerCase());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const fetchPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/permissions");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar permissões",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const permissionLabels: Record<string, string> = {
    dashboard: "Dashboard",
    students: "Gestão de Alunos",
    teachers: "Gestão de Professores",
    classes: "Gestão de Turmas",
    financial: "Relatório Financeiro",
    activities: "Atividades e Eventos",
    payments: "Pagamentos",
    attendance: "Frequência",
    discipline: "Gestão Disciplinar",
    permissions: "Gestão de Permissões",
  };

  const togglePermission = async (
    userId: string,
    permission: string,
    currentValue: boolean
  ) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          userPermission: {
            ...user.userPermission,
            [permission]: !currentValue,
          },
        };
      }
      return user;
    });
    setUsers(updatedUsers);

    try {
      await axiosInstance.patch(`/permissions/${userId}`, {
        [permission]: !currentValue,
      });
      toast({ title: "Sucesso", description: "Permissão atualizada." });
    } catch {
      fetchPermissions();
      toast({
        title: "Erro",
        description: "Falha ao atualizar permissão",
        variant: "destructive",
      });
    }
  };

  const countPermissions = (
    permissions: Record<string, unknown> | null | undefined
  ) => {
    if (!permissions) return 0;
    const ignoredKeys = new Set(["id", "userId", "createdAt", "updatedAt"]);
    return Object.entries(permissions).filter(
      ([key, val]) => !ignoredKeys.has(key) && Boolean(val)
    ).length;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
      case "ADMIN":
        return "bg-red-100 text-red-800 border border-red-300 dark:bg-[#9B2226]/30 dark:text-[#ffb4ab] dark:border-[#9B2226]/60";
      case "TEACHER":
        return "bg-purple-100 text-purple-800 border border-purple-300 dark:bg-[#1c1b1b] dark:text-[#DDD6FE] dark:border-[#DDD6FE]/40";
      case "SECRETARY":
        return "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-[#2D6A4F]/30 dark:text-[#2D6A4F] dark:border-[#2D6A4F]/60";
      case "STUDENT":
        return "bg-slate-100 text-slate-800 border border-slate-300 dark:bg-[#1c1b1b] dark:text-[#C0C2C5] dark:border-[#414042]";
      case "PARENT":
        return "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-[#1c1b1b] dark:text-[#d5c4ac] dark:border-[#414042]";
      default:
        return "bg-slate-100 text-slate-800 border border-slate-300 dark:bg-[#1c1b1b] dark:text-[#e5e2e1] dark:border-[#414042]";
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      SUPER_ADMIN: "Super Admin",
      ADMIN: "Administrador",
      TEACHER: "Professor",
      SECRETARY: "Secretaria",
      STUDENT: "Aluno",
      PARENT: "Encarregado",
      ASSOCIATION_MEMBER: "Associação",
    };
    return labels[role] || role;
  };

  if (!isDirector) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 font-hanken text-center px-4">
        <div className="p-4 bg-red-100 dark:bg-red-950/40 rounded-full text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-xl font-bold text-[#090D16] dark:text-[#e5e2e1]">Acesso Restrito à Direcção Geral</h2>
          <p className="text-xs text-[#556575] dark:text-[#d5c4ac] leading-relaxed">
            Apenas a Direcção Geral e Administradores têm autorização para gerir credenciais, privilégios e permissões de utilizadores.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center w-full min-h-[60vh] space-y-3 font-hanken">
        <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED] dark:text-[#8B5CF6]" />
        <span className="label-caps text-[#556575] dark:text-[#d5c4ac]">Carregando permissões do sistema...</span>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(activeSearch) ||
      user.email?.toLowerCase().includes(activeSearch)
  );

  return (
    <div className="w-full max-w-full space-y-6 font-hanken text-[#090D16] dark:text-[#e5e2e1]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#414042] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
            <h1 className="headline-lg text-[#e5e2e1]">
              Gestão de Permissões
            </h1>
          </div>
          <p className="body-md text-[#d5c4ac] mt-1">
            Controle de perfis, concessão e revogação de acessos modulares
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#1c1b1b] rounded h-10 px-4 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            <Download className="w-4 h-4 mr-1.5 text-[#d5c4ac]" />
            <span>Exportar Relatório</span>
          </Button>
          <AddNewUserPermission onCreated={fetchPermissions} />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#121212] border border-[#414042] rounded-lg p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded bg-[#1c1b1b] border border-[#414042] shrink-0 text-[#8B5CF6]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="label-caps text-[10px] text-[#9d8f78]">Total Utilizadores</p>
            <p className="text-2xl font-bold text-[#e5e2e1] data-mono">{users.length}</p>
          </div>
        </div>

        <div className="bg-[#121212] border border-[#414042] rounded-lg p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded bg-[#1c1b1b] border border-[#414042] shrink-0 text-[#2D6A4F]">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="label-caps text-[10px] text-[#9d8f78]">Contas Ativas</p>
            <p className="text-2xl font-bold text-[#2D6A4F] data-mono">{users.length}</p>
          </div>
        </div>

        <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded bg-red-50 dark:bg-[#1c1b1b] border border-red-200 dark:border-[#414042] shrink-0 text-red-600 dark:text-[#ffb4ab]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="label-caps text-[10px] text-[#556575] dark:text-[#9d8f78]">Administradores</p>
            <p className="text-2xl font-bold text-red-600 dark:text-[#ffb4ab] data-mono">
              {
                users.filter(
                  (u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN"
                ).length
              }
            </p>
          </div>
        </div>

        <div className="bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded bg-purple-50 dark:bg-[#1c1b1b] border border-purple-200 dark:border-[#414042] shrink-0 text-[#7C3AED] dark:text-[#DDD6FE]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="label-caps text-[10px] text-[#556575] dark:text-[#9d8f78]">Professores</p>
            <p className="text-2xl font-bold text-[#7C3AED] dark:text-[#DDD6FE] data-mono">
              {users.filter((u) => u.role === "TEACHER").length}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#556575] dark:text-[#9d8f78]" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou e-mail institucional..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 h-10 bg-[#FAFBFD] dark:bg-[#0D0D0D] border border-[#CBD5E1] dark:border-[#414042] rounded text-sm text-[#090D16] dark:text-[#e5e2e1] placeholder:text-[#718096] dark:placeholder:text-[#9d8f78] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] outline-none transition-colors"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-primary hover:bg-[#A78BFA] text-white font-semibold rounded h-10 px-5 text-xs sm:text-sm shadow-xs cursor-pointer shrink-0 transition-all"
        >
          Pesquisar
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-[#121212] border border-[#414042] rounded-lg overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#414042] flex items-center justify-between">
          <h2 className="headline-sm text-[#e5e2e1]">
            Utilizadores e Permissões Ativas
          </h2>
          <span className="label-caps text-[10px] text-[#DDD6FE] data-mono">
            {filteredUsers.length} REGISTOS
          </span>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#1c1b1b]">
              <tr className="border-b border-[#414042]">
                <th className="text-left py-3 px-4 label-caps text-[#d5c4ac]">
                  Utilizador
                </th>
                <th className="text-left py-3 px-4 label-caps text-[#d5c4ac]">
                  E-mail
                </th>
                <th className="text-left py-3 px-4 label-caps text-[#d5c4ac]">
                  Função
                </th>
                <th className="text-center py-3 px-4 label-caps text-[#d5c4ac]">
                  Módulos
                </th>
                <th className="text-center py-3 px-4 label-caps text-[#d5c4ac]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#414042]/50">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="even:bg-[#FAFBFD] odd:bg-[#EDF0F3] dark:even:bg-[#121212] dark:odd:bg-[#151515] hover:bg-[#DDE2E7] dark:hover:bg-[#1A1A1A] transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-[#e5e2e1] whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-[#d5c4ac] text-xs data-mono max-w-[200px] truncate">
                    {user.email}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold data-mono ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-bold text-[#DDD6FE] data-mono text-xs">
                        {countPermissions(user.userPermission)}/10
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-600 dark:text-[#d5c4ac] hover:text-[#7C3AED] dark:hover:text-[#8B5CF6] hover:bg-slate-200 dark:hover:bg-[#201f1f] rounded cursor-pointer transition-all"
                        onClick={() =>
                          setShowPermissionDetails(
                            showPermissionDetails === user.id ? null : user.id
                          )
                        }
                        title="Ver permissões detalhadas"
                      >
                        {showPermissionDetails === user.id ? (
                          <EyeOff className="w-4 h-4 text-[#7C3AED] dark:text-[#8B5CF6]" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 dark:text-[#ffb4ab] bg-red-50 hover:bg-red-600 hover:text-white dark:bg-[#9B2226]/20 dark:hover:bg-[#DC2626] dark:hover:text-white border border-red-200 dark:border-[#9B2226]/50 rounded cursor-pointer transition-all shadow-2xs mx-auto flex items-center justify-center"
                      title="Excluir Utilizador"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-sm text-[#556575] dark:text-[#9d8f78] italic"
                  >
                    Nenhum utilizador encontrado para a pesquisa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="sm:hidden divide-y divide-[#CBD5E1] dark:divide-[#414042]">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 space-y-2.5 bg-[#FAFBFD] dark:bg-[#121212]">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[#090D16] dark:text-[#e5e2e1] truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-[#556575] dark:text-[#d5c4ac] data-mono truncate">
                    {user.email}
                  </p>
                </div>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold data-mono ${getRoleBadge(
                    user.role
                  )}`}
                >
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#6D28D9] dark:text-[#DDD6FE] font-bold data-mono">
                  {countPermissions(user.userPermission)}/10 permissões
                </span>
                <div className="flex gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-600 dark:text-[#d5c4ac] hover:text-[#7C3AED] dark:hover:text-[#8B5CF6] hover:bg-slate-200 dark:hover:bg-[#201f1f] rounded"
                    onClick={() =>
                      setShowPermissionDetails(
                        showPermissionDetails === user.id ? null : user.id
                      )
                    }
                  >
                    {showPermissionDetails === user.id ? (
                      <EyeOff className="w-4 h-4 text-[#7C3AED] dark:text-[#8B5CF6]" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 dark:text-[#ffb4ab] bg-red-50 hover:bg-red-600 hover:text-white dark:bg-[#9B2226]/20 dark:hover:bg-[#DC2626] dark:hover:text-white border border-red-200 dark:border-[#9B2226]/50 rounded cursor-pointer transition-all shadow-2xs flex items-center justify-center"
                    title="Excluir Utilizador"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <p className="py-10 text-center text-sm text-[#556575] dark:text-[#9d8f78] italic">
              Nenhum utilizador encontrado.
            </p>
          )}
        </div>
      </div>

      {/* Permission Details Panel */}
      {showPermissionDetails !== null && (
        <div className="bg-[#F4F6F8] dark:bg-[#121212] border border-[#7C3AED] dark:border-[#8B5CF6]/60 rounded-lg p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-[#414042] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#7C3AED] dark:text-[#8B5CF6]" />
              <h3 className="headline-sm text-[#090D16] dark:text-[#e5e2e1]">
                Matriz de Permissões —{" "}
                {users.find((u) => u.id === showPermissionDetails)?.name}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPermissionDetails(null)}
              className="text-xs text-[#334155] dark:text-[#d5c4ac] hover:bg-slate-200 dark:hover:bg-[#201f1f] rounded cursor-pointer font-semibold"
            >
              Fechar
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(permissionLabels).map(([key, label]) => {
              const userPerms =
                users.find((u) => u.id === showPermissionDetails)
                  ?.userPermission || {};
              const value = userPerms[key] || false;
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between p-3 border rounded transition-all gap-2 ${
                    value
                      ? "bg-emerald-50/70 border-emerald-300 dark:bg-[#1c1b1b] dark:border-[#2D6A4F]/60"
                      : "bg-[#FAFBFD] border-[#CBD5E1] dark:bg-[#161616] dark:border-[#414042]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {value ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-[#2D6A4F] shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 dark:text-[#ffb4ab] shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-medium text-[#090D16] dark:text-[#e5e2e1] truncate">
                      {label}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      togglePermission(showPermissionDetails, key, value)
                    }
                    className={`shrink-0 text-xs rounded h-7 px-2.5 font-bold cursor-pointer transition-all ${
                      value
                        ? "border-red-500 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white dark:border-[#9B2226] dark:bg-[#9B2226]/20 dark:text-[#ffb4ab] dark:hover:bg-[#DC2626] dark:hover:text-white"
                        : "border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white dark:border-[#2D6A4F] dark:bg-[#2D6A4F]/20 dark:text-[#2D6A4F] dark:hover:bg-[#2D6A4F] dark:hover:text-white"
                    }`}
                  >
                    {value ? "Revogar" : "Conceder"}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Role Templates */}
      <div className="bg-[#F4F6F8] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg p-5 space-y-4 shadow-2xs">
        <div className="border-b border-[#CBD5E1] dark:border-[#414042] pb-3">
          <h2 className="headline-sm text-[#090D16] dark:text-[#e5e2e1]">
            Modelos de Funções do Sistema (Role Presets)
          </h2>
          <p className="body-md text-[#556575] dark:text-[#d5c4ac] text-xs mt-0.5">
            Perfis padronizados de privilégios para acesso operacional e pedagógico
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="border border-red-200 dark:border-[#9B2226]/40 rounded-lg p-4 bg-[#FAFBFD] dark:bg-[#1c1b1b] space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-300 dark:bg-[#9B2226]/30 dark:text-[#ffb4ab] dark:border-[#9B2226]/60 data-mono">
                ADMIN
              </span>
            </div>
            <p className="text-xs text-[#334155] dark:text-[#d5c4ac]">
              Acesso irrestrito a configurações, finanças e auditoria
            </p>
            <div className="space-y-1 text-xs text-[#556575] dark:text-[#9d8f78] pt-2 border-t border-[#CBD5E1] dark:border-[#414042]">
              <p className="text-emerald-700 dark:text-[#2D6A4F] font-medium">✓ Painel de Telemetria e Dashboard</p>
              <p className="text-emerald-700 dark:text-[#2D6A4F] font-medium">✓ Gestão Completa de Utilizadores</p>
              <p className="text-emerald-700 dark:text-[#2D6A4F] font-medium">✓ Relatórios Financeiros e Faturação</p>
              <p className="text-emerald-700 dark:text-[#2D6A4F] font-medium">✓ Matriz de Permissões</p>
            </div>
          </div>

          <div className="border border-purple-200 dark:border-[#DDD6FE]/30 rounded-lg p-4 bg-[#FAFBFD] dark:bg-[#1c1b1b] space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300 dark:bg-[#1c1b1b] dark:text-[#DDD6FE] dark:border-[#DDD6FE]/40 data-mono">
                TEACHER
              </span>
            </div>
            <p className="text-xs text-[#334155] dark:text-[#d5c4ac]">
              Acesso pedagógico, turmas, notas e diários de turma
            </p>
            <div className="space-y-1 text-xs text-[#556575] dark:text-[#9d8f78] pt-2 border-t border-[#CBD5E1] dark:border-[#414042]">
              <p className="text-emerald-700 dark:text-[#2D6A4F] font-medium">✓ Dashboard do Professor</p>
              <p className="text-emerald-700 dark:text-[#2D6A4F] font-medium">✓ Alunos, Pautas e Turmas</p>
              <p className="text-emerald-700 dark:text-[#2D6A4F] font-medium">✓ Lançamento de Frequência</p>
              <p className="text-red-600 dark:text-[#ffb4ab] font-medium">✗ Módulo Financeiro Restrito</p>
            </div>
          </div>

          <div className="border border-emerald-200 dark:border-[#2D6A4F]/40 rounded-lg p-4 bg-[#FAFBFD] dark:bg-[#1c1b1b] space-y-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-[#2D6A4F]/30 dark:text-[#2D6A4F] dark:border-[#2D6A4F]/60 data-mono">
                SECRETARY
              </span>
            </div>
            <p className="text-xs text-[#334155] dark:text-[#d5c4ac]">
              Acesso a matrículas, atendimento e emissão de propinas
            </p>
            <div className="space-y-1 text-xs text-[#556575] dark:text-[#9d8f78] pt-2 border-t border-[#CBD5E1] dark:border-[#414042]">
              <p className="text-emerald-700 dark:text-[#2D6A4F] font-medium">✓ Dashboard da Secretaria</p>
              <p className="text-emerald-700 dark:text-[#2D6A4F] font-medium">✓ Ficha e Matrícula de Alunos</p>
              <p className="text-emerald-700 dark:text-[#2D6A4F] font-medium">✓ Gestão e Recibos de Pagamento</p>
              <p className="text-red-600 dark:text-[#ffb4ab] font-medium">✗ Lançamento Direto de Notas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}