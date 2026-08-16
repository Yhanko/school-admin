import { Student } from '@/types/types';
import { Card } from '@/components/ui/card';
import { BookOpen, Award } from '@/lib/icons';

interface AcademicInfoProps {
  student: Student;
}

export default function AcademicInfo({ student }: AcademicInfoProps) {
  const averageGrade = student.subjects.length > 0
    ? (student.subjects.reduce((sum, s) => sum + s.grade, 0) / student.subjects.length).toFixed(1)
    : 0;

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Informações Académicas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <p className="text-sm text-muted-foreground font-medium mb-1">Curso</p>
          <p className="text-xl font-bold text-foreground">{student.course}</p>
        </div>

        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
          <p className="text-sm text-muted-foreground font-medium mb-1">Classe</p>
          <p className="text-xl font-bold text-foreground">{student.class}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
          <p className="text-sm text-muted-foreground font-medium mb-1">Turma</p>
          <p className="text-xl font-bold text-foreground">{student.classGroup}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-green-600" />
            <p className="text-sm text-muted-foreground font-medium">Média Geral</p>
          </div>
          <p className="text-xl font-bold text-foreground">{averageGrade}/20</p>
        </div>
      </div>
    </Card>
  );
}
