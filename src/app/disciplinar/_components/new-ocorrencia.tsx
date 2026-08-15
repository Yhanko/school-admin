"use client"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Plus, Loader2 } from "@/lib/icons";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";

const SEVERITY = [
  { label: 'Baixo', value: 'LOW' },
  { label: 'Médio', value: 'MEDIUM' },
  { label: 'Alto', value: 'HIGH' }
];

const STATUS = [
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Em andamento', value: 'IN_PROGRESS' },
  { label: 'Resolvido', value: 'RESOLVED' }
];

export interface IncidentFormData {
  studentId: string;
  severity: string;
  description: string;
  status: string;
  type: string;
  date: string;
}

interface UserProps {
    id: string;
    name: string;
    profile?: {
        firstName: string;
        lastName: string;
    }
}

export function NewOccurrence({ onCreated }: { onCreated?: () => void }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [students, setStudents] = useState<UserProps[]>([]);
    
    const [formData, setFormData] = useState<IncidentFormData>({
        studentId: '',
        severity: 'LOW',
        description: '',
        status: 'PENDING',
        type: "",
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (!isOpen) return;

        const fetchStudents = async () => {
            try {
                const response = await axiosInstance.get('/users?role=STUDENT');
                setStudents(response.data);
                if (response.data.length > 0 && !formData.studentId) {
                    setFormData(prev => ({ ...prev, studentId: response.data[0].id }));
                }
            } catch (error) {
                console.error("Failed to fetch students", error);
                toast({ title: 'Erro', description: 'Não foi possível carregar os alunos.', variant: 'destructive' });
            }
        };

        fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axiosInstance.post('/disciplinary', {
                studentId: formData.studentId,
                type: formData.type,
                severity: formData.severity,
                status: formData.status,
                description: formData.description,
                date: new Date(formData.date).toISOString()
            });

            toast({ title: 'Sucesso', description: 'Ocorrência criada com sucesso!' });
            setIsOpen(false);
            setFormData({ studentId: '', severity: 'LOW', description: '', status: 'PENDING', type: "", date: new Date().toISOString().split('T')[0] });
            if (onCreated) onCreated();
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            toast({ title: 'Erro', description: err.response?.data?.message || 'Falha ao criar ocorrência.', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
            size="sm"
            className="gap-1.5 bg-primary rounded-xl text-white hover:bg-indigo-700 hover:text-white cursor-pointer text-xs sm:text-sm">
            <Plus className="w-4 h-4 " />
            Nova ocorrência
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-4 sm:p-6">
        <SheetHeader>
          <SheetTitle className="text-base font-bold">Ocorrência</SheetTitle>
          <SheetDescription className="text-xs text-gray-500">
            Adicione uma nova ocorrência disciplinar
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aluno *
                </label>
                <select
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
                >
                    <option value="" disabled>Selecione um aluno...</option>
                    {students.map((student) => (
                    <option key={student.id} value={student.id}>
                        {student.name}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Ocorrência *
                </label>
                <input
                    type="text"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                    placeholder="Ex: Atraso Frequente"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data *
                </label>
                <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severidade *
                </label>
                <select
                    required
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
                >
                    {SEVERITY.map((level) => (
                    <option key={level.value} value={level.value}>
                        {level.label}
                    </option>
                    ))}
                </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                </label>
                <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
                    placeholder="Detalhes da ocorrência..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
                </label>
                <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
                >
                    {STATUS.map((level) => (
                    <option key={level.value} value={level.value}>
                        {level.label}
                    </option>
                    ))}
                </select>
            </div>

            <SheetFooter className="mt-5 pt-4 border-t border-gray-100">
                <Button disabled={isSubmitting} type="submit" className="w-full bg-primary rounded-xl text-white cursor-pointer hover:bg-indigo-700 h-11 font-semibold text-sm">
                    {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    {isSubmitting ? "A guardar..." : "Guardar Ocorrência"}
                </Button>
            </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}