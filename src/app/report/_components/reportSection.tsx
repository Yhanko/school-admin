"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, Loader2 } from '@/lib/icons';
import { useState } from 'react';
import axiosInstance from '@/service/api';
import { useToast } from '@/hooks/use-toast';

export function RelatoriosPage() {
  const { toast } = useToast();
  const [loadingReport, setLoadingReport] = useState<string | null>(null);

  const reports = [
    {
      id: 'academic',
      title: 'Relatório Acadêmico',
      description: 'Desempenho acadêmico dos estudantes, notas e frequências',
      date: new Date().toLocaleDateString(),
    },
    {
      id: 'financial',
      title: 'Relatório Financeiro',
      description: 'Receitas, despesas e pagamentos',
      date: new Date().toLocaleDateString(),
    },
    {
      id: 'administrative',
      title: 'Relatório Administrativo',
      description: 'Estrutura de funcionários, professores e turmas',
      date: new Date().toLocaleDateString(),
    },
  ];

  const handleDownload = async (reportId: string) => {
    setLoadingReport(reportId);
    try {
      const response = await axiosInstance.get(`/reports/${reportId}`);
      
      // Converte o objeto de resposta para uma string JSON formatada
      const dataStr = JSON.stringify(response.data, null, 2);
      
      // Cria um Blob com os dados e um objeto URL para ele
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      
      // Cria um elemento âncora temporário para forçar o download
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio_${reportId}_${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Limpeza
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({ title: 'Sucesso', description: 'Relatório gerado com sucesso!' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Falha ao gerar o relatório', variant: 'destructive' });
    } finally {
      setLoadingReport(null);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Relatórios</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-[#5856eb]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-1">{report.title}</CardTitle>
                      <p className="text-sm text-slate-500">{report.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="h-4 w-4" />
                    <span>{report.date}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="gap-2 rounded-full hover:cursor-pointer bg-[#4D44B5] text-white hover:bg-[#3d368a] hover:text-white"
                    onClick={() => handleDownload(report.id)}
                    disabled={loadingReport === report.id}
                  >
                    {loadingReport === report.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Gerar JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tipos de Relatórios Disponíveis (JSON)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-slate-900 mb-2">Acadêmico</h3>
                <p className="text-sm text-slate-500">
                  Notas médias da instituição, taxa de frequência e alunos por turma.
                </p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-slate-900 mb-2">Financeiro</h3>
                <p className="text-sm text-slate-500">
                  Receitas totais, status de pagamentos pendentes, confirmados e cancelados.
                </p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-slate-900 mb-2">Administrativo</h3>
                <p className="text-sm text-slate-500">
                  Métricas de recursos humanos, como número de professores, administradores e espaços físicos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
