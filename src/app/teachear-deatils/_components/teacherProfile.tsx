"use client"
import { MapPin, Phone, Mail } from "@/lib/icons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axiosInstance from "@/service/api";
import { Loader2 } from "@/lib/icons";

export function TeacherProfile ({ id }: { id: string | null }) {
  const [teacher, setTeacher] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchTeacher = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        setTeacher(response.data);
      } catch (error) {
        console.error("Failed to fetch teacher", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p>Professor não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white w-[40rem]">
              <CardHeader className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-t-lg overflow-hidden">
                  <div className="absolute top-4 right-8 w-24 h-24 bg-orange-400 rounded-full opacity-80"></div>
                  <div className="absolute top-8 right-24 w-16 h-16 bg-yellow-400 rounded-full opacity-60"></div>
                  <div className="absolute top-12 right-4 w-12 h-12 bg-red-400 rounded-full opacity-70"></div>
                </div>
                
                <div className="relative z-10 flex items-center gap-6 pt-8 pb-6">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    {teacher.profile?.photoUrl ? (
                      <img src={teacher.profile.photoUrl} alt="Teacher" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-indigo-500">
                        {teacher.name[0]}
                      </span>
                    )}
                  </div>
                  <div className="text-white">
                    <h1 className="text-3xl font-bold mb-2">{teacher.name}</h1>
                    <p className="text-purple-100">Professor</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-gray-700">{teacher.profile?.city || 'Localização não definida'}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-gray-700">{teacher.profile?.phone || 'Telefone não definido'}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Mail className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-gray-700">{teacher.email}</span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Morada:</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {teacher.profile?.address || 'Sem informação de morada.'}
                  </p>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Formação Académica:</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900">• {teacher.profile?.degree || 'Grau não especificado'}, {teacher.profile?.university || 'Universidade não especificada'}</h3>
                      <p className="text-gray-500 text-sm">{teacher.profile?.educationPeriod || 'Período não especificado'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};