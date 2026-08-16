"use client";

import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User,
  Calendar,
  GraduationCap,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  TrendingUp,
  School,
  Phone,
  Mail,
  MapPin,
  ClipboardList,
} from "@/lib/icons";
import { StudentFullProfile } from "@/types/academic-history";
import { toast } from "sonner";

interface StudentHistoryModalProps {
  student: StudentFullProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentHistoryModal({
  student,
  open,
  onOpenChange,
}: StudentHistoryModalProps) {
  if (!student) return null;

  const formatDate = (date: Date) => {
    return format(new Date(date), "dd/MM/yyyy", { locale: pt });
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 14) return "text-[#2D6A4F] font-bold";
    if (grade >= 10) return "text-[#8B5CF6] font-bold";
    return "text-[#ffb4ab] font-bold";
  };

  const handleGenerateDocument = (
    type: "certificate" | "declaration" | "transcript",
    withGrades: boolean
  ) => {
    const docName =
      type === "certificate"
        ? "Certificado"
        : type === "declaration"
        ? "Declaração"
        : "Pauta de Notas";

    toast.success(
      `${docName} ${withGrades ? "com notas" : "sem notas"} gerado com sucesso!`,
      {
        description: `Documento para ${student.name} está pronto para download.`,
      }
    );
  };

