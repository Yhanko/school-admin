"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";

interface DashboardPaymentItem {
  id?: string;
  type?: string;
  student?: { name?: string };
  amount?: number;
  status?: string;
  createdAt?: string;
}

export function StudentTable({ payments = [] }: { payments?: DashboardPaymentItem[] }) {
  const getInitials = (name?: string) => {
    return name ? name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'N/A';
  };

  const getStatusBadge = (status?: string) => {
    if (status === 'pago' || status === 'confirmed') {
      return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">Confirmado</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">Pendente</span>;
  };

  return (
    <Card className="bg-white overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg font-bold text-gray-900">Pagamentos Recentes</CardTitle>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Aluno</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ref. ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo / Estado</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-sm text-gray-500">Nenhum pagamento registado.</td>
                </tr>
              ) : (
                payments.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-9 w-9 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-700 font-semibold text-xs">{getInitials(payment.student?.name)}</span>
                        </div>
                        <div className="ml-3">
                          <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[150px] sm:max-w-[200px]">
                            {payment.student?.name || 'Desconhecido'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-mono text-primary font-medium">#{payment.id ? payment.id.split('-')[0] : 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 font-medium">{payment.type || 'Propina'}</span>
                        {getStatusBadge(payment.status)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right font-bold text-xs sm:text-sm text-gray-900">
                      {(payment.amount || 0).toLocaleString()} Kz
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {payments.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 px-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
            <p>Exibindo <span className="font-semibold text-gray-900">1-{Math.min(payments.length, 5)}</span> de <span className="font-semibold text-gray-900">{payments.length}</span> pagamentos</p>
            <div className="flex space-x-1">
              <Button variant="default" size="sm" className="h-7 w-7 p-0 bg-primary text-white">1</Button>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0">2</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}