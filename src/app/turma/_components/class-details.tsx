"use client"
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Users, BookOpen, Clock, MapPin, GraduationCap } from "lucide-react";
import axiosInstance from "@/service/api";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClassDetailsProps {
  classId: string;
}

export function ClassDetails({ classId }: ClassDetailsProps) {
  const [open, setOpen] = useState(false);
  const [turma, setTurma] = useState<{name?: string, academicLevel?: string, students?: {id: string, name: string, profile?: {studentNumber: string}}[], capacity?: number, period?: string, roomName?: string, room?: {name: string} | string, grade?: string, course?: string, classSubjects?: {id: string, subject?: {name: string}, teacher?: {name: string}}[]} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchClassDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/classes/${classId}`);
        setTurma(response.data);
      } catch (error) {
        console.error("Failed to fetch class details", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassDetails();
  }, [open, classId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="bg-transparent text-secondary-foreground hover:bg-muted hover:text-primary transition-all rounded-sm h-8 w-8 p-0 flex items-center justify-center" title="Ver detalhes">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white shrink-0">
          <DialogTitle className="text-3xl font-bold">{turma?.name || 'Carregando...'}</DialogTitle>
          <p className="text-blue-100 mt-1">Detalhes completos da turma</p>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : turma ? (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 text-primary rounded-xl">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Nível Académico</p>
                    <p className="font-semibold text-sm">{turma.academicLevel}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lotação (Alunos)</p>
                    <p className="font-semibold text-sm">{turma.students?.length || 0} / {turma.capacity || 35}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Período/Horário</p>
                    <p className="font-semibold text-sm">{turma.period || 'Não definido'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sala</p>
                    <p className="font-semibold text-sm">{turma.roomName || (typeof turma.room === 'object' && turma.room !== null ? turma.room.name : typeof turma.room === 'string' ? turma.room : 'Sem sala')}</p>
                  </div>
                </div>

                {turma.grade && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 text-primary rounded-xl">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Classe/Ano</p>
                      <p className="font-semibold text-sm">{turma.grade}</p>
                    </div>
                  </div>
                )}

                {turma.course && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Curso</p>
                      <p className="font-semibold text-sm">{turma.course}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> Disciplinas e Professores
                  </h3>
                  {turma.classSubjects && turma.classSubjects.length > 0 ? (
                    <ul className="space-y-2">
                      {turma.classSubjects.map((cs) => (
                        <li key={cs.id} className="p-3 border rounded-xl flex justify-between items-center bg-muted/50">
                          <span className="font-medium text-sm">{cs.subject?.name || 'Disciplina Desconhecida'}</span>
                          <span className="text-xs text-muted-foreground bg-card px-2 py-1 rounded-xl border">
                            {cs.teacher?.name || 'Sem Professor'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground p-3 border rounded-xl bg-muted/50 text-center">Nenhuma disciplina associada.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" /> Alunos Matriculados
                  </h3>
                  {turma.students && turma.students.length > 0 ? (
                    <ul className="space-y-2">
                      {turma.students.map((student) => (
                        <li key={student.id} className="p-3 border rounded-xl flex justify-between items-center bg-muted/50">
                          <span className="font-medium text-sm">{student.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {student.profile?.studentNumber ? `Nº ${student.profile.studentNumber}` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground p-3 border rounded-xl bg-muted/50 text-center">Nenhum aluno matriculado.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <p className="text-muted-foreground">Não foi possível carregar os detalhes.</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