  const totalYears = student.academicHistory.length;
  const passedYears = student.academicHistory.filter((y) => y.passed).length;
  const failedYears = totalYears - passedYears;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] sm:w-[75vw] max-w-5xl max-h-[90vh] overflow-hidden bg-[#1A1A1A] border border-[#C0C2C5] text-[#e5e2e1] font-hanken p-6">
        <DialogHeader className="border-b border-[#414042] pb-3">
          <DialogTitle className="flex items-center gap-2 headline-sm text-[#e5e2e1]">
            <GraduationCap className="h-5 w-5 text-[#8B5CF6]" />
            Histórico Académico • {student.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-4 bg-transparent border-b border-[#414042]">
            <TabsTrigger value="profile" className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Pauta / Notas</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documentos</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] mt-4 pr-3">
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dados Pessoais */}
                <div className="bg-[#121212] border border-[#414042] rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#414042] pb-2">
                    <User className="h-4 w-4 text-[#8B5CF6]" />
                    <h3 className="label-caps text-[#DDD6FE]">Dados Pessoais</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm">
                    <div>
                      <span className="label-caps text-[#9d8f78] block text-[10px]">Nome Completo</span>
                      <p className="font-semibold text-[#e5e2e1]">{student.name}</p>
                    </div>
                    <div>
                      <span className="label-caps text-[#9d8f78] block text-[10px]">Nº de Aluno</span>
                      <p className="font-semibold data-mono text-[#DDD6FE]">#{student.studentNumber}</p>
                    </div>
                    <div>
                      <span className="label-caps text-[#9d8f78] block text-[10px]">Nascimento</span>
                      <p className="font-medium text-[#e5e2e1]">
                        {formatDate(student.birthDate)} ({calculateAge(student.birthDate)} anos)
                      </p>
                    </div>
                    <div>
                      <span className="label-caps text-[#9d8f78] block text-[10px]">Género</span>
                      <p className="font-medium text-[#e5e2e1]">{student.gender === "M" ? "Masculino" : "Feminino"}</p>
                    </div>
                    <div>
                      <span className="label-caps text-[#9d8f78] block text-[10px]">Nacionalidade</span>
                      <p className="font-medium text-[#e5e2e1]">{student.nationality}</p>
                    </div>
                    <div>
                      <span className="label-caps text-[#9d8f78] block text-[10px]">Documento ({student.documentType})</span>
                      <p className="data-mono text-xs text-[#d5c4ac]">{student.documentNumber}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#414042]">
                    <span className="label-caps text-[#9d8f78] block text-[10px] mb-0.5">Morada de Residência</span>
                    <p className="text-xs text-[#e5e2e1] flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#8B5CF6] shrink-0" />
                      {student.address}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-2 border-t border-[#414042]">
                    <div className="flex items-center gap-1.5 text-xs text-[#d5c4ac] data-mono">
                      <Phone className="h-3.5 w-3.5 text-[#9d8f78]" />
                      <span>{student.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#d5c4ac] data-mono">
                      <Mail className="h-3.5 w-3.5 text-[#9d8f78]" />
                      <span>{student.email}</span>
                    </div>
                  </div>
                </div>

                {/* Dados Escolares */}
                <div className="bg-[#121212] border border-[#414042] rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#414042] pb-2">
                    <School className="h-4 w-4 text-[#8B5CF6]" />
                    <h3 className="label-caps text-[#DDD6FE]">Dados Escolares</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm">
                    <div>
                      <span className="label-caps text-[#9d8f78] block text-[10px]">Instituição Atual</span>
                      <p className="font-semibold text-[#e5e2e1]">{student.currentSchool}</p>
                    </div>
                    <div>
                      <span className="label-caps text-[#9d8f78] block text-[10px]">Classe / Turma</span>
                      <p className="font-semibold text-[#DDD6FE] data-mono">{student.currentGrade} - {student.currentClass}</p>
                    </div>
                    <div>
                      <span className="label-caps text-[#9d8f78] block text-[10px]">Data de Matrícula</span>
                      <p className="font-medium text-[#e5e2e1] data-mono">{formatDate(student.enrollmentDate)}</p>
                    </div>
                    <div>
                      <span className="label-caps text-[#9d8f78] block text-[10px]">Anos na Escola</span>
                      <p className="font-semibold text-[#e5e2e1]">{totalYears} Anos Letivos</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#414042]">
                    <span className="label-caps text-[#9d8f78] block text-[10px] mb-0.5">Encarregado de Educação</span>
                    <p className="font-semibold text-xs sm:text-sm text-[#e5e2e1]">{student.parentName}</p>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#d5c4ac] data-mono">
                        <Phone className="h-3.5 w-3.5 text-[#9d8f78]" />
                        <span>{student.parentPhone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#d5c4ac] data-mono">
                        <Mail className="h-3.5 w-3.5 text-[#9d8f78]" />
                        <span>{student.parentEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumo Académico */}
                <div className="md:col-span-2 bg-[#121212] border border-[#414042] rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#414042] pb-2">
                    <TrendingUp className="h-4 w-4 text-[#8B5CF6]" />
                    <h3 className="label-caps text-[#DDD6FE]">Resumo Global de Desempenho</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-[#1c1b1b] border border-[#414042] rounded">
                      <p className="text-2xl font-bold text-[#DDD6FE] data-mono">{totalYears}</p>
                      <p className="label-caps text-[10px] text-[#9d8f78] mt-1">Anos Letivos</p>
                    </div>
                    <div className="text-center p-3 bg-[#1c1b1b] border border-[#414042] rounded">
                      <p className="text-2xl font-bold text-[#2D6A4F] data-mono">{passedYears}</p>
                      <p className="label-caps text-[10px] text-[#9d8f78] mt-1">Aprovações</p>
                    </div>
                    <div className="text-center p-3 bg-[#1c1b1b] border border-[#414042] rounded">
                      <p className="text-2xl font-bold text-[#ffb4ab] data-mono">{failedYears}</p>
                      <p className="label-caps text-[10px] text-[#9d8f78] mt-1">Reprovações</p>
                    </div>
                    <div className="text-center p-3 bg-[#1c1b1b] border border-[#414042] rounded">
                      <p className="text-2xl font-bold text-[#8B5CF6] data-mono">
                        {student.academicHistory[0]?.average.toFixed(1) || "N/A"}
                      </p>
                      <p className="label-caps text-[10px] text-[#9d8f78] mt-1">Média Atual</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-3">
              {student.academicHistory.map((year) => (
                <div
                  key={`${year.year}-${year.grade}`}
                  className={`bg-[#121212] border rounded-lg p-4 space-y-3 ${
                    !year.passed ? "border-[#9B2226]" : "border-[#414042]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#414042] pb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-full ${year.passed ? "bg-[#2D6A4F]/20 text-[#2D6A4F]" : "bg-[#9B2226]/20 text-[#ffb4ab]"}`}>
                        {year.passed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#e5e2e1] text-sm">
                          {year.year} • {year.grade}
                        </h4>
                        <p className="text-xs text-[#d5c4ac]">
                          {year.school} • Turma {year.class}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={year.passed ? "bg-[#2D6A4F] text-[#e5e2e1]" : "bg-[#9B2226] text-[#e5e2e1]"}>
                        {year.passed ? "Aprovado" : "Reprovado"}
                      </Badge>
                      <span className="bg-[#1c1b1b] border border-[#414042] px-2.5 py-0.5 rounded text-xs data-mono text-[#DDD6FE]">
                        Média: {year.average.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="label-caps text-[#9d8f78] block text-[10px]">Assiduidade</span>
                      <p className="font-semibold text-[#e5e2e1] data-mono">{year.attendanceRate}%</p>
                    </div>
                    <div>
                      <span className="label-caps text-[#9d8f78] block text-[10px]">Aulas Assistidas</span>
                      <p className="font-semibold text-[#e5e2e1] data-mono">{year.attendedClasses}/{year.totalClasses}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="label-caps text-[#9d8f78] block text-[10px]">Observações</span>
                      <p className="text-[#d5c4ac]">{year.observations}</p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Grades Tab */}
            <TabsContent value="grades" className="space-y-3">
              <Accordion type="single" collapsible className="space-y-2">
                {student.academicHistory.map((year) => (
                  <AccordionItem
                    key={`grades-${year.year}-${year.grade}`}
                    value={`${year.year}-${year.grade}`}
                    className="border border-[#414042] bg-[#121212] rounded px-4"
                  >
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center gap-3 text-xs sm:text-sm">
                        <span className={`px-2 py-0.5 rounded font-bold ${year.passed ? "bg-[#2D6A4F] text-white" : "bg-[#9B2226] text-white"}`}>
                          {year.year}
                        </span>
                        <span className="font-bold text-[#e5e2e1]">{year.grade}</span>
                        <span className="text-[#9d8f78]">•</span>
                        <span className={`data-mono ${getGradeColor(year.average)}`}>
                          Média: {year.average.toFixed(1)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-1">
                      <div className="rounded border border-[#414042] overflow-hidden">
                        <Table>
                          <TableHeader className="bg-[#1c1b1b]">
                            <TableRow className="border-b border-[#414042]">
                              <TableHead className="label-caps text-[#d5c4ac]">Disciplina</TableHead>
                              <TableHead className="text-center label-caps text-[#d5c4ac]">1º Trim.</TableHead>
                              <TableHead className="text-center label-caps text-[#d5c4ac]">2º Trim.</TableHead>
                              <TableHead className="text-center label-caps text-[#d5c4ac]">3º Trim.</TableHead>
                              <TableHead className="text-center label-caps text-[#d5c4ac]">Final</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="divide-y divide-[#414042]/50 bg-[#121212]">
                            {year.subjects.map((subject) => (
                              <TableRow key={subject.subject} className="hover:bg-[#1A1A1A]">
                                <TableCell className="font-semibold text-xs text-[#e5e2e1]">{subject.subject}</TableCell>
                                <TableCell className={`text-center data-mono text-xs ${getGradeColor(subject.firstTerm)}`}>
                                  {subject.firstTerm}
                                </TableCell>
                                <TableCell className={`text-center data-mono text-xs ${getGradeColor(subject.secondTerm)}`}>
                                  {subject.secondTerm}
                                </TableCell>
                                <TableCell className={`text-center data-mono text-xs ${getGradeColor(subject.thirdTerm)}`}>
                                  {subject.thirdTerm}
                                </TableCell>
                                <TableCell className={`text-center font-bold data-mono text-xs ${getGradeColor(subject.finalGrade)}`}>
                                  {subject.finalGrade}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <div className="bg-[#121212] border border-[#414042] rounded-lg p-5 space-y-4">
                <div className="border-b border-[#414042] pb-2">
                  <h3 className="label-caps text-[#DDD6FE]">Emissão de Documentação Oficial</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2.5 p-3 bg-[#1c1b1b] border border-[#414042] rounded">
                    <h4 className="label-caps text-[#d5c4ac]">Certificados</h4>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleGenerateDocument("certificate", true)}
                        className="justify-start border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#201f1f] text-xs"
                      >
                        <Download className="h-3.5 w-3.5 mr-2 text-[#8B5CF6]" />
                        Com Notas
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleGenerateDocument("certificate", false)}
                        className="justify-start border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#201f1f] text-xs"
                      >
                        <Download className="h-3.5 w-3.5 mr-2 text-[#8B5CF6]" />
                        Sem Notas
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2.5 p-3 bg-[#1c1b1b] border border-[#414042] rounded">
                    <h4 className="label-caps text-[#d5c4ac]">Declarações</h4>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleGenerateDocument("declaration", true)}
                        className="justify-start border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#201f1f] text-xs"
                      >
                        <Download className="h-3.5 w-3.5 mr-2 text-[#8B5CF6]" />
                        Com Notas
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleGenerateDocument("declaration", false)}
                        className="justify-start border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#201f1f] text-xs"
                      >
                        <Download className="h-3.5 w-3.5 mr-2 text-[#8B5CF6]" />
                        Sem Notas
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2.5 p-3 bg-[#1c1b1b] border border-[#414042] rounded">
                    <h4 className="label-caps text-[#d5c4ac]">Pautas & Extratos</h4>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleGenerateDocument("transcript", true)}
                        className="justify-start border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#201f1f] text-xs"
                      >
                        <Download className="h-3.5 w-3.5 mr-2 text-[#8B5CF6]" />
                        Pauta Geral
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => toast.info("Histórico em atualização no servidor")}
                        className="justify-start border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#201f1f] text-xs opacity-75"
                      >
                        <FileText className="h-3.5 w-3.5 mr-2 text-[#C0C2C5]" />
                        Folha de Matrícula
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}