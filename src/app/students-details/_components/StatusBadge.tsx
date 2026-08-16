import { StudentStatus } from '@/types/types';
import { CheckCircle, AlertCircle, XCircle, LogOut } from '@/lib/icons';

interface StatusBadgeProps {
  status: StudentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    ativo: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Ativo',
      icon: CheckCircle,
    },
    inativo: {
      bg: 'bg-muted',
      text: 'text-foreground',
      label: 'Inativo',
      icon: AlertCircle,
    },
    suspenso: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Suspenso',
      icon: XCircle,
    },
    transferido: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Transferido',
      icon: LogOut,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
}
