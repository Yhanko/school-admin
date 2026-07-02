"use client"

import { TeacherProfile } from "./_components/teacherProfile";
import { ScheduleCard } from "../teachear-deatils/_components/sheduleCard";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const TeacherDetailsContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 ">
          {/* Profile Section */}
          <div className="flex-1 w-[55rem]">
            <TeacherProfile id={id} />
          </div>
          
          {/* Schedule Section */}
          <div className="flex-1 lg:max-w-sm">
            <ScheduleCard />
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherDetails = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <TeacherDetailsContent />
    </Suspense>
  )
};

export default TeacherDetails;