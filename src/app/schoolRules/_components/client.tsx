'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FileText,
  Download,
  Share2,
  Eye,
  Trash2,
  Users,
  GraduationCap,
  Briefcase,
  Plus,
  Upload
} from '@/lib/icons';
import Link from 'next/link';
import axiosInstance from '@/service/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { z } from 'zod';

const ruleSchema = z.object({
  title: z.string().trim().min(1, "O título é obrigatório").max(255, "Título muito longo").regex(/^[^<>';=]*$/, "Caracteres inválidos (Não use < > ' ; =)"),
  description: z.string().trim().max(500, "Descrição muito longa").regex(/^[^<>';=]*$/, "Caracteres inválidos (Não use < > ' ; =)").optional().or(z.literal('')),
  content: z.string().trim().max(10000, "Conteúdo muito longo").regex(/^[^<>';=]*$/, "Caracteres inválidos (Não use < > ' ; =)").optional().or(z.literal(''))
});

interface Regulation {
  id: string;
  title: string;
  description: string;
  content?: string;
  fileUrl?: string;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
}

export function RegulationsClient() {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [shareDialog, setShareDialog] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({ title: '', description: '', content: '', fileUrl: '' });
  const [sendTo, setSendTo] = useState({ students: false, parents: false, teachers: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchRegulations = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/regulations');
      setRegulations(response.data);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Erro',
        description: err.response?.data?.message || 'Falha ao carregar regulamentos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRegulations();
  }, [fetchRegulations]);

  const shareOptions = [
    { icon: Users, label: 'Encarregados de Educação', color: 'text-primary' },
    { icon: GraduationCap, label: 'Educandos', color: 'text-purple-600' },
    { icon: Users, label: 'Professores', color: 'text-green-600' },
    { icon: Briefcase, label: 'Funcionários', color: 'text-orange-600' },
  ];

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja apagar este regulamento?')) return;
    
    setIsDeleting(id);
    try {
      await axiosInstance.delete(`/regulations/${id}`);
      toast({ title: 'Sucesso', description: 'Regulamento apagado com sucesso.' });
      setRegulations(regulations.filter(r => r.id !== id));
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'Erro',
        description: err.response?.data?.message || 'Falha ao apagar regulamento',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      ruleSchema.parse({
        title: newRule.title,
        description: newRule.description,
        content: newRule.content,
      });
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
      const payload: Record<string, unknown> = {
        title: newRule.title,
        description: newRule.description,
        status: 'PUBLISHED'
      };

      if (newRule.content) payload.content = newRule.content;
      if (newRule.fileUrl) payload.fileUrl = newRule.fileUrl;

      const response = await axiosInstance.post('/regulations', payload);
      
      setRegulations([response.data, ...regulations]);
      setIsCreateModalOpen(false);
      setNewRule({ title: '', description: '', content: '', fileUrl: '' });
      
      const sentToText: string[] = [];
      if (sendTo.students) sentToText.push('Alunos');
      if (sendTo.parents) sentToText.push('Encarregados');
      if (sendTo.teachers) sentToText.push('Professores');
      
      const sentMessage = sentToText.length > 0 
        ? ` Enviado para: ${sentToText.join(', ')}.` 
        : '';

      toast({ title: 'Sucesso', description: 'Regulamento criado com sucesso.' + sentMessage });
      setSendTo({ students: false, parents: false, teachers: false });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: 'Erro', description: err.response?.data?.message || 'Falha ao criar regulamento', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadPDF = (regulation: Regulation) => {
    if (regulation.fileUrl) {
      window.open(regulation.fileUrl, '_blank');
      return;
    }
    
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(regulation.title, 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Data de Criação: ${new Date(regulation.createdAt).toLocaleDateString('pt-PT')}`, 14, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    
    let currentY = 40;
    
    if (regulation.description) {
      doc.text("Descrição:", 14, currentY);
      doc.setFontSize(10);
      const descLines = doc.splitTextToSize(regulation.description, 180);
      doc.text(descLines, 14, currentY + 6);
      currentY += 6 + (descLines.length * 5) + 5;
    }
    
    if (regulation.content) {
      doc.setFontSize(12);
      doc.text("Conteúdo:", 14, currentY);
      doc.setFontSize(10);
      const contentLines = doc.splitTextToSize(regulation.content, 180);
      doc.text(contentLines, 14, currentY + 6);
    }
    
    doc.save(`Regulamento_${regulation.title.replace(/\s+/g, '_')}.pdf`);
    toast({ title: 'Download Concluído', description: 'O regulamento foi exportado em PDF.' });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const titleWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    e.target.value = ''; // allow same file again

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/uploads/cloudinary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const uploadedUrl = response.data.path;

      setNewRule({ ...newRule, title: titleWithoutExt, fileUrl: uploadedUrl });
      setIsCreateModalOpen(true);
      toast({ title: 'Upload Concluído', description: `O arquivo "${file.name}" foi enviado com sucesso para o Cloudinary.` });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ 
        title: 'Erro de Upload', 
        description: err.response?.data?.message || 'Falha ao fazer o upload do ficheiro. Verifique se as chaves do Cloudinary estão configuradas no backend.', 
        variant: 'destructive' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
            Regulamentos Internos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Crie, gerencie e compartilhe os regulamentos da sua instituição
          </p>
        </div>
        <div className='flex flex-wrap gap-2 shrink-0'>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.doc,.docx,.txt"
          />
          <Button 
            size="sm"
            className="gap-1.5 bg-primary rounded hover:bg-[#A78BFA] text-white cursor-pointer text-xs sm:text-sm font-semibold transition-all shadow-xs"
            onClick={handleImportClick}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {isUploading ? 'A carregar...' : 'Importar regulamento'}
          </Button>
          
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5 bg-primary rounded hover:bg-[#A78BFA] text-white cursor-pointer text-xs sm:text-sm font-semibold transition-all shadow-xs">
                <Plus className="h-4 w-4" />
                Criar regulamento
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto rounded border border-border">
              <DialogHeader>
                <DialogTitle>Criar Novo Regulamento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Regulamento</Label>
                  <Input 
                    id="title" 
                    placeholder="Ex: Regulamento de Avaliação Escolar" 
                    value={newRule.title}
                    onChange={(e) => { setNewRule({...newRule, title: e.target.value}); if(errors.title) setErrors(prev => ({...prev, title: ''})); }}
                    className={`rounded ${errors.title ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200' : ''}`}
                    required
                  />
                  {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Breve</Label>
                  <Input 
                    id="description" 
                    placeholder="Ex: Normas e critérios para as avaliações trimestrais." 
                    value={newRule.description}
                    onChange={(e) => { setNewRule({...newRule, description: e.target.value}); if(errors.description) setErrors(prev => ({...prev, description: ''})); }}
                    className={`rounded ${errors.description ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200' : ''}`}
                  />
                  {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                </div>

                {newRule.fileUrl && (
                  <div className="p-3 bg-primary/10 text-primary rounded border border-primary/20 flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" /> PDF Anexado
                    </span>
                    <Button type="button" variant="ghost" size="sm" className="rounded" onClick={() => setNewRule({...newRule, fileUrl: ''})}>Remover</Button>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo do Regulamento (Opcional se anexar PDF)</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Digite o texto completo do regulamento aqui..." 
                    className={`min-h-[200px] rounded ${errors.content ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200' : ''}`}
                    value={newRule.content}
                    onChange={(e) => { setNewRule({...newRule, content: e.target.value}); if(errors.content) setErrors(prev => ({...prev, content: ''})); }}
                  />
                  {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
                </div>
                
                <div className="space-y-3 pt-4 border-t">
                  <Label>Enviar diretamente para (Notificar por email):</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="send-students" 
                        checked={sendTo.students}
                        onCheckedChange={(checked) => setSendTo({...sendTo, students: checked as boolean})}
                      />
                      <label htmlFor="send-students" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Alunos
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="send-parents" 
                        checked={sendTo.parents}
                        onCheckedChange={(checked) => setSendTo({...sendTo, parents: checked as boolean})}
                      />
                      <label htmlFor="send-parents" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Encarregados de Educação
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="send-teachers" 
                        checked={sendTo.teachers}
                        onCheckedChange={(checked) => setSendTo({...sendTo, teachers: checked as boolean})}
                      />
                      <label htmlFor="send-teachers" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Professores
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" className="bg-[#4043f8] hover:bg-[#3235df]" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar e Publicar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {regulations.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50">
          <CardContent className="py-16 text-center">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Nenhum regulamento criado ainda
            </h3>
            <p className="text-slate-600 mb-6">
              Comece criando seu primeiro regulamento interno
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>Criar Regulamento</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {regulations.map((regulation) => (
            <Card
              key={regulation.id}
              className="hover:shadow-lg transition-shadow flex flex-col"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-8 w-8 text-primary" />
                  <Badge
                    variant={
                      regulation.status === 'PUBLISHED'
                        ? 'default'
                        : 'secondary'
                    }
                    className={regulation.status === 'PUBLISHED' ? 'bg-[#4043f8] text-white' : ''}
                  >
                    {regulation.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-4">
                  {regulation.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-slate-600 line-clamp-2">
                  {regulation.description || 'Sem descrição.'}
                </p>
                <p className="text-xs text-slate-500">
                  Criado em{' '}
                  {new Date(regulation.createdAt).toLocaleDateString('pt-PT')}
                </p>

                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {regulation.fileUrl ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2 hover:cursor-pointer"
                      onClick={() => window.open(regulation.fileUrl, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                      Ver PDF
                    </Button>
                  ) : (
                    <Link href={`/regulamentos/${regulation.id}`}>
                      <Button size="sm" variant="outline" className="gap-2 hover:cursor-pointer">
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                    </Link>
                  )}

                  <Dialog open={shareDialog === regulation.id}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 hover:cursor-pointer"
                        onClick={() => setShareDialog(regulation.id)}
                      >
                        <Share2 className="h-4 w-4" />
                        Partilhar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Partilhar Regulamento</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        {shareOptions.map((option, index) => {
                          const Icon = option.icon;
                          return (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full justify-start gap-3 hover:cursor-pointer"
                              onClick={() => {
                                toast({ title: 'Partilha', description: `Regulamento compartilhado com ${option.label}` });
                                setShareDialog(null);
                              }}
                            >
                              <Icon className={`h-4 w-4 ${option.color}`} />
                              {option.label}
                            </Button>
                          );
                        })}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 hover:cursor-pointer"
                    onClick={() => downloadPDF(regulation)}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 text-red-600 hover:text-red-700 hover:cursor-pointer"
                    onClick={() => handleDelete(regulation.id)}
                    disabled={isDeleting === regulation.id}
                  >
                    {isDeleting === regulation.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Apagar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}