import { useState } from "react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  Send, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Star,
  Clock
} from "@/lib/icons";
import { ChatMessage, Assessment, Student } from "@/types/school-system";

interface ParentDashboardProps {
  parentId: string;
  student: Student;
}

export function ParentDashboard  ({ parentId, student }: ParentDashboardProps) {
  const [newMessage, setNewMessage] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const messageSchema = z.object({
    selectedTeacher: z.string().min(1, "Selecione um professor"),
    newMessage: z.string().trim().min(1, "A mensagem não pode estar vazia").max(2000, "Mensagem demasiado longa").regex(/^[^<>';=]*$/, "Caracteres inválidos (Não use < > ' ; =)")
  });

  // Mock data para demonstração
  const [chatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "t1",
      senderName: "Prof. Ana Silva",
      senderRole: "professor",
      recipientId: parentId,
      message: "Gostaria de conversar sobre o desempenho do João em Matemática.",
      timestamp: new Date("2024-02-15T10:30:00"),
      read: true
    },
    {
      id: "2",
      senderId: parentId,
      senderName: "Sr. Santos",
      senderRole: "encarregado_educacao",
      recipientId: "t1",
      message: "Obrigado pela atenção. Estou disponível para conversar.",
      timestamp: new Date("2024-02-15T14:20:00"),
      read: true
    },
    {
      id: "3",
      senderId: "t2",
      senderName: "Prof. Carlos Costa",
      senderRole: "professor",
      recipientId: parentId,
      message: "O João tem mostrado ótimo progresso em Português!",
      timestamp: new Date("2024-02-16T09:15:00"),
      read: false
    }
  ]);

  const [assessments] = useState<Assessment[]>([
    {
      id: "1",
      studentId: student.id,
      subject: "Matemática",
      type: "test",
      title: "Teste de Álgebra",
      score: 15,
      maxScore: 20,
      percentage: 75,
      date: new Date("2024-02-10"),
      teacherId: "t1",
      teacherName: "Prof. Ana Silva",
      comments: "Bom desempenho, mas precisa praticar mais as equações do segundo grau."
    },
    {
      id: "2",
      studentId: student.id,
      subject: "Português",
      type: "assignment",
      title: "Redação - Texto Argumentativo",
      score: 18,
      maxScore: 20,
      percentage: 90,
      date: new Date("2024-02-12"),
      teacherId: "t2",
      teacherName: "Prof. Carlos Costa",
      comments: "Excelente estruturação do texto e argumentação sólida."
    },
    {
      id: "3",
      studentId: student.id,
      subject: "Ciências",
      type: "project",
      title: "Projeto Sistema Solar",
      score: 16,
      maxScore: 20,
      percentage: 80,
      date: new Date("2024-02-14"),
      teacherId: "t3",
      teacherName: "Prof. Maria Fernandes",
      comments: "Criatividade na apresentação e boa pesquisa científica."
    }
  ]);

  const teachers = [
    { id: "t1", name: "Prof. Ana Silva", subject: "Matemática" },
    { id: "t2", name: "Prof. Carlos Costa", subject: "Português" },
    { id: "t3", name: "Prof. Maria Fernandes", subject: "Ciências" }
  ];

  const handleSendMessage = () => {
    try {
      messageSchema.parse({ selectedTeacher, newMessage });
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

    console.log("Enviando mensagem:", newMessage, "para:", selectedTeacher);
    setNewMessage("");
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 80) return "default";
    if (percentage >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-muted p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card rounded shadow-xs p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Painel do Encarregado</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Acompanhamento do aluno: {student.name} - {student.class}
              </p>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 rounded">
              Encarregado de Educação
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(assessments.reduce((acc, ass) => acc + ass.percentage, 0) / assessments.length).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Baseado em {assessments.length} avaliações
              </p>
            </CardContent>
          </Card>

          <Card className="rounded border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {chatMessages.filter(msg => !msg.read && msg.senderId !== parentId).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Não lidas
              </p>
            </CardContent>
          </Card>

          <Card className="rounded border border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Avaliação</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assessments[assessments.length - 1]?.percentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                {assessments[assessments.length - 1]?.subject}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 rounded border border-border">
            <TabsTrigger value="chat" className="rounded">Comunicação com Professores</TabsTrigger>
            <TabsTrigger value="assessments" className="rounded">Avaliações do Aluno</TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chat Messages */}
              <Card className="h-[600px] flex flex-col rounded border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageCircle className="h-5 w-5" />
                    Mensagens Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === parentId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded ${
                        message.senderId === parentId
                          ? 'bg-primary text-white'
                          : 'bg-muted text-foreground'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.senderName}
                          </span>
                          {!message.read && message.senderId !== parentId && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === parentId ? 'text-purple-100' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* New Message */}
              <Card className="h-[600px] flex flex-col rounded border border-border">
                <CardHeader>
                  <CardTitle className="text-base">Nova Mensagem</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Professor:</label>
                    <select
                      value={selectedTeacher}
                      onChange={(e) => { setSelectedTeacher(e.target.value); if(errors.selectedTeacher) setErrors(prev => ({...prev, selectedTeacher: ""})); }}
                      className={`w-full p-2 border rounded text-sm bg-card ${errors.selectedTeacher ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200' : 'border-border'}`}
                    >
                      <option value="">Selecionar professor...</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name} - {teacher.subject}
                        </option>
                      ))}
                    </select>
                    {errors.selectedTeacher && <p className="text-red-500 text-xs">{errors.selectedTeacher}</p>}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium">Mensagem:</label>
                    <Textarea
                      value={newMessage}
                      onChange={(e) => { setNewMessage(e.target.value); if(errors.newMessage) setErrors(prev => ({...prev, newMessage: ""})); }}
                      placeholder="Digite sua mensagem..."
                      className={`h-32 resize-none ${errors.newMessage ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200' : ''}`}
                    />
                    {errors.newMessage && <p className="text-red-500 text-xs">{errors.newMessage}</p>}
                  </div>
                  
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !selectedTeacher}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Avaliações do Aluno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="border rounded p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{assessment.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{assessment.subject}</Badge>
                            <Badge variant="secondary">{assessment.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Professor: {assessment.teacherName}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <Badge variant={getScoreBadgeVariant(assessment.percentage)}>
                              {assessment.percentage}%
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {assessment.score}/{assessment.maxScore}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {assessment.date.toLocaleDateString()}
                      </div>
                      
                      {assessment.comments && (
                        <div className="bg-muted rounded p-3">
                          <p className="text-sm font-medium mb-1">Comentários do Professor:</p>
                          <p className="text-sm text-foreground">{assessment.comments}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="rounded border border-border">
              <CardHeader>
                <CardTitle>Resumo de Desempenho por Disciplina</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Matemática", "Português", "Ciências"].map((subject) => {
                    const subjectAssessments = assessments.filter(a => a.subject === subject);
                    const average = subjectAssessments.length > 0
                      ? subjectAssessments.reduce((acc, a) => acc + a.percentage, 0) / subjectAssessments.length
                      : 0;
                    
                    return (
                      <div key={subject} className="text-center p-4 border rounded">
                        <h4 className="font-medium">{subject}</h4>
                        <div className={`text-2xl font-bold ${getScoreColor(average)}`}>
                          {average.toFixed(1)}%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {subjectAssessments.length} avaliações
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
