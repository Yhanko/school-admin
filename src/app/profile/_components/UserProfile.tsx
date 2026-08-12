"use client"
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { ImageUploadButton } from "./UploadImage";
import RedefinirIcon from "@/assets/redifinirPlavraPass.svg";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axiosInstance from "@/service/api";
import { Loader2, Eye, EyeOff } from "@/lib/icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  profile?: {
    photoUrl?: string;
    phone?: string;
  };
  employeeProfile?: {
    phone?: string;
  };
}

export function ProfilePage() {
    const { toast } = useToast();
    const [user, setUser] = useState<UserProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Edit Profile State
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '', phone: '' });
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Change Password State
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    // Password Visibility State
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get('/users/me');
            setUser(response.data);
            setEditData({
                name: response.data?.name || '',
                email: response.data?.email || '',
                phone: response.data?.employeeProfile?.phone || '',
            });
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchUser();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            await axiosInstance.patch('/users/me', {
                name: editData.name,
                email: editData.email,
                employeeProfile: {
                    phone: editData.phone
                }
            });
            toast({ title: 'Sucesso', description: 'Perfil atualizado com sucesso!' });
            setIsEditProfileOpen(false);
            fetchUser();
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            toast({ title: 'Erro', description: 'Não foi possível atualizar o perfil.', variant: 'destructive' });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({ title: 'Erro', description: 'As novas senhas não coincidem.', variant: 'destructive' });
            return;
        }
        setIsChangingPassword(true);
        try {
            await axiosInstance.patch('/users/me/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast({ title: 'Sucesso', description: 'Senha alterada com sucesso!' });
            setIsChangePasswordOpen(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            toast({ title: 'Erro', description: 'Não foi possível alterar a senha. Verifique a senha atual.', variant: 'destructive' });
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[40rem] w-[68rem]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const userName = user?.name || 'Utilizador';
    const email = user?.email || 'N/A';
    const role = user?.role || 'N/A';
    const joinedAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A';
    const phone = user?.employeeProfile?.phone || 'Não informado';

    return(
        <section className="space-y-4 flex flex-col items-center min-h-[40rem] w-[68rem] pt-4">
            <div className="flex flex-col space-y-4 items-center">
                <div className="flex items-start relative">
                    <div className="border-[2px] border-[#80848a] rounded-full w-[12rem] h-[12rem] flex justify-center items-center bg-indigo-50 overflow-hidden">
                        <span className="text-4xl text-indigo-500 font-bold uppercase">
                            {userName.substring(0, 2)}
                        </span>
                    </div>
                    <div className="ml-[-27px] -mt-[-2rem]" style={{ zIndex: 1 }}>
                        <ImageUploadButton />
                    </div>
                </div>
            </div>
            
            <span className="text-[#2D3339] font-semibold text-2xl mt-4">
                {userName}
            </span>
            <span className="text-indigo-500 font-medium text-md mt-[-10px] uppercase">
                {role.replace('_', ' ')}
            </span>

            <Separator className="w-[33rem] bg-[#80848a] my-6"/>

            <div className="flex justify-between w-[33rem] items-center">
                <div className="flex space-x-24">
                    <div className="flex flex-col space-y-4 text-left">
                        <span className="text-[#2D3339] font-semibold">Email:</span>
                        <span className="text-[#2D3339] font-semibold">Data de Adesão:</span>
                        <span className="text-[#2D3339] font-semibold">Telemóvel:</span>
                    </div>
                                    
                    <div className="flex flex-col space-y-4 text-left">
                        <span className="text-[#2D3339] font-medium">{email}</span>
                        <span className="text-[#2D3339] font-medium">{joinedAt}</span>
                        <span className="text-[#2D3339] font-medium">{phone}</span>
                    </div>
                </div>

                <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="rounded-full cursor-pointer hover:bg-slate-100">Editar Dados</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Editar Perfil</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateProfile} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input 
                                    id="name" 
                                    value={editData.name}
                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input 
                                    id="email" 
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telemóvel</Label>
                                <Input 
                                    id="phone" 
                                    type="tel"
                                    value={editData.phone}
                                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                    placeholder="+244 9XX XXX XXX"
                                />
                            </div>
                            <Button type="submit" disabled={isUpdatingProfile} className="w-full bg-[#4a47f5] hover:bg-[#5856eb] cursor-pointer text-white rounded-full">
                                {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Salvar Alterações
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
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
                <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-[16rem] rounded-full cursor-pointer h-12 bg-[#6366f1] hover:bg-[#5856eb] mt-4 text-white hover:text-white shadow-md">
                            <svg>
                                <image xlinkHref={RedefinirIcon.src || RedefinirIcon} className="size-4" />
                            </svg>
                            Redefinir Senha
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Alterar Palavra-Passe</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Senha Atual</Label>
                                <div className="relative">
                                    <Input 
                                        id="currentPassword" 
                                        type={showCurrent ? "text" : "password"}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                        required
                                        className="pr-10"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowCurrent(!showCurrent)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">Nova Senha</Label>
                                <div className="relative">
                                    <Input 
                                        id="newPassword" 
                                        type={showNew ? "text" : "password"}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        required
                                        className="pr-10"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                <div className="relative">
                                    <Input 
                                        id="confirmPassword" 
                                        type={showConfirm ? "text" : "password"}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                        required
                                        className="pr-10"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <Button type="submit" disabled={isChangingPassword} className="w-full bg-[#4a47f5] hover:bg-[#5856eb] text-white cursor-pointer rounded-full">
                                {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Atualizar Senha
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    )
}
