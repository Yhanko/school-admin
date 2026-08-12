"use client"

import { ChevronDown, Loader2 } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  color: 'purple' | 'orange' | 'yellow' | 'blue';
}

const getColorClasses = (color: string) => {
  switch (color) {
    case 'purple':
      return 'border-l-[#4D44B5] bg-purple-50';
    case 'orange':
      return 'border-l-[#FF5777] bg-orange-50';
    case 'yellow':
      return 'border-l-yellow-500 bg-yellow-50';
    case 'blue':
      return 'border-l-blue-500 bg-blue-50';
    default:
      return 'border-l-gray-500 bg-gray-50';
  }
};

const mapTypeToColor = (type: string): 'purple' | 'orange' | 'yellow' | 'blue' => {
  switch (type) {
    case 'event': return 'purple';
    case 'activity': return 'blue';
    case 'meeting': return 'orange';
    case 'holiday': return 'yellow';
    default: return 'purple';
  }
};

export function CalendarSchedule() {
  const [events, setEvents] = useState<{ id: string; title: string; description?: string; date: string; time?: string; type?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());

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

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja apagar esta atividade?')) return;
    try {
      await axiosInstance.delete(`/events/${id}`);
      toast({ title: 'Sucesso', description: 'Atividade apagada com sucesso.' });
      fetchEvents();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast({ title: 'Erro', description: err.response?.data?.message || 'Falha ao apagar.', variant: 'destructive' });
    }
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const totalSlots = Math.ceil((daysInMonth + firstDay) / 7) * 7;

  const scheduleItems: ScheduleItem[] = events.map(e => {
    const d = new Date(e.date);
    return {
      id: e.id,
      title: e.title,
      subject: e.description || e.type || "Geral",
      date: d.toLocaleDateString('pt-PT', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      time: "Dia todo",
      color: mapTypeToColor(e.type || "")
    };
  });

  return (
    <div className="w-full max-w-full space-y-6 px-2 sm:px-4 py-4">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Eventos da Instituição</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Visualize e agende eventos, reuniões e atividades académicas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Secção de Calendário */}
        <div className="lg:col-span-2 w-full">
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <CardTitle className="text-base sm:text-lg font-bold text-gray-900">Calendário de Eventos</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                {/* Selecionar Mês */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-700">
                      {monthNames[currentDate.getMonth()]}
                      <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border border-gray-200 shadow-md">
                    {monthNames.map((m, idx) => (
                      <DropdownMenuItem key={m} onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setMonth(idx);
                        setCurrentDate(newDate);
                      }} className="cursor-pointer text-xs font-medium">
                        {m}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Selecionar Ano */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-700">
                      {currentDate.getFullYear()}
                      <ChevronDown className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border border-gray-200 shadow-md">
                    {[2023, 2024, 2025, 2026, 2027].map(y => (
                      <DropdownMenuItem key={y} onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setFullYear(y);
                        setCurrentDate(newDate);
                      }} className="cursor-pointer text-xs font-medium">
                        {y}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Botão Novo Evento */}
                <NewEventModal onSuccess={fetchEvents} />
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="overflow-x-auto w-full">
                <div className="min-w-[500px]">
                  {/* Cabeçalho dos dias da semana */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="text-center text-xs font-bold text-gray-500 py-1">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Grelha de Dias */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {Array.from({ length: totalSlots }, (_, i) => {
                      const day = i - firstDay + 1;
                      const isCurrentMonth = day > 0 && day <= daysInMonth;
                      
                      const currentDateObj = new Date();
                      const isToday = isCurrentMonth && 
                                      day === currentDateObj.getDate() && 
                                      currentDate.getMonth() === currentDateObj.getMonth() && 
                                      currentDate.getFullYear() === currentDateObj.getFullYear();
                      
                      const dayEvents = isCurrentMonth ? events.filter(e => {
                        const eDate = new Date(e.date);
                        return eDate.getUTCDate() === day &&
                               eDate.getUTCMonth() === currentDate.getMonth() &&
                               eDate.getUTCFullYear() === currentDate.getFullYear();
                      }) : [];

                      return (
                        <div
                          key={i}
                          className={`
                            h-16 sm:h-20 border rounded-xl p-1.5 text-xs overflow-hidden transition-all
                            ${isCurrentMonth ? 'bg-white text-gray-900 border-gray-200' : 'bg-gray-50 text-gray-400 border-transparent opacity-40'}
                            ${isToday ? 'border-[#FF5777] ring-1 ring-[#FF5777]/30 shadow-xs' : ''}
                          `}
                        >
                          {isCurrentMonth && (
                            <>
                              <div className={`font-semibold text-center sm:text-left ${isToday ? 'bg-[#FF5777] text-white w-5 h-5 flex items-center justify-center rounded-full text-[11px]' : 'text-gray-700'}`}>
                                {day}
                              </div>
                              <div className="mt-1 space-y-0.5 overflow-y-auto max-h-11">
                                {dayEvents.map((evt, idx) => (
                                  <div key={idx} className={`text-[10px] px-1 py-0.5 rounded truncate font-medium ${evt.type === 'event' ? 'bg-purple-100 text-purple-700' : evt.type === 'activity' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`} title={evt.title}>
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
            </CardContent>
          </Card>
        </div>

        {/* Lista Lateral de Atividades */}
        <div className="w-full">
          <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-base sm:text-lg font-bold text-gray-900">Lista de Atividades</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#4D44B5]" />
                </div>
              ) : scheduleItems.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">Nenhum evento agendado.</p>
              ) : (
                scheduleItems.map((item) => (
                  <div
                    key={item.id}
                    className={`border-l-4 rounded-xl p-3.5 ${getColorClasses(item.color)} flex justify-between items-start transition-all shadow-xs`}
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-600 font-medium">{item.subject}</p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(item.id)} 
                      className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Apagar Evento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}