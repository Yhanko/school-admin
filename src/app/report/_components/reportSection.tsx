"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, Loader2 } from '@/lib/icons';
import { useState } from 'react';
import axiosInstance from '@/service/api';
import { useToast } from '@/hooks/use-toast';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function RelatoriosPage() {
  const { toast } = useToast();
  const [loadingReport, setLoadingReport] = useState<string | null>(null);

  const reports = [
    {
      id: 'academic',
      title: 'Relatório Acadêmico',
      description: 'Desempenho acadêmico dos alunos, notas e frequências',
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
      const data = response.data;
      
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      
      let title = "";
      if (reportId === "academic") title = "Relatório Acadêmico";
      else if (reportId === "financial") title = "Relatório Financeiro";
      else if (reportId === "administrative") title = "Relatório Administrativo";
      
      doc.text(title, 14, 22);
      
      // Subtítulo e data
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Data de Emissão: ${new Date().toLocaleDateString()}`, 14, 30);
      
      doc.setFontSize(12);
      doc.setTextColor(60, 60, 60);

      let currentY = 40;

      if (reportId === "academic") {
        doc.text("Resumo Geral", 14, currentY);
        currentY += 8;
        doc.setFontSize(10);
        doc.text(`Total de Alunos: ${data.overview.totalStudents}`, 14, currentY);
        currentY += 6;
        doc.text(`Média Geral de Notas: ${data.overview.averageGrade}`, 14, currentY);
        currentY += 6;
        doc.text(`Taxa de Frequência: ${data.overview.attendanceRate}%`, 14, currentY);
        currentY += 14;

        if (data.classes && data.classes.length > 0) {
          doc.setFontSize(12);
          doc.text("Turmas", 14, currentY);
          
          autoTable(doc, {
            startY: currentY + 4,
            head: [['ID da Turma', 'Nome', 'Quantidade de Alunos']],
            body: data.classes.map((c: { classId: string; className: string; studentsCount: number }) => [
              c.classId,
              c.className,
              c.studentsCount
            ]),
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: { fillColor: [77, 68, 181] },
            alternateRowStyles: { fillColor: [245, 247, 250] },
          });
        }
      } 
      else if (reportId === "financial") {
        doc.text("Resumo Geral", 14, currentY);
        currentY += 8;
        doc.setFontSize(10);
        doc.text(`Total Esperado: ${data.overview.totalExpected} Kz`, 14, currentY);
        currentY += 6;
        doc.text(`Total Arrecadado: ${data.overview.totalCollected} Kz`, 14, currentY);
        currentY += 6;
        doc.text(`Total Pendente: ${data.overview.totalPending} Kz`, 14, currentY);
        currentY += 6;
        doc.text(`Total Atrasado: ${data.overview.totalOverdue} Kz`, 14, currentY);
        currentY += 6;
        doc.text(`Taxa de Inadimplência: ${data.overview.defaultRate}%`, 14, currentY);
        currentY += 6;
        doc.text(`Taxa de Arrecadação: ${data.overview.collectionRate}%`, 14, currentY);
        currentY += 14;

        if (data.recentTransactions && data.recentTransactions.length > 0) {
          doc.setFontSize(12);
          doc.text("Transações Recentes", 14, currentY);
          
          autoTable(doc, {
            startY: currentY + 4,
            head: [['Aluno', 'Tipo', 'Valor (Kz)', 'Status', 'Data']],
            body: data.recentTransactions.map((t: { studentName: string; type: string; amount: number; status: string; date: string }) => [
              t.studentName,
              t.type,
              t.amount,
              t.status,
              new Date(t.date).toLocaleDateString()
            ]),
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: { fillColor: [77, 68, 181] },
            alternateRowStyles: { fillColor: [245, 247, 250] },
          });
        }
      }
      else if (reportId === "administrative") {
        doc.text("Resumo da Infraestrutura e Recursos Humanos", 14, currentY);
        currentY += 8;
        doc.setFontSize(10);
        doc.text(`Professores Ativos: ${data.overview.totalTeachers}`, 14, currentY);
        currentY += 6;
        doc.text(`Total de Turmas: ${data.overview.totalClasses}`, 14, currentY);
        currentY += 6;
        doc.text(`Total de Salas: ${data.overview.totalRooms}`, 14, currentY);
        currentY += 6;
        doc.text(`Disciplinas Cadastradas: ${data.overview.totalSubjects}`, 14, currentY);
        currentY += 6;
        doc.text(`Horários Ativos: ${data.overview.activeSchedules}`, 14, currentY);
      }

      doc.save(`relatorio_${reportId}_${new Date().getTime()}.pdf`);
      toast({ title: 'Sucesso', description: 'Relatório gerado em PDF com sucesso!' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Erro', description: 'Falha ao gerar o relatório em PDF', variant: 'destructive' });
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
            <Card key={report.id} className="hover:shadow-md transition-shadow rounded border border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-1">{report.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{report.date}</span>
                  </div>
                  <Button 
                    size="sm" 
                    className="gap-2 rounded hover:cursor-pointer bg-primary text-white hover:bg-[#A78BFA] transition-all font-semibold"
                    onClick={() => handleDownload(report.id)}
                    disabled={loadingReport === report.id}
                  >
                    {loadingReport === report.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Gerar PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 rounded border border-border">
          <CardHeader>
            <CardTitle>Tipos de Relatórios Disponíveis (PDF)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded hover:bg-muted/50 cursor-pointer transition-colors">
                <h3 className="font-medium text-foreground mb-2">Acadêmico</h3>
                <p className="text-sm text-muted-foreground">
                  Notas médias da instituição, taxa de frequência e alunos por turma.
                </p>
              </div>
              <div className="p-4 border rounded hover:bg-muted/50 cursor-pointer transition-colors">
                <h3 className="font-medium text-foreground mb-2">Financeiro</h3>
                <p className="text-sm text-muted-foreground">
                  Receitas totais, status de pagamentos pendentes, confirmados e cancelados.
                </p>
              </div>
              <div className="p-4 border rounded hover:bg-muted/50 cursor-pointer transition-colors">
                <h3 className="font-medium text-foreground mb-2">Administrativo</h3>
                <p className="text-sm text-muted-foreground">
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
