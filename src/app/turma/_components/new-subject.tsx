"use client"
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/service/api";
import { Loader2, BookOpen } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const ACADEMIC_LEVELS = [
  "Ensino Primário",
  "Ensino Secundário I",
  "Ensino Secundário II"
];

export function NewSubject({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [classes, setClasses] = useState<{id: string, name: string, period: string}[]>([]);
  const [teachers, setTeachers] = useState<{id: string, name: string}[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      axiosInstance.get('/classes').then(res => setClasses(res.data)).catch(console.error);
      axiosInstance.get('/users?role=TEACHER').then(res => setTeachers(res.data)).catch(console.error);
    }
  }, [open]);

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const toggleClass = (classId: string) => {
    setSelectedClassIds(prev => 
      prev.includes(classId) ? prev.filter(c => c !== classId) : [...prev, classId]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({
        title: "Aviso",
        description: "O nome da disciplina é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await axiosInstance.post('/subjects', { 
        name,
        academicLevels: selectedLevels.length > 0 ? selectedLevels : undefined,
        classIds: selectedClassIds.length > 0 ? selectedClassIds : undefined,
        teacherId: selectedTeacherId || undefined,
      });
      toast({
        title: "Sucesso",
        description: "Nova disciplina registada e vinculada com sucesso.",
      });
      setName("");
      setSelectedLevels([]);
      setSelectedClassIds([]);
      setOpen(false);
      if (onCreated) onCreated();
    } catch (error) {
      console.error("Failed to create subject", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a disciplina.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 flex items-center bg-primary text-primary-foreground border-none rounded-sm hover:bg-[#A78BFA] hover:shadow-[0_0_12px_rgba(139, 92, 246,0.4)] transition-all font-bold font-hanken text-sm px-4 py-2 h-10">
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Nova Disciplina</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registar Nova Disciplina Base</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Disciplina *</Label>
            <Input 
              id="name" 
              placeholder="Ex: Matemática, Física..." 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Professor Responsável (Opcional)</Label>
            <select
              id="teacher"
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">-- Nenhum (Atribuir mais tarde) --</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4 bg-muted/20 p-4 rounded-xl border">
            <h4 className="font-semibold">Vincular a Ciclos (Opcional)</h4>
            <p className="text-sm text-muted-foreground mb-2">Selecione para vincular automaticamente a todas as turmas deste ciclo.</p>
            <div className="flex flex-wrap gap-4">
              {ACADEMIC_LEVELS.map(level => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`level-${level}`} 
                    checked={selectedLevels.includes(level)}
                    onCheckedChange={() => toggleLevel(level)}
                  />
                  <Label htmlFor={`level-${level}`} className="font-normal cursor-pointer">{level}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 bg-muted/20 p-4 rounded-xl border">
            <h4 className="font-semibold">Vincular a Turmas Específicas (Opcional)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {classes.length === 0 ? (
                <span className="text-sm text-muted-foreground col-span-3">Nenhuma turma encontrada.</span>
              ) : (
                classes.map(c => (
                  <div key={c.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`class-${c.id}`} 
                      checked={selectedClassIds.includes(c.id)}
                      onCheckedChange={() => toggleClass(c.id)}
                    />
                    <Label htmlFor={`class-${c.id}`} className="font-normal cursor-pointer line-clamp-1" title={`${c.name} (${c.period})`}>
                      {c.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>

          <Button onClick={handleCreate} disabled={isSaving || !name.trim()} className="w-full flex justify-center bg-primary text-primary-foreground border-none rounded-sm hover:bg-[#A78BFA] hover:shadow-[0_0_12px_rgba(139, 92, 246,0.4)] transition-all font-bold font-hanken text-sm px-4 py-2 h-10">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Gravar Disciplina e Vinculos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
