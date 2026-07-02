"use client"
import { MapPin, Phone, Mail } from "@/lib/icons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axiosInstance from "@/service/api";
import { Loader2 } from "@/lib/icons";

function AssociationProfileContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [member, setMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const fetchMember = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        setMember(response.data);
      } catch (error) {
        console.error("Failed to fetch association member", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p>Membro não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="lg:col-span-2">
        <Card className="bg-white">
          <CardHeader className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-t-lg overflow-hidden">
              <div className="absolute top-4 right-8 w-24 h-24 bg-orange-400 rounded-full opacity-80"></div>
              <div className="absolute top-8 right-24 w-16 h-16 bg-yellow-400 rounded-full opacity-60"></div>
              <div className="absolute top-12 right-4 w-12 h-12 bg-red-400 rounded-full opacity-70"></div>
            </div>
            
            <div className="relative z-10 flex items-center gap-6 pt-2 pb-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {member.profile?.photoUrl ? (
                  <img src={member.profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-indigo-500">
                    {member.name[0]}
                  </span>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold mb-2">{member.name}</h1>
                <p className="text-purple-100">{member.profile?.degree || 'Membro da Associação'}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-gray-700">{member.profile?.city || 'Localização não definida'}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-gray-700">{member.profile?.phone || 'Sem telefone'}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <span className="text-gray-700">{member.email}</span>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Morada:</h2>
              <p className="text-gray-600 leading-relaxed">
                {member.profile?.address || 'Sem informação de morada.'}
              </p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Cargo / Atribuições:</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900">• {member.profile?.degree || 'Membro geral'}</h3>
                  <p className="text-gray-500 text-sm">Associação de Estudantes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AssociationProfile() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AssociationProfileContent />
    </Suspense>
  )
}