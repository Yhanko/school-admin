import { Student } from '@/types/types';
import { Card } from '@/components/ui/card';
import { BookMarked } from '@/lib/icons';

interface SubjectsSectionProps {
  student: Student;
}

export default function SubjectsSection({ student }: SubjectsSectionProps) {
  const getGradeColor = (grade: number) => {
    if (grade >= 18) return 'bg-green-100 text-green-800';
    if (grade >= 15) return 'bg-blue-100 text-blue-800';
    if (grade >= 12) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <BookMarked className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">Disciplinas e Notas</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Disciplina</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Nota</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Professor(a)</th>
            </tr>
          </thead>
          <tbody>
            {student.subjects.map((subject) => (
              <tr key={subject.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-gray-900 font-medium">{subject.name}</td>
                <td className="py-4 px-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full font-bold text-sm ${getGradeColor(subject.grade)}`}>
                    {subject.grade}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-700">{subject.professor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total de Disciplinas:</span>
          <span className="text-xl font-bold text-gray-900">{student.subjects.length}</span>
        </div>
      </div>
    </Card>
  );
}
