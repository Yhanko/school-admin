'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Download,
  Share2,
  Users,
  GraduationCap,
  Briefcase,
} from '@/lib/icons';
import Image from 'next/image';

const SAMPLE_CONTENT = `REGULAMENTO GERAL DE FUNCIONAMENTO

CAPÍTULO I - DISPOSIÇÕES GERAIS

Art. 1º - Este regulamento estabelece as normas gerais de funcionamento da Escola Estadual Principal, visando assegurar o cumprimento de suas finalidades educacionais.

Art. 2º - A escola funciona em regime de ciclos, funcionando em períodos matutino, vespertino e noturno, conforme calendário escolar aprovado anualmente.

Art. 3º - São objetivos da instituição:
   I. Promover educação de qualidade e inclusiva;
   II. Desenvolver competências cognitivas e socioemocionais;
   III. Preparar cidadãos para participação ativa na sociedade.

CAPÍTULO II - DIREITOS E DEVERES DOS ALUNOS

Art. 4º - Todo aluno tem direito a:
   I. Educação de qualidade centrada no desenvolvimento integral;
   II. Ambiente acolhedor e seguro;
   III. Participação em atividades culturais e desportivas;
   IV. Avaliação justa e transparente.

Art. 5º - São deveres do aluno:
   I. Frequentar regularmente as aulas;
   II. Cumprir as normas de disciplina;
   III. Respeitar professores, colegas e funcionários;
   IV. Zelar pelo patrimônio escolar.

CAPÍTULO III - FREQUÊNCIA E ASSIDUIDADE

Art. 6º - A frequência mínima exigida é de 75% do total de aulas dadas no período.

Art. 7º - As faltas devem ser devidamente justificadas pelos encarregados de educação no prazo de 48 horas.

CAPÍTULO IV - AVALIAÇÃO

Art. 8º - A avaliação é contínua, observando-se os seguintes critérios:
   I. Participação em atividades propostas;
   II. Realização de trabalhos individuais e em grupo;
   III. Provas e testes periódicos.

Art. 9º - A nota mínima para aprovação é 10 valores (escala de 0-20).

CAPÍTULO V - DISPOSIÇÕES FINAIS

Art. 10º - Este regulamento entra em vigor a partir de sua publicação e permanece em vigor enquanto não revogado ou alterado.`;

interface RegulationDetailContentProps {
  regulationId: string;
  regulation: {
    id: string;
    title: string;
    schoolName: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
    logo?: string;
  };
}

const shareOptions = [
  { icon: Users, label: 'Encarregados de Educação', color: 'text-primary' },
  { icon: GraduationCap, label: 'Educandos', color: 'text-purple-600' },
  { icon: Users, label: 'Professores', color: 'text-green-600' },
  { icon: Briefcase, label: 'Funcionários', color: 'text-orange-600' },
];

export function RegulationDetailContent({
  regulationId,
  regulation,
}: RegulationDetailContentProps) {
  const [shareDialog, setShareDialog] = useState(false);

  return (
    <>
      <div className="flex gap-4 mb-8">
        <Dialog open={shareDialog} onOpenChange={setShareDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Share2 className="h-4 w-4" />
              Partilhar Regulamento {regulationId}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Partilhar com</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {shareOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => {
                      alert(
                        `Regulamento compartilhado com ${option.label}`
                      );
                      setShareDialog(false);
                    }}
                  >
                    <Icon className={`h-5 w-5 ${option.color}`} />
                    <div className="text-left">
                      <p className="font-medium">{option.label}</p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          className="gap-2"
          onClick={() => alert('Regulamento baixado em formato PDF')}
        >
          <Download className="h-4 w-4" />
          Descarregar PDF
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              {regulation.logo && (
                <Image
                  src={regulation.logo}
                  alt="Logo"
                  className="h-20 w-20 object-contain mb-4"
                />
              )}
              <h2 className="text-2xl font-bold text-slate-900">
                {regulation.schoolName}
              </h2>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {regulation.title}
            </h3>
            <p className="text-slate-600 italic">
              {regulation.description}
            </p>
          </div>

          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans text-base">
            {SAMPLE_CONTENT}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-8 text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900 mb-1">
                  Data de Criação
                </p>
                <p>{new Date(regulation.created_at).toLocaleDateString('pt-PT')}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-1">
                  Última Atualização
                </p>
                <p>{new Date(regulation.updated_at).toLocaleDateString('pt-PT')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-slate-900 mb-4">
            Partilhas Realizadas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shareOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div
                  key={index}
                  className="p-4 bg-card rounded border text-center"
                >
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${option.color}`} />
                  <p className="text-sm font-medium text-slate-900">
                    {option.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    ✓ Partilhado
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}