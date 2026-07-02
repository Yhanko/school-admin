"use client"
import { MapPin, Phone, Mail } from "@/lib/icons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axiosInstance from "@/service/api";
import { Loader2 } from "@/lib/icons";

function EmployeeProfileContent () {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [employee, setEmployee] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchEmployee = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        setEmployee(response.data);
      } catch (error) {
        console.error("Failed to fetch employee", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p>Funcionário não encontrado.</p>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    "ADMIN": "Administrador",
    "SUPER_ADMIN": "Super Admin",
    "TEACHER": "Professor",
    "SECRETARY": "Secretaria",
  };
  const roleName = roleLabels[employee.role] || employee.role;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Profile Section */}
      <div className="lg:col-span-2">
        <Card className="bg-white">
          <CardHeader className="relative">
            {/* Background with gradient circles */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-t-lg overflow-hidden">
              <div className="absolute top-4 right-8 w-24 h-24 bg-orange-400 rounded-full opacity-80"></div>
              <div className="absolute top-8 right-24 w-16 h-16 bg-yellow-400 rounded-full opacity-60"></div>
              <div className="absolute top-12 right-4 w-12 h-12 bg-red-400 rounded-full opacity-70"></div>
            </div>
            
            {/* Profile content */}
            <div className="relative z-10 flex items-center gap-6 pt-2 pb-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {employee.profile?.photoUrl ? (
                  <img src={employee.profile.photoUrl} alt="Employee" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-indigo-500">
                    {employee.name[0]}
                  </span>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">{employee.name}</h1>
                <p className="text-purple-100">{roleName}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-gray-700">{employee.profile?.city || 'Localização não definida'}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-gray-700">{employee.profile?.phone || 'Telefone não definido'}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-gray-700">{employee.email}</span>
              </div>
            </div>
            
            {/* About Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Morada:</h2>
              <p className="text-gray-600 leading-relaxed">
                {employee.profile?.address || 'Sem informação de morada.'}
              </p>
            </div>
            
            {/* Education Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Formação Académica:</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900">• {employee.profile?.degree || 'Grau não especificado'}, {employee.profile?.university || 'Universidade não especificada'}</h3>
                  <p className="text-gray-500 text-sm">{employee.profile?.educationPeriod || 'Período não especificado'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EmployeeProfile() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <EmployeeProfileContent />
    </Suspense>
  )
}