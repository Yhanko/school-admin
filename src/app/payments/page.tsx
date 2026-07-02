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
} from "@/lib/icons";

export default function Payments() {
  const paymentStats = [
    {
      title: "Pagamentos Recebidos",
      value: "R$ 45,230",
      percentage: "87.5%",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Pagamentos Pendentes",
      value: "R$ 6,470",
      percentage: "12.5%",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900",
    },
    {
      title: "Pagamentos Atrasados",
      value: "R$ 2,100",
      percentage: "4.1%",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900",
    },
  ];

  const studentPayments = [
    {
      id: 1,
      studentName: "João Silva",
      grade: "3A",
      dueDate: "2024-06-10",
      amount: 1500,
      status: "Pago",
      paymentDate: "2024-06-08",
    },
    {
      id: 2,
      studentName: "Maria Santos",
      grade: "2B",
      dueDate: "2024-06-10",
      amount: 1500,
      status: "Pago",
      paymentDate: "2024-06-09",
    },
    {
      id: 3,
      studentName: "Pedro Costa",
      grade: "4C",
      dueDate: "2024-06-10",
      amount: 1500,
      status: "Pendente",
      paymentDate: null,
    },
    {
      id: 4,
      studentName: "Ana Oliveira",
      grade: "1A",
      dueDate: "2024-06-10",
      amount: 1500,
      status: "Pago",
      paymentDate: "2024-06-10",
    },
    {
      id: 5,
      studentName: "Carlos Ferreira",
      grade: "3B",
      dueDate: "2024-06-10",
      amount: 1500,
      status: "Atrasado",
      paymentDate: null,
    },
    {
      id: 6,
      studentName: "Beatriz Lima",
      grade: "2A",
      dueDate: "2024-06-10",
      amount: 1500,
      status: "Pago",
      paymentDate: "2024-06-07",
    },
    {
      id: 7,
      studentName: "Diego Martins",
      grade: "4A",
      dueDate: "2024-06-10",
      amount: 1500,
      status: "Pendente",
      paymentDate: null,
    },
    {
      id: 8,
      studentName: "Fernanda Gomes",
      grade: "1B",
      dueDate: "2024-06-10",
      amount: 1500,
      status: "Atrasado",
      paymentDate: null,
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
      "Pago": {
        bg: "bg-green-100 dark:bg-green-900",
        text: "text-green-800 dark:text-green-100",
        icon: CheckCircle,
      },
      "Pendente": {
        bg: "bg-yellow-100 dark:bg-yellow-900",
        text: "text-yellow-800 dark:text-yellow-100",
        icon: Clock,
      },
      "Atrasado": {
        bg: "bg-red-100 dark:bg-red-900",
        text: "text-red-800 dark:text-red-100",
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status] || statusConfig["Pendente"];
    const Icon = config.icon;

    return (
      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </div>
    );
  };

  return (
      <section className="space-y-8 w-[70rem] p-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Relatório de Pagamentos</h1>
            <p className="text-muted-foreground">Status de pagamentos mensais dos alunos</p>
          </div>
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
            <CardTitle>Resumo de Pagamentos - Junho 2024</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Esperado</p>
                <p className="text-2xl font-bold text-foreground">R$ 51,700</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Recebido</p>
                <p className="text-2xl font-bold text-green-600">R$ 45,230</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Taxa de Recebimento</p>
                <p className="text-2xl font-bold text-blue-600">87.5%</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso de Arrecadação</span>
                <span className="font-semibold text-foreground">87.5%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: "87.5%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar por aluno..."
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button className="gap-2 rounded-full hover:cursor-pointer hover:bg-[#5856eb] hover:text-white bg-[#4a47f5] text-white">
            <Download className="w-4 h-4" />
            Exportar
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
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Turma</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Vencimento</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Valor</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Data Pagamento</th>
                  </tr>
                </thead>
                <tbody>
                  {studentPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-muted/50 border-gray-200 border-[1px]">
                      <td className="py-3 px-4 font-medium text-foreground">{payment.studentName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{payment.grade}</td>
                      <td className="py-3 px-4 text-muted-foreground">{payment.dueDate}</td>
                      <td className="py-3 px-4 text-right font-semibold text-foreground">
                        R$ {payment.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {payment.paymentDate || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Late Payments Alert */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Atenção: Pagamentos Atrasados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Existem 2 alunos com pagamentos atrasados. Recomenda-se entrar em contato com os responsáveis.
            </p>
            <Button variant="outline" className="text-red-600 hover:text-red-600 hover:cursor-pointer border-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-full">
              Enviar Notificações
            </Button>
          </CardContent>
        </Card>
      </section>
  );
}