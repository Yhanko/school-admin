"use client"

import { Calendar as CalendarIcon, ChevronDown, Loader2 } from "@/lib/icons";
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
      return 'border-l-[#6366f1] bg-purple-50';
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
}

export function CalendarSchedule() {
  const [events, setEvents] = useState<{ id: string; title: string; description?: string; date: string; time?: string; type?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Month and Year state
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

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const getDaysInMonth = (year: number, month: number) => {
      return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
      const day = new Date(year, month, 1).getDay();
      // Adjust to make Monday 0 instead of Sunday 0
      return day === 0 ? 6 : day - 1; 
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const totalSlots = Math.ceil((daysInMonth + firstDay) / 7) * 7;

  // Process events for the side panel
  const scheduleItems: ScheduleItem[] = events.map(e => {
      const d = new Date(e.date);
      return {
          id: e.id,
          title: e.title,
          subject: e.description || e.type || "Geral",
          date: d.toLocaleDateString('pt-BR', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
          time: "All day", // Simplified as we only have date right now
          color: mapTypeToColor(e.type || "")
      };
  });

  return (
    <div className="h-screen p-2 w-[70rem]">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Eventos da instituição</h1>
        <p className="text-muted-foreground">Eventos realizados pela instituição a nível geral</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start justify-between">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-[#5856eb]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Calendar</CardTitle>
                <div className="flex items-center gap-3">
                  {/* Month Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-white border border-gray-200 rounded-full px-4 py-2">
                        {monthNames[currentDate.getMonth()]}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {monthNames.map((m, idx) => (
                          <DropdownMenuItem key={m} onClick={() => {
                              const newDate = new Date(currentDate);
                              newDate.setMonth(idx);
                              setCurrentDate(newDate);
                          }}>
                              {m}
                          </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Year Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-white border border-gray-200 rounded-full px-4 py-2">
                        {currentDate.getFullYear()}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {[2023, 2024, 2025, 2026, 2027].map(y => (
                          <DropdownMenuItem key={y} onClick={() => {
                              const newDate = new Date(currentDate);
                              newDate.setFullYear(y);
                              setCurrentDate(newDate);
                          }}>
                              {y}
                          </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* New Event Button */}
                  <NewEventModal onSuccess={fetchEvents} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="calendar-grid">
                  {/* Custom Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {/* Calendar Days */}
                    {Array.from({ length: totalSlots }, (_, i) => {
                      const day = i - firstDay + 1;
                      const isCurrentMonth = day > 0 && day <= daysInMonth;
                      
                      const currentDateObj = new Date();
                      const isToday = isCurrentMonth && 
                                      day === currentDateObj.getDate() && 
                                      currentDate.getMonth() === currentDateObj.getMonth() && 
                                      currentDate.getFullYear() === currentDateObj.getFullYear();
                      
                      // Find events for this day
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
                            h-20 border rounded-lg p-2 text-sm overflow-hidden
                            ${isCurrentMonth ? 'bg-white text-gray-900 border-gray-200' : 'bg-gray-50 text-gray-400 border-transparent'}
                            ${isToday ? 'border-[#FF5777] shadow-sm' : ''}
                            cursor-pointer hover:bg-gray-50 transition-colors
                          `}
                        >
                          {isCurrentMonth && (
                            <>
                              <div className={`font-medium ${isToday ? 'bg-[#FF5777] text-white w-6 h-6 flex items-center justify-center rounded-full' : ''}`}>
                                  {day}
                              </div>
                              <div className="mt-1 space-y-1">
                                  {dayEvents.slice(0, 2).map((evt, idx) => (
                                      <div key={idx} className={`text-[10px] px-1 py-0.5 rounded truncate ${evt.type === 'event' ? 'bg-purple-100 text-purple-700' : evt.type === 'activity' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                          {evt.title}
                                      </div>
                                  ))}
                                  {dayEvents.length > 2 && (
                                      <div className="text-[10px] text-gray-500 font-medium">+{dayEvents.length - 2} mais</div>
                                  )}
                              </div>
                            </>
                          )}
                          {!isCurrentMonth && day > daysInMonth && (
                            <div className="font-medium">{day - daysInMonth}</div>
                          )}
                          {!isCurrentMonth && day <= 0 && (
                            <div className="font-medium">{getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth() - 1) + day}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Details Section */}
          <div className="lg:col-span-1">
            <Card className="bg-white border border-[#5856eb] h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Todos os Eventos</CardTitle>
                <p className="text-sm text-gray-500">Listagem Completa</p>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="animate-spin text-primary h-6 w-6" />
                    </div>
                ) : scheduleItems.length === 0 ? (
                    <p className="text-muted-foreground text-center">Nenhum evento agendado.</p>
                ) : scheduleItems.map((item) => (
                  <div
                    key={item.id}
                    className={`border-l-4 pl-4 py-3 rounded-r-lg relative group ${getColorClasses(item.color)}`}
                  >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                        }}
                      >
                          <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-between mb-2 pr-8">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                        <CalendarIcon className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 truncate">{item.subject}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  );
};