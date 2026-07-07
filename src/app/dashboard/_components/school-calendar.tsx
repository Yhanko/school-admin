"use client"
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isSameMonth } from "date-fns";

export function SchoolCalendar({ events = [] }: { events?: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = monthStart;
  const endDate = monthEnd;

  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  const startDayOfWeek = getDay(monthStart);
  
  const blanks = Array.from({ length: startDayOfWeek }).map((_, i) => null);
  const calendarDays = [...blanks, ...daysInMonth];

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">School Calendar</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium text-gray-600">{format(currentDate, 'MMMM yyyy')}</span>
          <Button variant="ghost" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`blank-${index}`} className="py-2" />;
            }
            
            const hasEvent = events.some(e => isSameDay(new Date(e.startDate || e.date || e.createdAt), day as Date));
            const isToday = isSameDay(new Date(), day as Date);

            return (
              <div
                key={index}
                className={`text-center py-2 text-sm ${
                  isToday
                    ? "bg-[#6366f1] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                    : hasEvent
                      ? "bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                      : "text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                }`}
              >
                {format(day as Date, 'd')}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};