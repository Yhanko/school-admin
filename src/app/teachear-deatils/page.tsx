"use client"

import { TeacherProfile } from "./_components/teacherProfile";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const TeacherDetailsContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 ">
          <div className="flex-1 w-full max-w-4xl">
            <TeacherProfile id={id} />
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