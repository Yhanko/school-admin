"use client";

import { ChevronDown, Loader2, Calendar as CalendarIcon, Clock } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import axiosInstance from "@/service/api";
import { NewEventModal } from "./new-event";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScheduleItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  type: string;
}

const getBorderColor = (type: string) => {
  switch (type) {
    case "event":
      return "border-l-[#8B5CF6]";
    case "activity":
      return "border-l-[#C0C2C5]";
    case "meeting":
      return "border-l-[#2D6A4F]";
    case "holiday":
      return "border-l-[#ffb4ab]";
    default:
      return "border-l-[#8B5CF6]";
  }
};

export function CalendarSchedule() {
  const [events, setEvents] = useState<
    {
      id: string;
      title: string;
      description?: string;
      date: string;
      time?: string;
      type?: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get("/events");
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

  const handleDelete = async (id: string) => {
    if (!confirm("Tem a certeza que deseja apagar esta atividade?")) return;
    try {
      await axiosInstance.delete(`/events/${id}`);
      toast({
        title: "Sucesso",
        description: "Atividade apagada com sucesso.",
      });
      fetchEvents();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: "Erro",
        description: err.response?.data?.message || "Falha ao apagar.",
        variant: "destructive",
      });
    }
  };

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const firstDay = getFirstDayOfMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const totalSlots = Math.ceil((daysInMonth + firstDay) / 7) * 7;

  const scheduleItems: ScheduleItem[] = events.map((e) => {
    const d = new Date(e.date);
    return {
      id: e.id,
      title: e.title,
      subject: e.description || e.type || "Geral",
      date: d.toLocaleDateString("pt-PT", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }),
      time: "Dia todo",
      type: e.type || "event",
    };
  });

  return (
    <div className="w-full max-w-full space-y-6 font-hanken text-[#e5e2e1]">
      <div className="border-b border-[#414042] pb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
          <h1 className="headline-lg text-[#e5e2e1]">
            Eventos da Instituição
          </h1>
        </div>
        <p className="body-md text-[#d5c4ac] mt-1">
          Calendário e agendamento de reuniões, assembleias e atividades académicas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Secção de Calendário Principal */}
        <div className="lg:col-span-2 w-full">
          <div className="bg-[#121212] border border-[#414042] rounded-lg overflow-hidden p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#414042]">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#8B5CF6]" />
                <h2 className="headline-sm text-[#e5e2e1]">
                  Calendário de Eventos
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Selecionar Mês */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#1c1b1b] rounded h-9 px-3 text-xs font-semibold"
                    >
                      {monthNames[currentDate.getMonth()]}
                      <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-[#d5c4ac]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1A1A1A] border border-[#C0C2C5] text-[#e5e2e1] font-hanken shadow-xl">
                    {monthNames.map((m, idx) => (
                      <DropdownMenuItem
                        key={m}
                        onClick={() => {
                          const newDate = new Date(currentDate);
                          newDate.setMonth(idx);
                          setCurrentDate(newDate);
                        }}
                        className="cursor-pointer text-xs font-medium hover:bg-[#201f1f] focus:bg-[#201f1f]"
                      >
                        {m}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Selecionar Ano */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#1c1b1b] rounded h-9 px-3 text-xs font-semibold data-mono"
                    >
                      {currentDate.getFullYear()}
                      <ChevronDown className="ml-1.5 h-3.5 w-3.5 text-[#d5c4ac]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1A1A1A] border border-[#C0C2C5] text-[#e5e2e1] font-hanken shadow-xl">
                    {[2023, 2024, 2025, 2026, 2027].map((y) => (
                      <DropdownMenuItem
                        key={y}
                        onClick={() => {
                          const newDate = new Date(currentDate);
                          newDate.setFullYear(y);
                          setCurrentDate(newDate);
                        }}
                        className="cursor-pointer text-xs font-medium data-mono hover:bg-[#201f1f] focus:bg-[#201f1f]"
                      >
                        {y}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Botão Novo Evento */}
                <NewEventModal onSuccess={fetchEvents} />
              </div>
            </div>

            <div className="overflow-x-auto w-full pt-1">
              <div className="min-w-[500px]">
                {/* Cabeçalho dos dias da semana */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="text-center label-caps text-[10px] text-[#9d8f78] py-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grelha de Dias */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {Array.from({ length: totalSlots }, (_, i) => {
                    const day = i - firstDay + 1;
                    const isCurrentMonth = day > 0 && day <= daysInMonth;

                    const currentDateObj = new Date();
                    const isToday =
                      isCurrentMonth &&
                      day === currentDateObj.getDate() &&
                      currentDate.getMonth() === currentDateObj.getMonth() &&
                      currentDate.getFullYear() ===
                        currentDateObj.getFullYear();

                    const dayEvents = isCurrentMonth
                      ? events.filter((e) => {
                          const eDate = new Date(e.date);
                          return (
                            eDate.getUTCDate() === day &&
                            eDate.getUTCMonth() === currentDate.getMonth() &&
                            eDate.getUTCFullYear() ===
                              currentDate.getFullYear()
                          );
                        })
                      : [];

                    return (
                      <div
                        key={i}
                        className={`
                          min-h-[72px] sm:min-h-[82px] border rounded p-1.5 text-xs overflow-hidden transition-all flex flex-col justify-between
                          ${
                            isCurrentMonth
                              ? "bg-[#1c1b1b] text-[#e5e2e1] border-[#414042] hover:border-[#C0C2C5]"
                              : "bg-[#121212] text-[#9d8f78] border-[#414042]/20 opacity-30"
                          }
                          ${
                            isToday
                              ? "border-[#8B5CF6] ring-1 ring-[#8B5CF6]/40 shadow-[0_0_8px_rgba(139, 92, 246,0.25)]"
                              : ""
                          }
                        `}
                      >
                        {isCurrentMonth && (
                          <>
                            <div
                              className={`font-semibold data-mono text-center sm:text-left ${
                                isToday
                                  ? "bg-[#8B5CF6] text-black w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-[0_0_6px_#8B5CF6]"
                                  : "text-[#e5e2e1]"
                              }`}
                            >
                              {day}
                            </div>
                            <div className="mt-1 space-y-1 overflow-y-auto max-h-12 scrollbar-none">
                              {dayEvents.map((evt, idx) => (
                                <div
                                  key={idx}
                                  className={`text-[9px] px-1 py-0.5 rounded truncate font-medium border ${
                                    evt.type === "event"
                                      ? "bg-[#201f1f] border-[#8B5CF6]/50 text-[#DDD6FE]"
                                      : evt.type === "activity"
                                      ? "bg-[#201f1f] border-[#C0C2C5]/50 text-[#e5e2e1]"
                                      : evt.type === "meeting"
                                      ? "bg-[#201f1f] border-[#2D6A4F]/60 text-[#2D6A4F]"
                                      : "bg-[#201f1f] border-[#ffb4ab]/50 text-[#ffb4ab]"
                                  }`}
                                  title={evt.title}
                                >
                                  {evt.title}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista Lateral de Atividades */}
        <div className="w-full">
          <div className="bg-[#121212] border border-[#414042] rounded-lg p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#414042] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8B5CF6]" />
                <h2 className="headline-sm text-[#e5e2e1]">
                  Lista de Atividades
                </h2>
              </div>
              <span className="label-caps text-[10px] text-[#9d8f78]">
                AGENDA
              </span>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="flex flex-col justify-center items-center py-10 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#8B5CF6]" />
                  <span className="label-caps text-[11px] text-[#d5c4ac]">
                    Carregando agenda...
                  </span>
                </div>
              ) : scheduleItems.length === 0 ? (
                <p className="text-xs text-[#9d8f78] italic text-center py-8">
                  Nenhum evento agendado no sistema.
                </p>
              ) : (
                scheduleItems.map((item) => (
                  <div
                    key={item.id}
                    className={`border-l-4 ${getBorderColor(
                      item.type
                    )} border border-[#414042] bg-[#1c1b1b] rounded p-3.5 flex justify-between items-start transition-all hover:border-[#C0C2C5]`}
                  >
                    <div className="space-y-1 min-w-0 flex-1 pr-2">
                      <h4 className="font-bold text-xs sm:text-sm text-[#e5e2e1] truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#d5c4ac] truncate">
                        {item.subject}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[#9d8f78] data-mono pt-1">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="h-7 w-7 text-[#9d8f78] hover:text-[#ffb4ab] hover:bg-[#9B2226]/20 rounded cursor-pointer shrink-0"
                      title="Apagar Evento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}