"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Search,
  MoreVertical,
  Loader2
} from "@/lib/icons";
import { useState, useEffect } from "react";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Payments() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [institution, setInstitution] = useState<any>(null);
  const [iban, setIban] = useState("");
  const [isUpdatingIban, setIsUpdatingIban] = useState(false);

  const handleSearch = () => {
    setActiveSearch(searchTerm.toLowerCase());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchInstitution();
  }, []);

  const fetchInstitution = async () => {
    try {
      const response = await axiosInstance.get('/users/me');
      if (response.data?.institution) {
        setInstitution(response.data.institution);
        setIban(response.data.institution.iban || "");
      }
    } catch (error) {
      console.error("Erro ao carregar instituição:", error);
    }
  };

  const handleUpdateIban = async () => {
    setIsUpdatingIban(true);
    try {
      await axiosInstance.patch('/institutions/me', { iban });
      toast({ title: 'Sucesso', description: 'IBAN atualizado com sucesso!' });
    } catch (error) {
      console.error("Erro ao atualizar IBAN:", error);
      toast({ title: 'Erro', description: 'Falha ao atualizar IBAN', variant: 'destructive' });
    } finally {
      setIsUpdatingIban(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axiosInstance.get('/finance/payments');
      setPayments(response.data.data || response.data || []);
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
      toast({ title: 'Erro', description: 'Falha ao carregar pagamentos', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = async (id: string) => {
    try {
      await axiosInstance.patch(`/finance/payments/${id}/confirm`);
      toast({ title: 'Sucesso', description: 'Pagamento confirmado com sucesso!' });
      setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'confirmed', paymentDate: new Date() } : p));
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
      toast({ title: 'Erro', description: 'Falha ao confirmar pagamento', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    // A API usa: 'confirmed', 'pending', 'cancelled'
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType, label: string }> = {
      "confirmed": {
        bg: "bg-green-100 dark:bg-green-900",
        text: "text-green-800 dark:text-green-100",
        icon: CheckCircle,
        label: "Pago",
      },
      "processing": {
        bg: "bg-blue-100 dark:bg-blue-900",
        text: "text-blue-800 dark:text-blue-100",
        icon: Clock,
        label: "Em Validação",
      },
      "pending": {
        bg: "bg-yellow-100 dark:bg-yellow-900",
        text: "text-yellow-800 dark:text-yellow-100",
        icon: Clock,
        label: "Pendente",
      },
      "cancelled": {
        bg: "bg-red-100 dark:bg-red-900",
        text: "text-red-800 dark:text-red-100",
        icon: AlertCircle,
        label: "Cancelado",
      },
    };

    const config = statusConfig[status] || statusConfig["pending"];
    const Icon = config.icon;

    return (
      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} w-fit`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  // Calculate stats dynamically
  const totalAmount = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const paidAmount = payments.filter(p => p.status === 'confirmed').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);
  const cancelledAmount = payments.filter(p => p.status === 'cancelled').reduce((acc, curr) => acc + curr.amount, 0);
  
  const paidRate = totalAmount ? (paidAmount / totalAmount) * 100 : 0;
  const pendingRate = totalAmount ? (pendingAmount / totalAmount) * 100 : 0;
  const cancelledRate = totalAmount ? (cancelledAmount / totalAmount) * 100 : 0;

  const exportToPDF = () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("Relatório Geral de Pagamentos", 14, 22);
      
      // Subtítulo e data
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Data de Emissão: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Yhanko Educa`, 14, 35);
      
      // Resumo Estatístico
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text("Resumo Financeiro", 14, 45);
      
      doc.setFontSize(10);
      doc.text(`Total Esperado: ${totalAmount.toLocaleString()} Kz`, 14, 52);
      doc.text(`Total Recebido (Pago): ${paidAmount.toLocaleString()} Kz`, 14, 58);
      doc.text(`Total Pendente: ${pendingAmount.toLocaleString()} Kz`, 14, 64);
      doc.text(`Total Cancelado/Atrasado: ${cancelledAmount.toLocaleString()} Kz`, 14, 70);
      
      let currentY = 80;

      // Helper para desenhar tabelas
      const drawTable = (title: string, data: any[], startY: number) => {
        doc.setFontSize(12);
        doc.text(title, 14, startY);
        
        const tableData = data.map(payment => [
          payment.student?.name || 'Desconhecido',
          payment.type,
          `${payment.amount.toLocaleString()} Kz`,
          payment.status === 'confirmed' ? 'Pago' : payment.status === 'pending' ? 'Pendente' : 'Cancelado',
          payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "-"
        ]);

        autoTable(doc, {
          startY: startY + 5,
          head: [['Aluno', 'Tipo', 'Valor', 'Status', 'Data Pagamento']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [74, 71, 245] },
        });
        
        return (doc as any).lastAutoTable.finalY + 15;
      };

      const confirmedList = payments.filter(p => p.status === 'confirmed');
      const pendingList = payments.filter(p => p.status === 'pending');
      const cancelledList = payments.filter(p => p.status === 'cancelled');

      if (confirmedList.length > 0) {
        currentY = drawTable("1. Pagamentos Confirmados", confirmedList, currentY);
      }
      if (pendingList.length > 0) {
        currentY = drawTable("2. Pagamentos Pendentes", pendingList, currentY);
      }
      if (cancelledList.length > 0) {
        currentY = drawTable("3. Pagamentos em Atraso / Cancelados", cancelledList, currentY);
      }

      doc.save("Relatorio_Pagamentos.pdf");
      toast({ title: 'Sucesso', description: 'Relatório exportado com sucesso!' });
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast({ title: 'Erro', description: 'Falha ao gerar o relatório PDF', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  const paymentStats = [
    {
      title: "Pagamentos Recebidos",
      value: `${paidAmount.toLocaleString()} Kz`,
      percentage: `${paidRate.toFixed(1)}%`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Pagamentos Pendentes",
      value: `${pendingAmount.toLocaleString()} Kz`,
      percentage: `${pendingRate.toFixed(1)}%`,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
    },
    {
      title: "Pagamentos Cancelados/Atrasados",
      value: `${cancelledAmount.toLocaleString()} Kz`,
      percentage: `${cancelledRate.toFixed(1)}%`,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900",
    },
  ];

  return (
      <section className="space-y-8 w-[70rem] p-4">
        {/* Header & IBAN Config */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Relatório de Pagamentos</h1>
            <p className="text-muted-foreground">Status de pagamentos mensais dos alunos</p>
          </div>
          
          {/* Configuração de IBAN */}
          <Card className="w-[300px]">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Configuração Bancária (IBAN)</CardTitle>
            </CardHeader>
            <CardContent className="py-2 flex gap-2">
              <input
                type="text"
                placeholder="AO06.0000.0000..."
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button 
                onClick={handleUpdateIban} 
                disabled={isUpdatingIban}
                size="sm"
                className="bg-primary text-white hover:bg-primary/90"
              >
                {isUpdatingIban ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paymentStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className={`text-sm font-semibold mt-2 ${stat.color}`}>{stat.percentage}</p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Pagamentos - Geral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Esperado</p>
                <p className="text-2xl font-bold text-foreground">{totalAmount.toLocaleString()} Kz</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Recebido</p>
                <p className="text-2xl font-bold text-green-600">{paidAmount.toLocaleString()} Kz</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Taxa de Recebimento</p>
                <p className="text-2xl font-bold text-blue-600">{paidRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso de Arrecadação</span>
                <span className="font-semibold text-foreground">{paidRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${paidRate}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pesquisar por aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button onClick={handleSearch} className="bg-primary text-white hover:bg-primary/90 rounded-lg">
              Pesquisar
            </Button>
          </div>
          <Button 
            onClick={exportToPDF}
            disabled={isExporting}
            className="gap-2 rounded-full hover:cursor-pointer hover:bg-[#5856eb] hover:text-white bg-[#4a47f5] text-white">
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? "A Exportar..." : "Exportar"}
          </Button>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pagamentos por Aluno</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-gray-200 border-[1px]">
                <thead>
                  <tr className="border-b border-gray-200 border-[1px]">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Aluno</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Tipo</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Valor</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Data Pagamento</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Comprovativo</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.filter(payment => 
                    payment.student?.name?.toLowerCase().includes(activeSearch)
                  ).map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-muted/50 border-gray-200 border-[1px]">
                      <td className="py-3 px-4 font-medium text-foreground">{payment.student?.name || 'Desconhecido'}</td>
                      <td className="py-3 px-4 text-muted-foreground">{payment.type}</td>
                      <td className="py-3 px-4 text-right font-semibold text-foreground">
                        {payment.amount.toLocaleString()} Kz
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-3 px-4">
                        {payment.proofUrl ? (
                          <Button variant="outline" size="sm" onClick={() => window.open(payment.proofUrl, '_blank')}>
                            Ver Anexo
                          </Button>
                        ) : "-"}
                      </td>
                      <td className="py-3 px-4">
                        {(payment.status === 'pending' || payment.status === 'processing') && (
                          <Button 
                            size="sm" 
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleConfirmPayment(payment.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirmar
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-gray-500">
                        Nenhum pagamento encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Late Payments Alert */}
        {cancelledAmount > 0 && (
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Atenção: Pagamentos Atrasados/Cancelados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Existem {payments.filter(p => p.status === 'cancelled').length} pagamentos não recebidos. Recomenda-se entrar em contato com os responsáveis.
              </p>
              <Button variant="outline" className="text-red-600 hover:text-red-600 hover:cursor-pointer border-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-full">
                Enviar Notificações
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
  );
}