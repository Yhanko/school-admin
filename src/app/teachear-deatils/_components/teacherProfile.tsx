"use client"
import { MapPin, Phone, Mail } from "@/lib/icons";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axiosInstance from "@/service/api";
import { Loader2 } from "@/lib/icons";

interface TeacherData {
  name: string;
  email?: string;
  createdAt?: string;
  profile?: {
    photoUrl?: string;
    phone?: string;
    city?: string;
    biography?: string;
    qualification?: string;
  };
  employeeProfile?: {
    phone?: string;
    biography?: string;
    qualification?: string;
  };
}

export function TeacherProfile ({ id }: { id: string | null }) {
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
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
      <div className="min-h-screen bg-muted flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-muted flex justify-center items-center">
        <p>Professor não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-card border-none shadow-sm rounded-xl overflow-hidden mt-6">
          <CardContent className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Foto do Professor */}
            <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm border-4 border-white">
              {teacher.profile?.photoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={teacher.profile.photoUrl} alt="Teacher" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-primary">
                  {teacher.name[0]}
                </span>
              )}
            </div>

            {/* Informações */}
            <div className="flex-1 w-full text-center md:text-left mt-2">
              <h1 className="text-3xl font-bold text-foreground mb-1">{teacher.name}</h1>
              <p className="text-primary font-medium text-lg mb-8">Professor</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-foreground font-medium">{teacher.profile?.city || 'Localização não definida'}</span>
                </div>
                
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-foreground font-medium">{teacher.profile?.phone || 'Telefone não definido'}</span>
                </div>
                
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-foreground font-medium">{teacher.email}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}