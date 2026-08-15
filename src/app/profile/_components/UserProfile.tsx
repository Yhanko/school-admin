"use client"
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { ImageUploadButton } from "./UploadImage";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axiosInstance from "@/service/api";
import { Loader2, Eye, EyeOff } from "@/lib/icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, User, Mail, Phone, Calendar, Monitor } from "lucide-react";

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
            <div className="flex justify-center items-center w-full min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    const userName = user?.name || 'Utilizador';
    const email = user?.email || 'N/A';
    const role = user?.role || 'N/A';
    const joinedAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A';
    const phone = user?.employeeProfile?.phone || 'Não informado';

    return(
        <section className="w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 overflow-x-hidden">
            <div className="w-full max-w-2xl mx-auto space-y-6">
                
                {/* Avatar + Nome + Role */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                        <div className="border-2 border-indigo-200 rounded-full w-28 h-28 sm:w-36 sm:h-36 flex justify-center items-center bg-indigo-50 overflow-hidden shadow-md">
                            <span className="text-3xl sm:text-4xl text-primary font-bold uppercase">
                                {userName.substring(0, 2)}
                            </span>
                        </div>
                        <div className="absolute bottom-0 right-0" style={{ zIndex: 1 }}>
                            <ImageUploadButton />
                        </div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{userName}</h1>
                        <p className="text-sm sm:text-base text-primary font-medium uppercase mt-0.5">{role.replace(/_/g, ' ')}</p>
                    </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* Info Card */}
                <Card className="w-full border border-gray-100 shadow-sm rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            Dados da Conta
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {/* Email */}
                        <div className="flex items-start sm:items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <Mail className="w-4 h-4 text-indigo-400 mt-0.5 sm:mt-0 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 font-medium">Email</p>
                                <p className="text-sm text-gray-900 font-medium truncate">{email}</p>
                            </div>
                        </div>
                        {/* Data Adesão */}
                        <div className="flex items-start sm:items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <Calendar className="w-4 h-4 text-indigo-400 mt-0.5 sm:mt-0 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 font-medium">Data de Adesão</p>
                                <p className="text-sm text-gray-900 font-medium">{joinedAt}</p>
                            </div>
                        </div>
                        {/* Telemóvel */}
                        <div className="flex items-start sm:items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                            <Phone className="w-4 h-4 text-indigo-400 mt-0.5 sm:mt-0 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 font-medium">Telemóvel</p>
                                <p className="text-sm text-gray-900 font-medium">{phone}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sessões Ativas */}
                <Card className="w-full border border-gray-100 shadow-sm rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-primary" />
                            Sessões Ativas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div>
                                <p className="font-medium text-sm text-gray-900">Navegador Atual</p>
                                <p className="text-xs text-gray-500 mt-0.5">Acesso via plataforma Web</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 text-xs">Ativo Agora</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Separator className="bg-gray-200" />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full pb-6">
                    {/* Editar Dados */}
                    <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1 rounded-xl cursor-pointer border-indigo-200 text-primary hover:bg-indigo-50 font-semibold h-11">
                                <User className="w-4 h-4 mr-2" />
                                Editar Dados
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-md rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-gray-900">
                                    <User className="w-4 h-4 text-primary" />
                                    Editar Perfil
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleUpdateProfile} className="space-y-4 mt-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-xs font-semibold text-gray-700">Nome Completo</Label>
                                    <Input 
                                        id="name" 
                                        value={editData.name}
                                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        required
                                        className="rounded-xl border-gray-200 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs font-semibold text-gray-700">Email</Label>
                                    <Input 
                                        id="email" 
                                        type="email"
                                        value={editData.email}
                                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                                        required
                                        className="rounded-xl border-gray-200 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-xs font-semibold text-gray-700">Telemóvel</Label>
                                    <Input 
                                        id="phone" 
                                        type="tel"
                                        value={editData.phone}
                                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                        placeholder="+244 9XX XXX XXX"
                                        className="rounded-xl border-gray-200 text-sm"
                                    />
                                </div>
                                <Button type="submit" disabled={isUpdatingProfile} className="w-full bg-primary hover:bg-indigo-700 cursor-pointer text-white rounded-xl h-11 font-semibold">
                                    {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Salvar Alterações
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Redefinir Senha */}
                    <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex-1 rounded-xl cursor-pointer h-11 bg-primary hover:bg-indigo-700 text-white font-semibold shadow-sm">
                                <KeyRound className="w-4 h-4 mr-2" />
                                Redefinir Senha
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-md rounded-2xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-gray-900">
                                    <KeyRound className="w-4 h-4 text-primary" />
                                    Alterar Palavra-Passe
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleChangePassword} className="space-y-4 mt-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="currentPassword" className="text-xs font-semibold text-gray-700">Senha Atual</Label>
                                    <div className="relative">
                                        <Input 
                                            id="currentPassword" 
                                            type={showCurrent ? "text" : "password"}
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                            required
                                            className="pr-10 rounded-xl border-gray-200 text-sm"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowCurrent(!showCurrent)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                        >
                                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="newPassword" className="text-xs font-semibold text-gray-700">Nova Senha</Label>
                                    <div className="relative">
                                        <Input 
                                            id="newPassword" 
                                            type={showNew ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                            required
                                            className="pr-10 rounded-xl border-gray-200 text-sm"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                        >
                                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-700">Confirmar Nova Senha</Label>
                                    <div className="relative">
                                        <Input 
                                            id="confirmPassword" 
                                            type={showConfirm ? "text" : "password"}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                            required
                                            className="pr-10 rounded-xl border-gray-200 text-sm"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                        >
                                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" disabled={isChangingPassword} className="w-full bg-primary hover:bg-indigo-700 text-white cursor-pointer rounded-xl h-11 font-semibold">
                                    {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Atualizar Senha
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </section>
    )
}
