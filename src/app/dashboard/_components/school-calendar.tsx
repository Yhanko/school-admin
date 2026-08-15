"use client"
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, format } from "date-fns";

export function SchoolCalendar({ events = [] }: { events?: { date?: string; title?: string; startDate?: string; createdAt?: string }[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const portugueseMonths = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);
  
  const blanks = Array.from({ length: startDayOfWeek }).map(() => null);
  const calendarDays = [...blanks, ...daysInMonth];

  const formattedMonthYear = `${portugueseMonths[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <Card className="bg-white overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base sm:text-lg font-bold text-gray-900">Calendário Escolar</CardTitle>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={handlePrevMonth} className="h-8 w-8 p-0">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 min-w-[110px] text-center">{formattedMonthYear}</span>
          <Button variant="ghost" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center text-[11px] sm:text-xs font-bold text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`blank-${index}`} className="h-8 sm:h-9" />;
            }
            
            const hasEvent = events.some(e => isSameDay(new Date(e.startDate || e.date || e.createdAt || 0), day as Date));
            const isToday = isSameDay(new Date(), day as Date);

            return (
              <div key={index} className="flex items-center justify-center h-8 sm:h-9">
                <div
                  className={`text-xs font-semibold h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center transition-all ${
                    isToday
                      ? "bg-[#6366f1] text-white rounded-full shadow-sm"
                      : hasEvent
                        ? "bg-[#FF5777] text-white rounded-full shadow-sm font-bold"
                        : "text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer"
                  }`}
                >
                  {format(day as Date, 'd')}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}