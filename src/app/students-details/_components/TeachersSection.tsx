import { Student } from '@/types/types';
import { Card } from '@/components/ui/card';
import { Users } from '@/lib/icons';

interface TeachersSectionProps {
  student: Student;
}

export default function TeachersSection({ student }: TeachersSectionProps) {
  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">Professores</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {student.teachers.map((teacher, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-blue-700 font-bold text-sm">
                  {teacher.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <p className="text-gray-900 font-medium">{teacher}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total de Professores:</span>
          <span className="text-xl font-bold text-gray-900">{student.teachers.length}</span>
        </div>
      </div>
    </Card>
  );
}
