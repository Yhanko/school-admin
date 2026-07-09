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
    if (e.key === "Enter") {
      handleSearch();
    }
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

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleDelete = async (id: string) => {
      if (!confirm('Tem a certeza que deseja apagar esta ocorrência?')) return;
      try {
          await axiosInstance.delete(`/disciplinary/${id}`);
          toast({ title: 'Sucesso', description: 'Ocorrência apagada com sucesso.' });
          fetchIncidents();
      } catch (error: any) {
          toast({ title: 'Erro', description: error.response?.data?.message || 'Falha ao apagar ocorrência.', variant: 'destructive' });
      }
  };

  const handleNotify = async (id: string) => {
      try {
          const response = await axiosInstance.post(`/disciplinary/${id}/notify`);
          toast({ title: 'Sucesso', description: response.data?.message || 'Notificação enviada com sucesso.' });
      } catch (error: any) {
          toast({ title: 'Erro', description: error.response?.data?.message || 'Falha ao notificar encarregado.', variant: 'destructive' });
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
      } catch (error: any) {
          toast({ title: 'Erro', description: error.response?.data?.message || 'Falha ao atualizar status.', variant: 'destructive' });
      }
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      "LOW": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      "MEDIUM": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      "HIGH": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    };
    return colors[severity] || colors["MEDIUM"];
  };

  const getSeverityLabel = (severity: string) => {
      const labels: Record<string, string> = {
          "LOW": "Baixo",
          "MEDIUM": "Médio",
          "HIGH": "Alto",
      };
      return labels[severity] || severity;
  };

  const getStatusColor = (status: string) => {
    if (status === 'RESOLVED') return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    if (status === 'IN_PROGRESS') return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100";
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
      return studentName.toLowerCase().includes(activeSearch) || 
             inc.type.toLowerCase().includes(activeSearch) || 
             getStatusLabel(inc.status).toLowerCase().includes(activeSearch) ||
             getSeverityLabel(inc.severity).toLowerCase().includes(activeSearch);
  });

  return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Ocorrências</CardTitle>
          </CardHeader>
          <div className="flex gap-4 flex-col sm:flex-row p-6">
            <div className="relative flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Pesquisar ocorrencia por nome, status, severidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-lg pl-10 pr-4 py-2 bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button onClick={handleSearch} className="bg-primary text-white hover:bg-primary/90 rounded-lg">
                Pesquisar
              </Button>
            </div>
            <NewOccurrence onCreated={fetchIncidents} />
          </div>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-gray-200 border-[1px]">
                <thead className="border-[1px] border-gray-200 bg-gray-50">
                  <tr className="border-b border-gray-200 border-[1px]">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Aluno</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Tipo</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Descrição</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Data</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Severidade</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody className="border-[1px] border-gray-200">
                  {isLoading ? (
                      <tr>
                          <td colSpan={7} className="py-8 text-center">
                              <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                          </td>
                      </tr>
                  ) : filteredIncidents.length === 0 ? (
                      <tr>
                          <td colSpan={7} className="py-8 text-center text-muted-foreground">
                              Nenhuma ocorrência encontrada.
                          </td>
                      </tr>
                  ) : filteredIncidents.map((incident) => {
                    const studentName = incident.student?.name || incident.studentId;

                    return (
                    <tr key={incident.id} className="border-gray-200 border-[1px] hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium text-foreground">{studentName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{incident.type}</td>
                      <td className="py-3 px-4 text-muted-foreground text-xs max-w-xs truncate" title={incident.description}>{incident.description}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                          {new Date(incident.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                          {getSeverityLabel(incident.severity)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span 
                            onClick={() => handleStatusChange(incident.id, incident.status)}
                            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(incident.status)}`}
                            title="Clique para avançar o estado"
                        >
                          {getStatusLabel(incident.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center flex">
                        <div className="flex gap-2 justify-center w-full">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(incident.id)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" title="Apagar">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleNotify(incident.id)} className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:cursor-pointer" title="Enviar Notificação por Email">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}