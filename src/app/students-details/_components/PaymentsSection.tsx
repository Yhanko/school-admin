import { Student } from '@/types/types';
import { Card } from '@/components/ui/card';
import { CreditCard, CheckCircle, Clock, AlertCircle } from '@/lib/icons';

interface PaymentsSectionProps {
  student: Student;
}

export default function PaymentsSection({ student }: PaymentsSectionProps) {
  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'pago':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pendente':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'atrasado':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
        return 'bg-green-50 border-green-200';
      case 'pendente':
        return 'bg-yellow-50 border-yellow-200';
      case 'atrasado':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'pago':
        return 'Pago';
      case 'pendente':
        return 'Pendente';
      case 'atrasado':
        return 'Atrasado';
      default:
        return status;
    }
  };

  const totalPaid = student.payments
    .filter(p => p.status === 'pago')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = student.payments
    .filter(p => p.status === 'pendente' || p.status === 'atrasado')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">Pagamentos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <p className="text-sm text-gray-600 font-medium mb-1">Total Pago</p>
          <p className="text-2xl font-bold text-green-700">{totalPaid.toFixed(2)} €</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <p className="text-sm text-gray-600 font-medium mb-1">Pendente</p>
          <p className="text-2xl font-bold text-yellow-700">{totalPending.toFixed(2)} €</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <p className="text-sm text-gray-600 font-medium mb-1">Total de Transações</p>
          <p className="text-2xl font-bold text-blue-700">{student.payments.length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {student.payments.map((payment) => (
          <div
            key={payment.id}
            className={`p-4 rounded-xl border-2 flex items-center justify-between ${getPaymentStatusColor(payment.status)}`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                {getPaymentStatusIcon(payment.status)}
                <p className="font-semibold text-gray-900">{payment.description}</p>
              </div>
              <p className="text-sm text-gray-600 ml-8">
                {new Date(payment.date).toLocaleDateString('pt-PT')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{payment.amount.toFixed(2)} €</p>
              <p className="text-xs font-medium text-gray-600 mt-1">
                {getPaymentStatusLabel(payment.status)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
