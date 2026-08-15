"use client";
//import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Printer,
  CheckCircle,
  XCircle,
  TrendingUp,
  School,
  Phone,
  Mail,
  MapPin,
  ClipboardList,
} from "@/lib/icons";
import { StudentFullProfile, } from "@/types/academic-history";
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
  //const [selectedYear, setSelectedYear] = useState<string | null>(null);

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
    if (grade >= 14) return "text-emerald-600 dark:text-emerald-400";
    if (grade >= 10) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const handleGenerateDocument = (type: "certificate" | "declaration" | "transcript", withGrades: boolean) => {
    const docName = type === "certificate" 
      ? "Certificado" 
      : type === "declaration" 
        ? "Declaração" 
        : "Pauta de Notas";
    
    toast.success(`${docName} ${withGrades ? "com notas" : "sem notas"} gerado com sucesso!`, {
      description: `Documento para ${student.name} está pronto para download.`,
    });
  };

  const totalYears = student.academicHistory.length;
  const passedYears = student.academicHistory.filter((y) => y.passed).length;
  const failedYears = totalYears - passedYears;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[70vw] max-w-none max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <GraduationCap className="h-6 w-6" />
            Histórico Académico - {student.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-1 hover:cursor-pointer">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1 hover:cursor-pointer">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="grades" className="flex items-center gap-1 hover:cursor-pointer">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Notas</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-1 hover:cursor-pointer">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documentos</span>
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] mt-4">
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Dados Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Nome Completo:</span>
                        <p className="font-medium">{student.name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Nº de Aluno:</span>
                        <p className="font-medium">{student.studentNumber}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Data de Nascimento:</span>
                        <p className="font-medium">
                          {formatDate(student.birthDate)} ({calculateAge(student.birthDate)} anos)
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Género:</span>
                        <p className="font-medium">{student.gender === "M" ? "Masculino" : "Feminino"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Nacionalidade:</span>
                        <p className="font-medium">{student.nationality}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Documento:</span>
                        <p className="font-medium">{student.documentType}</p>
                        <p className="text-xs text-muted-foreground">{student.documentNumber}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>Morada:</span>
                      </div>
                      <p className="font-medium">{student.address}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{student.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{student.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <School className="h-4 w-4" />
                      Dados Escolares
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Escola Atual:</span>
                        <p className="font-medium">{student.currentSchool}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Classe/Turma:</span>
                        <p className="font-medium">{student.currentGrade} - {student.currentClass}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Data de Matrícula:</span>
                        <p className="font-medium">{formatDate(student.enrollmentDate)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Anos na Instituição:</span>
                        <p className="font-medium">{totalYears} anos</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground">Encarregado de Educação:</span>
                      <p className="font-medium">{student.parentName}</p>
                      <div className="flex flex-wrap gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{student.parentPhone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{student.parentEmail}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Resumo Académico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-xl">
                        <p className="text-2xl font-bold text-primary">{totalYears}</p>
                        <p className="text-xs text-muted-foreground">Anos Letivos</p>
                      </div>
                      <div className="text-center p-3 bg-emerald-500/10 rounded-xl">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{passedYears}</p>
                        <p className="text-xs text-muted-foreground">Aprovações</p>
                      </div>
                      <div className="text-center p-3 bg-red-500/10 rounded-xl">
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{failedYears}</p>
                        <p className="text-xs text-muted-foreground">Reprovações</p>
                      </div>
                      <div className="text-center p-3 bg-primary/10 rounded-xl">
                        <p className="text-2xl font-bold text-primary dark:text-blue-400">
                          {student.academicHistory[0]?.average.toFixed(1) || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">Média Atual</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <div className="space-y-2">
                {student.academicHistory.map((year) => (
                  <Card key={`${year.year}-${year.grade}`} className={`transition-all ${!year.passed ? "border-red-500/50" : ""}`}>
                    <CardHeader className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${year.passed ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
                            {year.passed ? (
                              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {year.year} - {year.grade}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {year.school} • Turma {year.class}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={year.passed ? "default" : "destructive"}>
                            {year.passed ? "Aprovado" : "Reprovado"}
                          </Badge>
                          <Badge variant="outline" className={getGradeColor(year.average)}>
                            Média: {year.average.toFixed(1)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Assiduidade:</span>
                          <p className="font-medium">{year.attendanceRate}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Aulas Assistidas:</span>
                          <p className="font-medium">{year.attendedClasses}/{year.totalClasses}</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-muted-foreground">Observações:</span>
                          <p className="font-medium">{year.observations}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Grades Tab */}
            <TabsContent value="grades" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-2">
                {student.academicHistory.map((year) => (
                  <AccordionItem
                    key={`grades-${year.year}-${year.grade}`}
                    value={`${year.year}-${year.grade}`}
                    className="border rounded-xl px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Badge variant={year.passed ? "default" : "destructive"}>
                          {year.year}
                        </Badge>
                        <span className="font-medium">{year.grade}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className={`font-semibold ${getGradeColor(year.average)}`}>
                          Média: {year.average.toFixed(1)}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Disciplina</TableHead>
                            <TableHead className="text-center">1º Trim.</TableHead>
                            <TableHead className="text-center">2º Trim.</TableHead>
                            <TableHead className="text-center">3º Trim.</TableHead>
                            <TableHead className="text-center">Final</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {year.subjects.map((subject) => (
                            <TableRow key={subject.subject}>
                              <TableCell className="font-medium">{subject.subject}</TableCell>
                              <TableCell className={`text-center ${getGradeColor(subject.firstTerm)}`}>
                                {subject.firstTerm}
                              </TableCell>
                              <TableCell className={`text-center ${getGradeColor(subject.secondTerm)}`}>
                                {subject.secondTerm}
                              </TableCell>
                              <TableCell className={`text-center ${getGradeColor(subject.thirdTerm)}`}>
                                {subject.thirdTerm}
                              </TableCell>
                              <TableCell className={`text-center font-bold ${getGradeColor(subject.finalGrade)}`}>
                                {subject.finalGrade}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Gerar Novos Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Certificados</h4>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateDocument("certificate", true)}
                          className="justify-start hover:cursor-pointer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Com Notas
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateDocument("certificate", false)}
                          className="justify-start hover:cursor-pointer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Sem Notas
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Declarações</h4>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateDocument("declaration", true)}
                          className="justify-start hover:cursor-pointer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Com Notas
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateDocument("declaration", false)}
                          className="justify-start hover:cursor-pointer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Sem Notas
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Pautas</h4>
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateDocument("transcript", true)}
                          className="justify-start hover:cursor-pointer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Pauta de Notas
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info("Funcionalidade em desenvolvimento")}
                          className="justify-start hover:cursor-pointer"
                        >
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimir
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Documentos Emitidos</CardTitle>
                </CardHeader>
                <CardContent>
                  {student.issuedDocuments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Documento</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Data de Emissão</TableHead>
                          <TableHead>Notas</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {student.issuedDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {doc.type === "certificate"
                                  ? "Certificado"
                                  : doc.type === "declaration"
                                  ? "Declaração"
                                  : "Pauta"}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(doc.issuedDate)}</TableCell>
                            <TableCell>
                              <Badge variant={doc.withGrades ? "default" : "secondary"}>
                                {doc.withGrades ? "Com Notas" : "Sem Notas"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast.success("Download iniciado!")}
                                className="hover:cursor-pointer"
                              >
                                <Download className="h-4 w-4 hover:cursor-pointer" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum documento emitido ainda.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}