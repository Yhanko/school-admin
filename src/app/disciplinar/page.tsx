"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, Search, Loader2 } from "@/lib/icons";
import { NewOccurrence } from "./_components/new-ocorrencia";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";

interface DisciplinaryRecord {
  id: string;
  studentId: string;
  type: string;
  severity: string;
  status: string;
  description: string;
  date: string;
  student?: {
    id: string;
    name: string;
  }
}

export default function Deicipline() {
  const [incidents, setIncidents] = useState<DisciplinaryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const { toast } = useToast();

  const handleSearch = () => {
    setActiveSearch(searchTerm.toLowerCase());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const fetchIncidents = async () => {
    try {
      const response = await axiosInstance.get('/disciplinary');
      setIncidents(response.data);
    } catch (error) {
      console.error("Failed to fetch incidents", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchIncidents(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja apagar esta ocorrência?')) return;
    try {
      await axiosInstance.delete(`/disciplinary/${id}`);
      toast({ title: 'Sucesso', description: 'Ocorrência apagada com sucesso.' });
      fetchIncidents();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: 'Erro', description: err.response?.data?.message || 'Falha ao apagar ocorrência.', variant: 'destructive' });
    }
  };

  const handleNotify = async (id: string) => {
    try {
      const response = await axiosInstance.post(`/disciplinary/${id}/notify`);
      toast({ title: 'Sucesso', description: response.data?.message || 'Notificação enviada com sucesso.' });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: 'Erro', description: err.response?.data?.message || 'Falha ao notificar encarregado.', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    const nextStatusMap: Record<string, string> = {
      'PENDING': 'IN_PROGRESS',
      'IN_PROGRESS': 'RESOLVED',
      'RESOLVED': 'PENDING'
    };
    const newStatus = nextStatusMap[currentStatus] || 'PENDING';
    try {
      await axiosInstance.patch(`/disciplinary/${id}/status`, { status: newStatus });
      toast({ title: 'Sucesso', description: 'Status atualizado com sucesso.' });
      fetchIncidents();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: 'Erro', description: err.response?.data?.message || 'Falha ao atualizar status.', variant: 'destructive' });
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      "LOW": "bg-blue-100 text-blue-700",
      "MEDIUM": "bg-yellow-100 text-yellow-700",
      "HIGH": "bg-red-100 text-red-700",
    };
    return colors[severity] || colors["MEDIUM"];
  };

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, string> = { "LOW": "Baixo", "MEDIUM": "Médio", "HIGH": "Alto" };
    return labels[severity] || severity;
  };

  const getStatusColor = (status: string) => {
    if (status === 'RESOLVED') return "bg-green-100 text-green-700";
    if (status === 'IN_PROGRESS') return "bg-blue-100 text-blue-700";
    return "bg-orange-100 text-orange-700";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      "PENDING": "Pendente",
      "IN_PROGRESS": "Em andamento",
      "RESOLVED": "Resolvido",
    };
    return labels[status] || status;
  };

  const filteredIncidents = incidents.filter(inc => {
    const studentName = inc.student?.name || inc.studentId;
    return (
      studentName.toLowerCase().includes(activeSearch) ||
      inc.type.toLowerCase().includes(activeSearch) ||
      getStatusLabel(inc.status).toLowerCase().includes(activeSearch) ||
      getSeverityLabel(inc.severity).toLowerCase().includes(activeSearch)
    );
  });

  return (
    <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
      <Card className="border border-gray-100 shadow-sm rounded-2xl">
        <CardHeader className="px-4 sm:px-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">Histório de Ocorrências</CardTitle>
            <NewOccurrence onCreated={fetchIncidents} />
          </div>
        </CardHeader>

        {/* Search bar */}
        <div className="px-4 sm:px-6 pb-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome, tipo, status..."
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

        <CardContent className="px-0 pb-0">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Aluno</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Descrição</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Severidade</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
                    </td>
                  </tr>
                ) : filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-gray-400">
                      Nenhuma ocorrência encontrada.
                    </td>
                  </tr>
                ) : filteredIncidents.map((incident) => {
                  const studentName = incident.student?.name || incident.studentId;
                  return (
                    <tr key={incident.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{studentName}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{incident.type}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs max-w-[200px] truncate" title={incident.description}>{incident.description}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm whitespace-nowrap">
                        {new Date(incident.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                          {getSeverityLabel(incident.severity)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          onClick={() => handleStatusChange(incident.id, incident.status)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(incident.status)}`}
                          title="Clique para avançar o estado"
                        >
                          {getStatusLabel(incident.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 justify-center">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(incident.id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50" title="Apagar">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleNotify(incident.id)} className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50" title="Notificar por Email">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden divide-y divide-gray-100">
            {isLoading ? (
              <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
            ) : filteredIncidents.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-400">Nenhuma ocorrência encontrada.</p>
            ) : filteredIncidents.map((incident) => {
              const studentName = incident.student?.name || incident.studentId;
              return (
                <div key={incident.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-gray-900">{studentName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{incident.type}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                        {getSeverityLabel(incident.severity)}
                      </span>
                      <span
                        onClick={() => handleStatusChange(incident.id, incident.status)}
                        className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer ${getStatusColor(incident.status)}`}
                      >
                        {getStatusLabel(incident.status)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{incident.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{new Date(incident.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(incident.id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleNotify(incident.id)} className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}