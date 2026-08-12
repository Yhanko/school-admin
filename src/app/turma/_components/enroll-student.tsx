"use client"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Loader2 } from "lucide-react";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EnrollStudentProps {
  classId: string;
  className: string;
  onSuccess: () => void;
}

export function EnrollStudent({ classId, className, onSuccess }: EnrollStudentProps) {
    const [open, setOpen] = useState(false);
    const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [fetchingStudents, setFetchingStudents] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (open) {
            fetchStudents();
        }
    }, [open]);

    const fetchStudents = async () => {
        setFetchingStudents(true);
        try {
            const response = await axiosInstance.get('/users?role=STUDENT');
            setStudents(response.data);
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setFetchingStudents(false);
        }
    };

    const handleEnroll = async () => {
        if (!selectedStudent) {
            toast({ title: "Atenção", description: "Selecione um aluno primeiro.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post(`/classes/${classId}/enroll/${selectedStudent}`);
            toast({ title: "Sucesso", description: "Aluno matriculado com sucesso!" });
            setOpen(false);
            setSelectedStudent("");
            onSuccess();
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || "Ocorreu um erro ao matricular o aluno.";
            toast({ title: "Erro", description: message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800">
                    <UserPlus className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Matricular Aluno</DialogTitle>
                    <DialogDescription>
                        Escolha um aluno para associar à turma {className}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Aluno</label>
                        <Select disabled={fetchingStudents} value={selectedStudent} onValueChange={setSelectedStudent}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={fetchingStudents ? "Carregando alunos..." : "Selecione um aluno..."} />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map((student) => (
                                    <SelectItem key={student.id} value={student.id}>
                                        {student.name} ({student.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancelar</Button>
                    <Button onClick={handleEnroll} disabled={loading || !selectedStudent} className="bg-primary text-primary-foreground">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        {loading ? "A matricular..." : "Confirmar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
