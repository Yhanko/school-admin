"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Users, Plus, Sparkles, Loader2, Trash2 } from "@/lib/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";

interface EventEntity {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  organizer: string;
  location: string;
  participants: number;
}

export default function NewEvent() {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    type: "event",
    organizer: "",
    location: "",
    participants: 0,
  });

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error("Erro ao buscar eventos", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location || !formData.organizer) {
        toast({ title: 'Aviso', description: 'Por favor, preencha todos os campos obrigatórios.', variant: 'destructive' });
        return;
    }

    setIsSubmitting(true);
    try {
        await axiosInstance.post('/events', {
            ...formData,
            participants: Number(formData.participants)
        });
        toast({ title: 'Sucesso', description: 'Atividade criada com sucesso!' });
        setFormData({ title: "", description: "", date: "", type: "event", organizer: "", location: "", participants: 0 });
        fetchEvents();
    } catch (error: any) {
        toast({ title: 'Erro', description: error.response?.data?.message || 'Falha ao criar atividade.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja apagar esta atividade?')) return;
    try {
        await axiosInstance.delete(`/events/${id}`);
        toast({ title: 'Sucesso', description: 'Atividade apagada com sucesso.' });
        fetchEvents();
    } catch (error: any) {
        toast({ title: 'Erro', description: error.response?.data?.message || 'Falha ao apagar.', variant: 'destructive' });
    }
  };

  const typeColors: Record<string, string> = {
    event: "bg-primary/10 text-primary border-primary/20",
    activity: "bg-secondary/10 text-secondary border-secondary/20",
    meeting: "bg-accent/10 text-accent border-accent/20",
    holiday: "bg-muted text-muted-foreground border-border"
  };

  const typeLabels: Record<string, string> = {
    event: "Evento",
    activity: "Atividade",
    meeting: "Reunião",
    holiday: "Feriado"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#646cffaa] via-[#3b44e4aa] to-[#646cffaa] bg-clip-text text-transparent">
            Atividades e Eventos
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Organize e gerencie todas as atividades escolares em um só lugar
          </p>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
          <CardHeader className="border-b bg-gradient-to-r from-card to-muted/30">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-[#646cffaa]" />
              </div>
              Gestão de Atividades
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Plus className="h-5 w-5 text-[#646cffaa]" />
                  <h4 className="font-semibold text-lg">Criar Nova Atividade</h4>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2 group">
                    <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#646cffaa]" />
                      Título da Atividade *
                    </Label>
                    <Input 
                      id="title" 
                      placeholder="Ex: Feira Cultural 2024" 
                      value={formData.title}
                      onChange={handleChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border hover:border-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#646cffaa]" />
                      Descrição
                    </Label>
                    <Textarea 
                      id="description" 
                      placeholder="Descreva os detalhes da atividade..." 
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border hover:border-primary/50 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-[#646cffaa]" />
                        Data *
                      </Label>
                      <Input 
                        id="date" 
                        type="date" 
                        value={formData.date}
                        onChange={handleChange}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border hover:border-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-medium flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-[#646cffaa]" />
                        Tipo *
                      </Label>
                      <Select value={formData.type} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="event">Evento</SelectItem>
                          <SelectItem value="activity">Atividade</SelectItem>
                          <SelectItem value="meeting">Reunião</SelectItem>
                          <SelectItem value="holiday">Feriado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#646cffaa]" />
                        Local *
                      </Label>
                      <Input 
                        id="location" 
                        placeholder="Local do evento" 
                        value={formData.location}
                        onChange={handleChange}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border hover:border-primary/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organizer" className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-[#646cffaa]" />
                        Organizador *
                      </Label>
                      <Input 
                        id="organizer" 
                        placeholder="Ex: Coordenação" 
                        value={formData.organizer}
                        onChange={handleChange}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border hover:border-primary/50"
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="participants" className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-[#646cffaa]" />
                        Participantes Esperados
                      </Label>
                      <Input 
                        id="participants" 
                        type="number"
                        min="0"
                        value={formData.participants}
                        onChange={handleChange}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border hover:border-primary/50"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-full hover:cursor-pointer bg-[#2d36e9aa] hover:bg-[#2e38f5aa] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold group"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    )}
                    {isSubmitting ? "A criar..." : "Criar Atividade"}
                  </Button>
                </form>
              </div>

              {/* Activities List Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#646cffaa]" />
                    <h4 className="font-semibold text-lg">Atividades Programadas</h4>
                  </div>
                  <Badge variant="secondary" className="font-semibold text-[rgba(39,82,94,0.67)]">
                    {events.length} eventos
                  </Badge>
                </div>
                
                <div className="space-y-4 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
                  {isLoading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">Nenhuma atividade programada.</div>
                  ) : events.map((activity, index) => (
                    <div 
                      key={activity.id} 
                      className="group border rounded-xl p-5 bg-gradient-to-br from-card to-muted/20 hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer animate-fade-in relative"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(activity.id);
                        }}
                      >
                          <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="flex items-start justify-between gap-3 mb-3 pr-8">
                        <h5 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {activity.title}
                        </h5>
                        <Badge 
                          variant="outline" 
                          className={`${typeColors[activity.type] || typeColors.event} font-medium shrink-0 text-green-600`}
                        >
                          {typeLabels[activity.type] || "Evento"}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {activity.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-[#646cffaa]" />
                          <span className="font-medium text-foreground">
                            {new Date(activity.date).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'long', 
                              year: 'numeric',
                              timeZone: 'UTC'
                            })}
                          </span>
                        </div>
                        
                        {activity.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-[#646cffaa]" />
                            <span>{activity.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4 text-[#646cffaa]" />
                            <span>{activity.participants} participantes</span>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                            {activity.organizer}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary-glow));
        }
      `}</style>
    </div>
  );
}