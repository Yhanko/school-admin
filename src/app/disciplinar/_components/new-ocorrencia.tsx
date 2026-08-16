"use client"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react';
import { z } from 'zod';
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

const occurrenceSchema = z.object({
  studentId: z.string().min(1, "O aluno é obrigatório"),
  type: z.string().trim().min(1, "O tipo de ocorrência é obrigatório").max(100, "Tipo muito longo").regex(/^[^<>';=]*$/, "Caracteres inválidos (Não use < > ' ; =)"),
  date: z.string().min(1, "A data é obrigatória"),
  severity: z.string().min(1, "A severidade é obrigatória"),
  status: z.string().min(1, "O status é obrigatório"),
  description: z.string().trim().min(1, "A descrição é obrigatória").max(1000, "Descrição muito longa").regex(/^[^<>';=]*$/, "Caracteres inválidos (Não use < > ' ; =)")
});

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
    const [errors, setErrors] = useState<Record<string, string>>({});
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
        
        try {
            occurrenceSchema.parse(formData);
            setErrors({});
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};
                err.errors.forEach((error) => {
                    if (error.path[0]) {
                        fieldErrors[error.path[0] as string] = error.message;
                    }
                });
                setErrors(fieldErrors);
            }
            return;
        }

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
            className="gap-1.5 bg-primary rounded text-white hover:bg-[#A78BFA] cursor-pointer text-xs sm:text-sm font-semibold transition-all shadow-xs">
            <Plus className="w-4 h-4 " />
            Nova ocorrência
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-4 sm:p-6 font-hanken">
        <SheetHeader>
          <SheetTitle className="text-base font-bold">Ocorrência</SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Adicione uma nova ocorrência disciplinar
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Aluno *
                </label>
                <select
                    value={formData.studentId}
                    onChange={(e) => { setFormData({ ...formData, studentId: e.target.value }); if(errors.studentId) setErrors(prev => ({...prev, studentId: ''})); }}
                    className={`w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary bg-card ${errors.studentId ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200' : 'border-border'}`}
                >
                    <option value="" disabled>Selecione um aluno...</option>
                    {students.map((student) => (
                    <option key={student.id} value={student.id}>
                        {student.name}
                    </option>
                    ))}
                </select>
                {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
                </div>

                <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Tipo de Ocorrência *
                </label>
                <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => { setFormData({ ...formData, type: e.target.value }); if(errors.type) setErrors(prev => ({...prev, type: ''})); }}
                    className={`w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary bg-card ${errors.type ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200' : 'border-border'}`}
                    placeholder="Ex: Atraso Frequente"
                />
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                </div>

                <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Data *
                </label>
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => { setFormData({ ...formData, date: e.target.value }); if(errors.date) setErrors(prev => ({...prev, date: ''})); }}
                    className={`w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary bg-card ${errors.date ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200' : 'border-border'}`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>

                <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Severidade *
                </label>
                <select
                    value={formData.severity}
                    onChange={(e) => { setFormData({ ...formData, severity: e.target.value }); if(errors.severity) setErrors(prev => ({...prev, severity: ''})); }}
                    className={`w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary bg-card ${errors.severity ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200' : 'border-border'}`}
                >
                    {SEVERITY.map((level) => (
                    <option key={level.value} value={level.value}>
                        {level.label}
                    </option>
                    ))}
                </select>
                {errors.severity && <p className="text-red-500 text-xs mt-1">{errors.severity}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                    Descrição *
                </label>
                <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => { setFormData({ ...formData, description: e.target.value }); if(errors.description) setErrors(prev => ({...prev, description: ''})); }}
                    className={`w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary resize-none bg-card ${errors.description ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200' : 'border-border'}`}
                    placeholder="Detalhes da ocorrência..."
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                Status *
                </label>
                <select
                    value={formData.status}
                    onChange={(e) => { setFormData({ ...formData, status: e.target.value }); if(errors.status) setErrors(prev => ({...prev, status: ''})); }}
                    className={`w-full px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-primary focus:border-primary bg-card ${errors.status ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200' : 'border-border'}`}
                >
                    {STATUS.map((level) => (
                    <option key={level.value} value={level.value}>
                        {level.label}
                    </option>
                    ))}
                </select>
                {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
            </div>

            <SheetFooter className="mt-5 pt-4 border-t border-border">
                <Button disabled={isSubmitting} type="submit" className="w-full bg-primary rounded text-white cursor-pointer hover:bg-[#A78BFA] h-11 font-semibold text-sm transition-all shadow-xs">
                    {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    {isSubmitting ? "A guardar..." : "Guardar Ocorrência"}
                </Button>
            </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}