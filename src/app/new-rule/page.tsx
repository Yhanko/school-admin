'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Eye } from '@/lib/icons';
import Image from 'next/image';
import axiosInstance from '@/service/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function NovoRegulamentoPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [content, setContent] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitRegulation = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!title) {
      toast({ title: 'Aviso', description: 'O título do regulamento é obrigatório.', variant: 'destructive' });
      return;
    }
    if (!content) {
      toast({ title: 'Aviso', description: 'O conteúdo principal é obrigatório.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post('/regulations', {
        title,
        description,
        content,
        status,
        // fileUrl is optional, ignoring image upload for now
      });

      toast({ 
        title: 'Sucesso!', 
        description: `Regulamento ${status === 'DRAFT' ? 'guardado como rascunho' : 'publicado'} com sucesso.` 
      });
      router.push('/schoolRules');
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Ocorreu um erro ao guardar o regulamento.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = () => {
    submitRegulation('DRAFT');
  };

  const handlePublish = () => {
    submitRegulation('PUBLISHED');
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Criar Novo Regulamento
          </h1>
          <p className="text-slate-600">
            Preencha os detalhes e customize seu regulamento institucional
          </p>
        </div>

        <Tabs defaultValue="editor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor" className="gap-2 hover:cursor-pointer bg-[#5856eb] text-white hover:bg-[#3f3cf0] hover:text-white">
              <FileText className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2 hover:cursor-pointer bg-[#5856eb] text-white hover:bg-[#3f3cf0] hover:text-white" >
              <Eye className="h-4 w-4" />
              Pré-visualização
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do Regulamento *</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Regulamento Geral de Funcionamento"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">Nome da Instituição (para pré-visualização)</Label>
                    <Input
                      id="schoolName"
                      placeholder="Ex: Escola Estadual Principal"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o conteúdo do regulamento em poucas linhas"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Logo da Instituição</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="flex-1"
                      />
                      <Upload className="h-4 w-4 text-slate-500" />
                    </div>
                    {logoPreview && (
                      <div className="mt-2">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          className="h-12 w-12 object-contain"
                          width={48}
                          height={48}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do Regulamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">
                    Conteúdo Principal *
                  </Label>
                  <Textarea
                    id="content"
                    placeholder="Digite ou cole o conteúdo completo do regulamento..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    Dica: Use formatação clara com títulos, seções numeradas e
                    artigos bem definidos para melhor legibilidade do
                    regulamento.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Link href="/schoolRules">
                <Button variant="outline" disabled={isSubmitting} className='hover:cursor-pointer rounded-full bg-red-800 hover:bg-red-700 text-white hover:text-white'>
                  Cancelar
                </Button>
              </Link>
              <Button variant="outline" disabled={isSubmitting} onClick={handleSave} className='hover:cursor-pointer rounded-full bg-blue-800 text-white hover:bg-[#1b5edb] hover:text-white'>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Guardar como Rascunho
              </Button>
              <Button disabled={isSubmitting} onClick={handlePublish} className="gap-2 rounded-full hover:cursor-pointer bg-green-700 hover:bg-green-600 hover:text-white">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                Publicar Regulamento
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  {logoPreview && (
                    <Image
                      src={logoPreview}
                      alt="Logo"
                      className="h-16 w-16 object-contain"
                      width={64}
                      height={64}
                    />
                  )}
                  <div className="text-right">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {schoolName || 'Nome da Instituição'}
                    </h1>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  {title || 'Título do Regulamento'}
                </h2>
                {description && (
                  <p className="text-slate-600 mb-6 italic">
                    {description}
                  </p>
                )}

                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                    {content || (
                      <span className="text-slate-400">
                        O conteúdo do regulamento aparecerá aqui...
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
                  <p>Este documento foi gerado automaticamente</p>
                  <p>
                    Data: {new Date().toLocaleDateString('pt-PT')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
