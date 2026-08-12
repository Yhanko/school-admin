"use client"
import { Plus, Mail } from "@/lib/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StudentItem {
  id?: string;
  name?: string;
  code?: string;
  email?: string;
  enrollments?: { class?: { grade?: string; name?: string } }[];
}

export function RecentStudents ({ students = [] }: { students?: StudentItem[] }) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-800">Alunos Recentes</CardTitle>
          <p className="text-sm text-gray-500">Foram cadastrados {students.length} novos alunos</p>
        </div>
        <Button size="icon" className="bg-[#6366f1] hover:bg-[#5856eb] text-white rounded-full">
          <Plus className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {students.map((student, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-purple-700 font-medium text-sm">{getInitials(student.name || "?")}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                <p className="text-xs text-gray-500">{student.email || 'N/A'}</p>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="text-gray-400 hover:text-gray-600">
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button variant="link" className="w-full text-[#6366f1] text-sm">
          Ver Mais
        </Button>
      </CardContent>
    </Card>
  );
};