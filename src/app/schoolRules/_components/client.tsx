'use client';

import { useState, useEffect } from 'react';
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
import {
  FileText,
  Download,
  Share2,
  Eye,
  Trash2,
  Users,
  GraduationCap,
  Briefcase,
} from '@/lib/icons';
import Link from 'next/link';
import axiosInstance from '@/service/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Regulation {
  id: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
}

export function RegulationsClient() {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareDialog, setShareDialog] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRegulations = async () => {
    try {
      const response = await axiosInstance.get('/regulations');
      setRegulations(response.data);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao carregar regulamentos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegulations();
  }, []);

  const shareOptions = [
    { icon: Users, label: 'Encarregados de Educação', color: 'text-blue-600' },
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
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao apagar regulamento',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <Link href="/new-rule">
              <Button>Criar Regulamento</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regulations.map((regulation) => (
            <Card
              key={regulation.id}
              className="hover:shadow-lg transition-shadow flex flex-col"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-8 w-8 text-blue-600" />
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
                  <Link href={`/regulamentos/${regulation.id}`}>
                    <Button size="sm" variant="outline" className="gap-2 hover:cursor-pointer">
                      <Eye className="h-4 w-4" />
                      Ver
                    </Button>
                  </Link>

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
                    onClick={() =>
                      toast({ title: 'Download', description: 'O regulamento foi baixado em PDF.' })
                    }
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