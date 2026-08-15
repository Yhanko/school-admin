"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Users, BookOpen, Clock, MapPin, GraduationCap } from "lucide-react";
import axiosInstance from "@/service/api";

interface ClassSubject {
  id: string;
  subject?: { name: string };
  teacher?: { name: string };
}

interface StudentInClass {
  id: string;
  name: string;
  profile?: { studentNumber?: string };
}

interface TurmaData {
  name: string;
  academicLevel?: string;
  capacity?: number;
  period?: string;
  roomName?: string;
  room?: { name: string } | string;
  grade?: string;
  course?: string;
  students?: StudentInClass[];
  classSubjects?: ClassSubject[];
}

export default function TurmaDetails() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [turma, setTurma] = useState<TurmaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchClassDetails = async () => {
      try {
        const response = await axiosInstance.get(`/classes/${id}`);
        setTurma(response.data);
      } catch (error) {
        console.error("Failed to fetch class details", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!turma) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-xl text-muted-foreground">Turma não encontrada.</p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-6 px-2 sm:px-4 py-4">
      {/* Header Area */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.push('/turma')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Detalhes da Turma</h1>
          <p className="text-muted-foreground mt-1">Visualize todas as informações desta turma</p>
        </div>
      </div>

      <Card className="bg-white overflow-hidden">
        <CardHeader className="relative p-0">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32 flex items-end p-6">
            <h2 className="text-4xl font-bold text-white">{turma.name}</h2>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-primary rounded-xl">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nível Académico</p>
                <p className="font-semibold">{turma.academicLevel}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lotação (Alunos)</p>
                <p className="font-semibold">{turma.students?.length || 0} / {turma.capacity || 35}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Período/Horário</p>
                <p className="font-semibold">{turma.period || 'Não definido'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sala</p>
                <p className="font-semibold">{turma.roomName || (typeof turma.room === 'object' ? turma.room?.name : turma.room) || 'Sem sala'}</p>
              </div>
            </div>

            {turma.grade && (
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-100 text-primary rounded-xl">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Classe/Ano</p>
                  <p className="font-semibold">{turma.grade}</p>
                </div>
              </div>
            )}

            {turma.course && (
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Curso</p>
                  <p className="font-semibold">{turma.course}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Subjects / Teachers */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Disciplinas e Professores
              </h3>
              {turma.classSubjects && turma.classSubjects.length > 0 ? (
                <ul className="space-y-3">
                  {turma.classSubjects.map((cs: ClassSubject) => (
                    <li key={cs.id} className="p-4 border rounded-xl flex justify-between items-center bg-gray-50">
                      <span className="font-semibold">{cs.subject?.name || 'Disciplina Desconhecida'}</span>
                      <span className="text-sm text-muted-foreground bg-white px-3 py-1 rounded-full border">
                        {cs.teacher?.name || 'Sem Professor'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground p-4 border rounded-xl bg-gray-50 text-center">Nenhuma disciplina associada a esta turma.</p>
              )}
            </div>

            {/* Students */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" /> Alunos Matriculados
              </h3>
              {turma.students && turma.students.length > 0 ? (
                <ul className="space-y-3">
                  {turma.students.map((student: StudentInClass) => (
                    <li key={student.id} className="p-4 border rounded-xl flex justify-between items-center bg-gray-50">
                      <span className="font-semibold">{student.name}</span>
                      <span className="text-sm text-muted-foreground">
                         {student.profile?.studentNumber ? `Nº ${student.profile.studentNumber}` : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground p-4 border rounded-xl bg-gray-50 text-center">Nenhum aluno matriculado nesta turma.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
