"use client";

import { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Users, Plus, Sparkles, Loader2 } from "@/lib/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";

const safeStringRegex = /^[^<>';=]*$/;

const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "O título é obrigatório")
    .max(100, "Texto demasiado longo")
    .regex(safeStringRegex, "Caracteres inválidos"),
  description: z
    .string()
    .max(1000, "Descrição demasiado longa")
    .regex(safeStringRegex, "Caracteres inválidos")
    .optional(),
  date: z.string().min(1, "A data é obrigatória"),
  type: z.string().min(1, "O tipo é obrigatório"),
  location: z
    .string()
    .trim()
    .min(1, "O local é obrigatório")
    .max(100, "Texto demasiado longo")
    .regex(safeStringRegex, "Caracteres inválidos"),
  organizer: z
    .string()
    .trim()
    .min(1, "O organizador é obrigatório")
    .max(100, "Texto demasiado longo")
    .regex(safeStringRegex, "Caracteres inválidos"),
  participants: z
    .number()
    .min(0, "O número de participantes não pode ser negativo")
    .optional(),
});

interface NewEventModalProps {
  onSuccess: () => void;
}

export function NewEventModal({ onSuccess }: NewEventModalProps) {
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = eventSchema.safeParse({
      ...formData,
      participants: Number(formData.participants),
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/events", {
        ...formData,
        participants: Number(formData.participants),
      });
      toast({ title: "Sucesso", description: "Atividade criada com sucesso!" });
      setFormData({
        title: "",
        description: "",
        date: "",
        type: "event",
        organizer: "",
        location: "",
        participants: 0,
      });
      setOpen(false);
      onSuccess();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Erro",
        description:
          err.response?.data?.message || "Falha ao criar atividade.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold rounded h-10 px-4 text-xs sm:text-sm shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] cursor-pointer transition-all flex items-center gap-1.5 font-hanken">
          <Plus className="h-4 w-4" />
          <span>Novo Evento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[550px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-lg border border-[#C0C2C5] shadow-[0_0_25px_rgba(0,0,0,0.8)] bg-[#1A1A1A] font-hanken text-[#e5e2e1]">
        <DialogHeader className="p-4 sm:p-5 border-b border-[#414042] bg-[#201f1f] shrink-0">
          <DialogTitle className="flex items-center gap-2.5 headline-sm text-[#e5e2e1]">
            <div className="p-2 rounded bg-[#121212] border border-[#414042] text-[#8B5CF6]">
              <Calendar className="h-4 w-4" />
            </div>
            <span>Criar Nova Atividade / Evento</span>
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[calc(90vh-100px)]"
        >
          <div className="space-y-1.5">
            <Label htmlFor="title" className="label-caps text-[#d5c4ac] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
              Título da Atividade *
            </Label>
            <Input
              id="title"
              placeholder="Ex: Feira Cultural e Científica 2026"
              value={formData.title}
              onChange={handleChange}
              className="bg-[#0D0D0D] border border-[#414042] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] h-10 outline-none transition-colors"
            />
            {errors.title && (
              <p className="text-[#ffb4ab] text-xs mt-1">{errors.title}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="label-caps text-[#d5c4ac] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva os detalhes e objetivos da atividade..."
              rows={2}
              value={formData.description}
              onChange={handleChange}
              className="bg-[#0D0D0D] border border-[#414042] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] resize-none p-3 outline-none transition-colors"
            />
            {errors.description && (
              <p className="text-[#ffb4ab] text-xs mt-1">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="date" className="label-caps text-[#d5c4ac] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#8B5CF6]" />
                Data *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="bg-[#0D0D0D] border border-[#414042] rounded text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] h-10 outline-none transition-colors"
              />
              {errors.date && (
                <p className="text-[#ffb4ab] text-xs mt-1">{errors.date}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type" className="label-caps text-[#d5c4ac] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
                Tipo *
              </Label>
              <Select value={formData.type} onValueChange={handleSelectChange}>
                <SelectTrigger className="bg-[#0D0D0D] border border-[#414042] rounded text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] h-10">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border border-[#C0C2C5] text-[#e5e2e1]">
                  <SelectItem value="event" className="cursor-pointer text-xs font-medium">
                    Evento
                  </SelectItem>
                  <SelectItem value="activity" className="cursor-pointer text-xs font-medium">
                    Atividade
                  </SelectItem>
                  <SelectItem value="meeting" className="cursor-pointer text-xs font-medium">
                    Reunião
                  </SelectItem>
                  <SelectItem value="holiday" className="cursor-pointer text-xs font-medium">
                    Feriado
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-[#ffb4ab] text-xs mt-1">{errors.type}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="label-caps text-[#d5c4ac] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#8B5CF6]" />
                Local *
              </Label>
              <Input
                id="location"
                placeholder="Ex: Auditório Principal"
                value={formData.location}
                onChange={handleChange}
                className="bg-[#0D0D0D] border border-[#414042] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] h-10 outline-none transition-colors"
              />
              {errors.location && (
                <p className="text-[#ffb4ab] text-xs mt-1">
                  {errors.location}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="organizer" className="label-caps text-[#d5c4ac] flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#8B5CF6]" />
                Organizador *
              </Label>
              <Input
                id="organizer"
                placeholder="Ex: Direção Pedagógica"
                value={formData.organizer}
                onChange={handleChange}
                className="bg-[#0D0D0D] border border-[#414042] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] h-10 outline-none transition-colors"
              />
              {errors.organizer && (
                <p className="text-[#ffb4ab] text-xs mt-1">
                  {errors.organizer}
                </p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="participants" className="label-caps text-[#d5c4ac] flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#8B5CF6]" />
                Participantes Esperados
              </Label>
              <Input
                id="participants"
                type="number"
                min="0"
                value={formData.participants}
                onChange={handleChange}
                className="bg-[#0D0D0D] border border-[#414042] rounded text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] h-10 outline-none transition-colors"
              />
              {errors.participants && (
                <p className="text-[#ffb4ab] text-xs mt-1">
                  {errors.participants}
                </p>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#414042] flex justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#201f1f] rounded text-xs font-semibold h-10 px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold text-xs sm:text-sm cursor-pointer shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] transition-all flex items-center justify-center gap-2 px-5"
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
