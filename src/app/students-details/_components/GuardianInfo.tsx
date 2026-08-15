import { Student } from '@/types/types';
import { Card } from '@/components/ui/card';
import { Shield, Phone, Mail, User } from '@/lib/icons';

interface GuardianInfoProps {
  student: Student;
}

export default function GuardianInfo({ student }: GuardianInfoProps) {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">Encarregado de Educação</h2>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-blue-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium mb-1">Nome Completo</p>
              <p className="text-lg font-bold text-gray-900">{student.guardian.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue-200">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">Relação com Aluno</p>
              <p className="text-base font-semibold text-gray-900 bg-white px-3 py-2 rounded border border-blue-100">
                {student.guardian.relationship}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 font-medium mb-2">Telefone</p>
              <a
                href={`tel:${student.guardian.phone}`}
                className="flex items-center gap-2 text-base font-semibold text-primary hover:text-blue-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {student.guardian.phone}
              </a>
            </div>
          </div>

          {student.guardian.email && (
            <div className="pt-4 border-t border-blue-200">
              <p className="text-sm text-gray-600 font-medium mb-2">Email</p>
              <a
                href={`mailto:${student.guardian.email}`}
                className="flex items-center gap-2 text-base font-semibold text-primary hover:text-blue-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {student.guardian.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
