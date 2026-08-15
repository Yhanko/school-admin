import { Student } from '@/types/types';
import { Card } from '@/components/ui/card';
import { Building2, Users, MapPin } from '@/lib/icons';

interface ClassroomInfoProps {
  student: Student;
}

export default function ClassroomInfo({ student }: ClassroomInfoProps) {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">Informações da Sala de Aula</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600 font-medium">Número da Sala</p>
          </div>
          <p className="text-3xl font-bold text-purple-700">{student.classroom.number}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="w-5 h-5 text-orange-600" />
            <p className="text-sm text-gray-600 font-medium">Andar</p>
          </div>
          <p className="text-3xl font-bold text-orange-700">{student.classroom.floor}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <Users className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600 font-medium">Capacidade</p>
          </div>
          <p className="text-3xl font-bold text-green-700">{student.classroom.capacity}</p>
        </div>
      </div>
    </Card>
  );
}
