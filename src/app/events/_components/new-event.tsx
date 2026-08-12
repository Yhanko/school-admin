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
        <Button className="bg-[#FF5777] hover:bg-[#fc4667] text-white rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold cursor-pointer shadow-sm transition-all flex items-center gap-1.5">
          <Plus className="h-4 w-4" />
          <span>Novo Evento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[550px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-white">
        <DialogHeader className="p-4 sm:p-5 border-b border-gray-100 bg-gray-50/80 shrink-0">
          <DialogTitle className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-gray-900">
            <div className="p-2 rounded-xl bg-purple-100 text-[#4D44B5]">
              <Calendar className="h-5 w-5" />
            </div>
            <span>Criar Nova Atividade</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[calc(90vh-100px)]">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#4D44B5]" />
              Título da Atividade *
            </Label>
            <Input 
              id="title" 
              placeholder="Ex: Feira Cultural 2026" 
              value={formData.title}
              onChange={handleChange}
              className="bg-white border-2 border-gray-200 rounded-xl h-11 text-xs sm:text-sm text-gray-800 focus:border-[#4D44B5] focus-visible:ring-0"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#4D44B5]" />
              Descrição
            </Label>
            <Textarea 
              id="description" 
              placeholder="Descreva os detalhes da atividade..." 
              rows={2}
              value={formData.description}
              onChange={handleChange}
              className="bg-white border-2 border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 focus:border-[#4D44B5] focus-visible:ring-0 resize-none p-3"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="date" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#4D44B5]" />
                Data *
              </Label>
              <Input 
                id="date" 
                type="date" 
                value={formData.date}
                onChange={handleChange}
                className="bg-white border-2 border-gray-200 rounded-xl h-11 text-xs sm:text-sm text-gray-800 focus:border-[#4D44B5] focus-visible:ring-0"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#4D44B5]" />
                Tipo *
              </Label>
              <Select value={formData.type} onValueChange={handleSelectChange}>
                <SelectTrigger className="bg-white border-2 border-gray-200 rounded-xl h-11 text-xs sm:text-sm text-gray-800 focus:border-[#4D44B5]">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="event" className="cursor-pointer text-xs font-medium">Evento</SelectItem>
                  <SelectItem value="activity" className="cursor-pointer text-xs font-medium">Atividade</SelectItem>
                  <SelectItem value="meeting" className="cursor-pointer text-xs font-medium">Reunião</SelectItem>
                  <SelectItem value="holiday" className="cursor-pointer text-xs font-medium">Feriado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#4D44B5]" />
                Local *
              </Label>
              <Input 
                id="location" 
                placeholder="Ex: Auditório Principal" 
                value={formData.location}
                onChange={handleChange}
                className="bg-white border-2 border-gray-200 rounded-xl h-11 text-xs sm:text-sm text-gray-800 focus:border-[#4D44B5] focus-visible:ring-0"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="organizer" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#4D44B5]" />
                Organizador *
              </Label>
              <Input 
                id="organizer" 
                placeholder="Ex: Direção Pedagógica" 
                value={formData.organizer}
                onChange={handleChange}
                className="bg-white border-2 border-gray-200 rounded-xl h-11 text-xs sm:text-sm text-gray-800 focus:border-[#4D44B5] focus-visible:ring-0"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="participants" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#4D44B5]" />
                Participantes Esperados
              </Label>
              <Input 
                id="participants" 
                type="number"
                min="0"
                value={formData.participants}
                onChange={handleChange}
                className="bg-white border-2 border-gray-200 rounded-xl h-11 text-xs sm:text-sm text-gray-800 focus:border-[#4D44B5] focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="pt-2 pb-2">
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-[#4D44B5] hover:bg-[#3d3695] text-white font-semibold text-xs sm:text-sm cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isSubmitting ? "A criar..." : "Criar Atividade"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
