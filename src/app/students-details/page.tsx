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
  const [student, setStudent] = useState<any>(null);
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
          status: 'ativo',
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
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p>Aluno não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:col-span-2 pl-4 pr-4">
        <Card className="bg-white w-[67rem] mx-auto mt-4">
          <CardHeader className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-t-lg overflow-hidden">
              <div className="absolute top-4 right-8 w-24 h-24 bg-orange-400 rounded-full opacity-80"></div>
              <div className="absolute top-8 right-24 w-16 h-16 bg-yellow-400 rounded-full opacity-60"></div>
              <div className="absolute top-12 right-4 w-12 h-12 bg-red-400 rounded-full opacity-70"></div>
            </div>
            
            <div className="relative z-10 flex items-center gap-6 pt-8 pb-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <span className="text-3xl font-bold text-indigo-500">
                    {student.fullName[0]}
                  </span>
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">{student.fullName}</h1>
                <p className="text-purple-100">Aluno</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
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