"use client"
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/service/api";
import { Loader2, Trash2, BookOpen } from "lucide-react";

export function ClassSubjects({ classId, className }: { classId: string, className: string }) {
  const [open, setOpen] = useState(false);
  const [subjects, setSubjects] = useState<{id: string, subjectId: string, subject: {name: string}, teacher?: {name: string}}[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<{id: string, name: string}[]>([]);
  const [teachers, setTeachers] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [classSubjectsRes, allSubjectsRes, teachersRes] = await Promise.all([
        axiosInstance.get(`/classes/${classId}/subjects`),
        axiosInstance.get('/subjects'),
        axiosInstance.get('/users?role=TEACHER')
      ]);
      setSubjects(classSubjectsRes.data);
      setAvailableSubjects(allSubjectsRes.data);
      setTeachers(teachersRes.data);
    } catch (error) {
      console.error("Failed to fetch class subjects data", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados das disciplinas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, classId]);

  const handleAssignSubject = async () => {
    if (!selectedSubjectId) {
      toast({
        title: "Aviso",
        description: "Selecione uma disciplina.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await axiosInstance.post(`/classes/${classId}/subjects`, {
        subjectId: selectedSubjectId,
        teacherId: selectedTeacherId || undefined
      });
      toast({
        title: "Sucesso",
        description: "Disciplina associada à turma.",
      });
      setSelectedSubjectId("");
      setSelectedTeacherId("");
      fetchData(); // reload the list
    } catch (error) {
      console.error("Failed to assign subject", error);
      toast({
        title: "Erro",
        description: "Não foi possível associar a disciplina.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSubject = async (subjectId: string) => {
    try {
      await axiosInstance.delete(`/classes/${classId}/subjects/${subjectId}`);
      toast({
        title: "Sucesso",
        description: "Disciplina removida da turma.",
      });
      fetchData();
    } catch (error) {
      console.error("Failed to remove subject", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a disciplina.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-primary text-primary hover:bg-primary/10">
          <BookOpen className="w-4 h-4 mr-2" />
          Disciplinas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Disciplinas da Turma: {className}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="bg-muted/30 p-4 rounded-lg border border-border">
            <h3 className="font-semibold text-lg mb-4">Adicionar Disciplina</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label>Disciplina *</Label>
                <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Professor (Opcional)</Label>
                <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o professor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum professor</SelectItem>
                    {teachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAssignSubject} disabled={isSaving || !selectedSubjectId} className="w-full md:col-span-2">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Associar Disciplina
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Disciplinas Actuais</h3>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : subjects.length > 0 ? (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Disciplina</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Professor</th>
                      <th className="text-center py-3 px-4 font-semibold text-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((s) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4">{s.subject?.name}</td>
                        <td className="py-3 px-4">{s.teacher?.name || <span className="text-muted-foreground italic">Não atribuído</span>}</td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveSubject(s.subjectId)} className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg bg-muted/20 text-muted-foreground">
                Esta turma ainda não tem disciplinas associadas.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
