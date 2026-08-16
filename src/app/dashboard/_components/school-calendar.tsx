"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameDay,
  format,
} from "date-fns";

export function SchoolCalendar({
  events = [],
}: {
  events?: {
    date?: string;
    title?: string;
    startDate?: string;
    createdAt?: string;
  }[];
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const portugueseMonths = [
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

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const blanks = Array.from({ length: startDayOfWeek }).map(() => null);
  const calendarDays = [...blanks, ...daysInMonth];

  const formattedMonthYear = `${
    portugueseMonths[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;

  return (
    <div className="bg-[#121212] border border-[#414042] rounded-lg p-5 font-hanken text-[#e5e2e1] space-y-4">
      <div className="flex flex-row items-center justify-between border-b border-[#414042] pb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#8B5CF6]" />
          <h2 className="headline-sm text-[#e5e2e1]">Calendário Escolar</h2>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            className="h-7 w-7 p-0 text-[#d5c4ac] hover:text-[#8B5CF6] hover:bg-[#1c1b1b] rounded cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-semibold data-mono text-[#DDD6FE] min-w-[120px] text-center">
            {formattedMonthYear}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            className="h-7 w-7 p-0 text-[#d5c4ac] hover:text-[#8B5CF6] hover:bg-[#1c1b1b] rounded cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className="text-center label-caps text-[10px] text-[#9d8f78] py-1"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`blank-${index}`} className="h-7 sm:h-8" />;
            }

            const hasEvent = events.some((e) =>
              isSameDay(
                new Date(e.startDate || e.date || e.createdAt || 0),
                day as Date
              )
            );
            const isToday = isSameDay(new Date(), day as Date);

            return (
              <div
                key={index}
                className="flex items-center justify-center h-7 sm:h-8"
              >
                <div
                  className={`text-xs font-semibold h-7 w-7 sm:h-7.5 sm:w-7.5 flex items-center justify-center transition-all ${
                    isToday
                      ? "bg-[#8B5CF6] text-black rounded font-bold shadow-[0_0_8px_rgba(139, 92, 246,0.5)]"
                      : hasEvent
                      ? "bg-[#201f1f] border border-[#8B5CF6]/60 text-[#DDD6FE] rounded font-bold"
                      : "text-[#e5e2e1] hover:bg-[#1c1b1b] hover:border hover:border-[#414042] rounded cursor-pointer"
                  }`}
                >
                  {format(day as Date, "d")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}