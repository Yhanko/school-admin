"use client"
import { useState, useEffect } from "react";
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
} from "@/lib/icons";
import { AddNewUserPermission } from "./_components/add_permission";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

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
      // A API retorna a lista de usuários junto com 'userPermission' dentro de cada usuário
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
    // Atualizar no estado local primeiro para resposta rápida
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
      // Reverter em caso de erro
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
      "SUPER_ADMIN": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      "ADMIN": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      "TEACHER": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      "SECRETARY": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      "STUDENT": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      "PARENT": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
      "ASSOCIATION_MEMBER": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    };
    return colors[role] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return(
    <div className="space-y-8 p-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Permissões</h1>
            <p className="text-muted-foreground">Controle de acesso e permissões de usuários</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 rounded-full hover:cursor-pointer bg-[#5856eb] text-white hover:text-white hover:bg-[#2d2add]">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            < AddNewUserPermission/>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Total de Usuários</p>
                <p className="text-4xl font-bold text-primary">{users.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Usuários Ativos</p>
                <p className="text-4xl font-bold text-green-600">
                  {users.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Administradores</p>
                <p className="text-4xl font-bold text-red-600">
                  {users.filter(u => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Professores</p>
                <p className="text-4xl font-bold text-blue-600">
                  {users.filter(u => u.role === "TEACHER").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="relative flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pesquisar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button onClick={handleSearch} className="bg-primary text-white hover:bg-primary/90">
              Pesquisar
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários e Permissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl border-[1px] border-gray-300">
                <thead>
                  <tr className="border-[1px] rounded-2xl border-gray-300">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Usuário</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Função</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Permissões</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user => 
                    user.name?.toLowerCase().includes(activeSearch) || 
                    user.email?.toLowerCase().includes(activeSearch)
                  ).map((user) => (
                    <tr key={user.id} className="border-[1px] border-gray-200 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium text-foreground">{user.name}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-semibold text-foreground">
                            {countPermissions(user.userPermission)}/10
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
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
                        <div className="flex gap-2 justify-center">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Permission Details */}
        {showPermissionDetails !== null && (
          <Card>
            <CardHeader>
              <CardTitle>
                Detalhes de Permissões - {users.find(u => u.id === showPermissionDetails)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(permissionLabels).map(([key, label]) => {
                  const userPerms = users.find(u => u.id === showPermissionDetails)?.userPermission || {};
                  const value = userPerms[key] || false;
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {value ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-medium text-foreground">
                          {label}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePermission(showPermissionDetails, key, value)}
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
        <Card>
          <CardHeader>
            <CardTitle>Modelos de Função (Roles)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">ADMIN</h3>
                <p className="text-sm text-muted-foreground mb-3">Acesso a gestão e relatórios</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>✓ Dashboard</p>
                  <p>✓ Gestão Completa</p>
                  <p>✓ Relatórios</p>
                  <p>✓ Permissões</p>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">TEACHER</h3>
                <p className="text-sm text-muted-foreground mb-3">Acesso limitado a turmas e frequência</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>✓ Dashboard</p>
                  <p>✓ Alunos e Turmas</p>
                  <p>✓ Frequência</p>
                  <p>✗ Financeiro</p>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">SECRETARY</h3>
                <p className="text-sm text-muted-foreground mb-3">Acesso a gestão e pagamentos</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>✓ Dashboard</p>
                  <p>✓ Gestão de Alunos</p>
                  <p>✓ Pagamentos</p>
                  <p>✗ Frequência</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}