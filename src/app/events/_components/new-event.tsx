"use client"
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Users, Plus, Sparkles, Loader2 } from "@/lib/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";

interface NewEventModalProps {
  onSuccess: () => void;
}

export function NewEventModal({ onSuccess }: NewEventModalProps) {
  const [open, setOpen] = useState(false);
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
        setOpen(false);
        onSuccess();
    } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast({ title: 'Erro', description: err.response?.data?.message || 'Falha ao criar atividade.', variant: 'destructive' });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#6366f1] hover:bg-[#5856eb] text-white rounded-full px-4 py-2 hover:cursor-pointer">
          <Plus className="mr-2 h-4 w-4" />
          New events
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-[#303972]">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-6 w-6 text-[#646cffaa]" />
            </div>
            Criar Nova Atividade
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
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
            className="w-full h-12 rounded-full hover:cursor-pointer bg-[#2d36e9aa] hover:bg-[#2e38f5aa] hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold group mt-4"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            )}
            {isSubmitting ? "A criar..." : "Criar Atividade"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
