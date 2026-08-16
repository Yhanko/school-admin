"use client"
import { mockStudent } from '@/lib/mockData';
import StudentHeader from './_components/StudentHeader';
import AcademicInfo from './_components/AcademicInfo';
import SubjectsSection from './_components/SubjectsSection';
import TeachersSection from './_components/TeachersSection';
import PaymentsSection from './_components/PaymentsSection';
import GuardianInfo from './_components/GuardianInfo';
import ClassroomInfo from './_components/ClassroomInfo';
import { Card, CardHeader } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axiosInstance from "@/service/api";
import { Loader2 } from "@/lib/icons";

function StudentDetailsContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [student, setStudent] = useState<typeof mockStudent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        const user = response.data;
        
        // Map backend data to frontend expected format
        const mappedStudent = {
          ...mockStudent,
          id: user.id,
          fullName: user.name,
          studentNumber: user.profile?.studentNumber || 'N/D',
          academicYear: '2024/2025',
          class: user.profile?.class || 'N/D',
          course: user.profile?.course || 'N/D',
          status: 'ativo' as const,
          enrollmentDate: new Date(user.createdAt).toISOString().split('T')[0],
          dateOfBirth: user.profile?.dateOfBirth || 'N/D',
          guardian: {
            name: user.profile?.guardianName || mockStudent.guardian.name,
            relationship: user.profile?.guardianRelationship || mockStudent.guardian.relationship,
            phone: user.profile?.guardianPhone || mockStudent.guardian.phone,
            email: user.profile?.guardianEmail || mockStudent.guardian.email,
          }
        };
        
        setStudent(mappedStudent);
      } catch (error) {
        console.error("Failed to fetch student", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center space-y-3 font-hanken">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
        <span className="label-caps text-[#d5c4ac]">Carregando ficha do estudante...</span>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center text-[#d5c4ac] font-hanken">
        <p>Aluno não encontrado na base de dados.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 font-hanken text-[#e5e2e1]">
      <div className="bg-[#121212] border border-[#414042] rounded-lg overflow-hidden relative">
        <div className="h-24 bg-gradient-to-r from-[#1A1A1A] via-[#201f1f] to-[#121212] border-b border-[#414042] relative">
          <div className="absolute top-3 right-4 label-caps text-[10px] text-[#DDD6FE] bg-[#1c1b1b] border border-[#414042] px-2.5 py-1 rounded">
            MATRÍCULA ATIVA • 2024/2025
          </div>
        </div>
        
        <div className="px-6 pb-6 pt-0 flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
          <div className="w-20 h-20 bg-[#201f1f] border-2 border-[#414042] rounded-full flex items-center justify-center shadow-lg shrink-0">
            <span className="text-2xl font-bold font-jetbrains text-[#DDD6FE]">
              {student.fullName ? student.fullName[0] : "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="headline-md text-[#e5e2e1] truncate">{student.fullName}</h1>
            <p className="label-caps text-[#d5c4ac] text-xs mt-0.5">Estudante • Nº #{student.studentNumber}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <StudentHeader student={student} />
        <AcademicInfo student={student} />
        <SubjectsSection student={student} />
        <TeachersSection student={student} />
        <PaymentsSection student={student} />
        <GuardianInfo student={student} />
        <ClassroomInfo student={student} />
      </div>
    </div>
  );
}

export default function StudentDetails() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <StudentDetailsContent />
    </Suspense>
  )
}