"use client"
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { ImageUploadButton } from "./UploadImage";
import Image from "next/image";
import RedefinirIcon from "@/assets/redifinirPlavraPass.svg";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axiosInstance from "@/service/api";
import { Loader2 } from "@/lib/icons";

export function ProfilePage(){
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get('/users/me');
            setUser(response.data);
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUser();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[40rem] w-[68rem]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const firstName = user?.profile?.firstName || 'Utilizador';
    const lastName = user?.profile?.lastName || '';
    const email = user?.email || 'N/A';
    const role = user?.role || 'N/A';
    const joinedAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A';

    return(
        <section className="space-y-4 flex flex-col items-center min-h-[40rem] w-[68rem] pt-4">
            <div className="flex flex-col space-y-4 items-center">
                <div className="flex items-start relative">
                    <div className="border-[2px] border-[#80848a] rounded-full w-[12rem] h-[12rem] flex justify-center items-center bg-indigo-50 overflow-hidden">
                        {/* Fallback to initials if no photo */}
                        <span className="text-4xl text-indigo-500 font-bold">
                            {firstName[0]}{lastName ? lastName[0] : ''}
                        </span>
                    </div>
                    <div className="ml-[-27px] -mt-[-2rem]" style={{ zIndex: 1 }}>
                        <ImageUploadButton />
                    </div>
                </div>
            </div>
            
            <span className="text-[#2D3339] font-semibold text-2xl mt-4">
                {firstName} {lastName}
            </span>
            <span className="text-indigo-500 font-medium text-md mt-[-10px]">
                {role}
            </span>

            <Separator className="w-[33rem] bg-[#80848a] my-6"/>

            <div className="flex space-x-36 w-[33rem]">
                <div className="flex flex-col space-y-4 text-left flex-1">
                    <span className="text-[#2D3339] font-semibold">Email:</span>
                    <span className="text-[#2D3339] font-semibold">Data de Adesão:</span>
                    <span className="text-[#2D3339] font-semibold">Telemóvel:</span>
                </div>
                                
                <div className="flex flex-col space-y-4 text-right flex-1">
                    <span className="text-[#2D3339] font-medium">{email}</span>
                    <span className="text-[#2D3339] font-medium">{joinedAt}</span>
                    <span className="text-[#2D3339] font-medium">+244 9XX XXX XXX</span>
                </div>
            </div>

            <Separator className="w-[33rem] bg-[#80848a] my-6"/>

            <Card className="w-[33rem] border-none shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center p-2 text-lg">Sessões Ativas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                            <div>
                                <p className="font-medium text-slate-900">
                                    Navegador Atual
                                </p>
                                <p className="text-sm text-slate-600">
                                    Acesso via plataforma Web
                                </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                                Ativo Agora
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator className="w-[33rem] bg-[#80848a] my-6"/>
            
            <div className="flex space-x-4 h-[5rem]">
                <Link href="/change-password">
                    <Button className="w-[16rem] rounded-full cursor-pointer h-12 bg-[#6366f1] hover:bg-[#5856eb] mt-4 text-white hover:text-white shadow-md">
                        <svg>
                            <image xlinkHref={RedefinirIcon.src || RedefinirIcon} className="size-4" />
                        </svg>
                        Redefinir Senha
                    </Button>
                </Link>
            </div>
        </section>
    )
}
