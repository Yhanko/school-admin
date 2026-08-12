"use client"
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ShieldCheck, UserCheck } from "lucide-react";
import { AddNewUserPermission } from "./_components/add_permission";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";

interface UserPermissionItem {
  id: string;
  name: string;
  email?: string;
  role: string;
  userPermission?: Record<string, boolean>;
}

export default function Permission(){
  const { toast } = useToast();
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
      const response = await axiosInstance.get('/permissions');
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar permissões:", error);
      toast({ title: 'Erro', description: 'Falha ao carregar permissões', variant: 'destructive' });
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

  const togglePermission = async (userId: string, permission: string, currentValue: boolean) => {
    const updatedUsers = users.map(user => {
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
        [permission]: !currentValue
      });
      toast({ title: 'Sucesso', description: 'Permissão atualizada.' });
    } catch {
      fetchPermissions();
      toast({ title: 'Erro', description: 'Falha ao atualizar permissão', variant: 'destructive' });
    }
  };

  const countPermissions = (permissions: Record<string, unknown> | null | undefined) => {
    if (!permissions) return 0;
    const ignoredKeys = new Set(['id', 'userId', 'createdAt', 'updatedAt']);
    return Object.entries(permissions).filter(([key, val]) => !ignoredKeys.has(key) && Boolean(val)).length;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      "SUPER_ADMIN": "bg-red-100 text-red-700",
      "ADMIN": "bg-red-100 text-red-700",
      "TEACHER": "bg-blue-100 text-blue-700",
      "SECRETARY": "bg-green-100 text-green-700",
      "STUDENT": "bg-yellow-100 text-yellow-700",
      "PARENT": "bg-orange-100 text-orange-700",
      "ASSOCIATION_MEMBER": "bg-purple-100 text-purple-700",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      "SUPER_ADMIN": "Super Admin",
      "ADMIN": "Administrador",
      "TEACHER": "Professor",
      "SECRETARY": "Secretaria",
      "STUDENT": "Aluno",
      "PARENT": "Encarregado",
      "ASSOCIATION_MEMBER": "Associação",
    };
    return labels[role] || role;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(activeSearch) ||
    user.email?.toLowerCase().includes(activeSearch)
  );

  return(
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-7 overflow-x-hidden">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Gestão de Permissões</h1>
          <p className="text-sm text-gray-500 mt-0.5">Controle de acesso e permissões de utilizadores</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 rounded-xl cursor-pointer border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs sm:text-sm">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </Button>
          <AddNewUserPermission />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 shrink-0">
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-2xl font-bold text-indigo-600">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-100 shrink-0">
                <UserCheck className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Ativos</p>
                <p className="text-2xl font-bold text-green-600">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-100 shrink-0">
                <ShieldCheck className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Admins</p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter(u => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-sm rounded-2xl">
          <CardContent className="p-3 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 shrink-0">
                <GraduationCap className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Professores</p>
                <p className="text-2xl font-bold text-blue-600">
                  {users.filter(u => u.role === "TEACHER").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <Button onClick={handleSearch} size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl px-4 text-sm shrink-0">
          Pesquisar
        </Button>
      </div>

      {/* Users Table — desktop */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardHeader className="pb-2 px-4 sm:px-6">
          <CardTitle className="text-sm sm:text-base font-semibold text-gray-800">Utilizadores e Permissões</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Utilizador</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Função</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Permissões</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 text-xs uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{user.name}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs max-w-[180px] truncate">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">
                          {countPermissions(user.userPermission)}/10
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600"
                          onClick={() =>
                            setShowPermissionDetails(
                              showPermissionDetails === user.id ? null : user.id
                            )
                          }
                        >
                          {showPermissionDetails === user.id ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-sm text-gray-400">
                      Nenhum utilizador encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">
                    {countPermissions(user.userPermission)}/10 permissões
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600"
                      onClick={() =>
                        setShowPermissionDetails(
                          showPermissionDetails === user.id ? null : user.id
                        )
                      }
                    >
                      {showPermissionDetails === user.id ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <p className="py-10 text-center text-sm text-gray-400">Nenhum utilizador encontrado.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Permission Details */}
      {showPermissionDetails !== null && (
        <Card className="border border-indigo-100 shadow-sm rounded-2xl">
          <CardHeader className="px-4 sm:px-6 pb-2">
            <CardTitle className="text-sm sm:text-base font-semibold text-indigo-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Detalhes — {users.find(u => u.id === showPermissionDetails)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(permissionLabels).map(([key, label]) => {
                const userPerms = users.find(u => u.id === showPermissionDetails)?.userPermission || {};
                const value = userPerms[key] || false;
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {value ? (
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      <span className="text-xs sm:text-sm font-medium text-gray-800 truncate">{label}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePermission(showPermissionDetails, key, value)}
                      className={`shrink-0 text-xs rounded-lg h-7 px-2 ${value ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                    >
                      {value ? "Revogar" : "Conceder"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role Templates */}
      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardHeader className="px-4 sm:px-6 pb-2">
          <CardTitle className="text-sm sm:text-base font-semibold text-gray-800">Modelos de Função (Roles)</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="border border-gray-100 rounded-xl p-4 bg-red-50/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">ADMIN</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Acesso a gestão e relatórios</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>✓ Dashboard</p>
                <p>✓ Gestão Completa</p>
                <p>✓ Relatórios</p>
                <p>✓ Permissões</p>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 bg-blue-50/40">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">TEACHER</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Acesso limitado a turmas e frequência</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>✓ Dashboard</p>
                <p>✓ Alunos e Turmas</p>
                <p>✓ Frequência</p>
                <p className="text-gray-400">✗ Financeiro</p>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 bg-green-50/40 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">SECRETARY</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Acesso a gestão e pagamentos</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p>✓ Dashboard</p>
                <p>✓ Gestão de Alunos</p>
                <p>✓ Pagamentos</p>
                <p className="text-gray-400">✗ Frequência</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}