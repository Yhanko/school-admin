"use client";

import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageUploadButton } from "./UploadImage";
import { useState, useEffect } from "react";
import axiosInstance from "@/service/api";
import { Loader2, Eye, EyeOff } from "@/lib/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, User, Mail, Phone, Calendar, Monitor, ShieldCheck, Building2 } from "lucide-react";

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  institution?: {
    id: string;
    name: string;
    nif?: string;
  };
  createdAt?: string;
  photoUrl?: string;
  avatar?: string;
  profile?: {
    photoUrl?: string;
    phone?: string;
  };
  employeeProfile?: {
    photoUrl?: string;
    phone?: string;
  };
}

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome obrigatório")
    .max(255, "Nome muito longo")
    .regex(/^[^<>';=]*$/, "Caracteres inválidos (Não use < > ' ; =)"),
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .min(1, "E-mail obrigatório")
    .max(255, "E-mail muito longo")
    .regex(/^[^<>';=]*$/, "Caracteres inválidos"),
  phone: z
    .string()
    .trim()
    .max(50, "Telefone muito longo")
    .regex(/^[^<>';=]*$/, "Caracteres inválidos")
    .optional()
    .or(z.literal("")),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "No mínimo 6 caracteres"),
    newPassword: z.string().min(6, "No mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "No mínimo 6 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const institutionSchema = z.object({
  name: z.string().trim().min(1, "Nome da instituição obrigatório").max(255, "Nome muito longo"),
  nif: z.string().trim().max(50, "NIF muito longo").optional().or(z.literal("")),
});

export function ProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Profile State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "", phone: "" });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Change Password State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Edit Institution State
  const [isEditInstitutionOpen, setIsEditInstitutionOpen] = useState(false);
  const [institutionData, setInstitutionData] = useState({ name: "", nif: "" });
  const [institutionErrors, setInstitutionErrors] = useState<Record<string, string>>({});
  const [isUpdatingInstitution, setIsUpdatingInstitution] = useState(false);

  // Password Visibility State
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/users/me");
      setUser(response.data);
      setEditData({
        name: response.data?.name || "",
        email: response.data?.email || "",
        phone: response.data?.employeeProfile?.phone || "",
      });
      if (response.data?.institution) {
        setInstitutionData({
          name: response.data.institution.name || "",
          nif: response.data.institution.nif || "",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados do utilizador:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      profileSchema.parse(editData);
      setProfileErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0])
            fieldErrors[error.path[0] as string] = error.message;
        });
        setProfileErrors(fieldErrors);
      }
      return;
    }

    setIsUpdatingProfile(true);
    try {
      await axiosInstance.patch("/users/me", {
        name: editData.name,
        email: editData.email,
        employeeProfile: {
          phone: editData.phone,
        },
      });
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
      setIsEditProfileOpen(false);
      fetchUser();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      institutionSchema.parse(institutionData);
      setInstitutionErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0])
            fieldErrors[error.path[0] as string] = error.message;
        });
        setInstitutionErrors(fieldErrors);
      }
      return;
    }

    setIsUpdatingInstitution(true);
    try {
      await axiosInstance.patch("/institutions/me", {
        name: institutionData.name,
        nif: institutionData.nif,
      });
      toast({
        title: "Sucesso",
        description: "Dados da instituição atualizados com sucesso!",
      });
      setIsEditInstitutionOpen(false);
      fetchUser();
    } catch (error) {
      console.error("Erro ao atualizar instituição:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a instituição.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingInstitution(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      passwordSchema.parse(passwordData);
      setPasswordErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0])
            fieldErrors[error.path[0] as string] = error.message;
        });
        setPasswordErrors(fieldErrors);
      }
      return;
    }

    setIsChangingPassword(true);
    try {
      await axiosInstance.patch("/users/me/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast({
        title: "Sucesso",
        description: "Palavra-passe alterada com sucesso!",
      });
      setIsChangePasswordOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Erro ao alterar palavra-passe:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível alterar a palavra-passe. Verifique a senha atual.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center w-full min-h-[60vh] space-y-3 font-hanken">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
        <span className="label-caps text-[#d5c4ac]">Carregando ficha de perfil...</span>
      </div>
    );
  }

  const userName = user?.name || "Utilizador";
  const email = user?.email || "N/A";
  const role = user?.role || "N/A";
  const joinedAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("pt-PT")
    : "N/A";
  const phone = user?.employeeProfile?.phone || "Não informado";
  const userPhoto =
    user?.employeeProfile?.photoUrl ||
    user?.avatar ||
    user?.profile?.photoUrl ||
    user?.photoUrl;

  return (
    <section className="w-full max-w-full py-4 sm:py-6 font-hanken text-[#e5e2e1]">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Avatar + Nome + Role */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="border-2 border-[#414042] rounded-full w-28 h-28 sm:w-36 sm:h-36 flex justify-center items-center bg-[#1c1b1b] overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.6)]">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl sm:text-4xl text-[#DDD6FE] font-jetbrains font-bold uppercase">
                  {userName.substring(0, 2)}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 z-10">
              <ImageUploadButton
                onSuccess={(newUrl) => {
                  setUser((prev) =>
                    prev
                      ? {
                          ...prev,
                          photoUrl: newUrl,
                          avatar: newUrl,
                          profile: {
                            ...prev.profile,
                            photoUrl: newUrl,
                          },
                          employeeProfile: {
                            ...prev.employeeProfile,
                            photoUrl: newUrl,
                          },
                        }
                      : null
                  );
                }}
              />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h1 className="headline-md text-[#e5e2e1]">{userName}</h1>
            <div>
              <span className="label-caps text-[#DDD6FE] bg-[#1c1b1b] border border-[#414042] px-3 py-1 rounded inline-block text-[11px]">
                {role.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>

        <Separator className="bg-[#414042]" />

        {/* Info Card */}
        <div className="bg-[#121212] border border-[#414042] rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#414042] pb-3">
            <User className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="headline-sm text-[#e5e2e1]">
              Dados da Conta Institucional
            </h2>
          </div>
          <div className="space-y-3">
            {/* Email */}
            <div className="flex items-start sm:items-center gap-3 p-3 rounded bg-[#1c1b1b] border border-[#414042]">
              <Mail className="w-4 h-4 text-[#8B5CF6] mt-0.5 sm:mt-0 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="label-caps text-[10px] text-[#9d8f78]">
                  E-mail Oficial
                </p>
                <p className="text-sm font-semibold text-[#e5e2e1] data-mono truncate">
                  {email}
                </p>
              </div>
            </div>

            {/* Data Adesão */}
            <div className="flex items-start sm:items-center gap-3 p-3 rounded bg-[#1c1b1b] border border-[#414042]">
              <Calendar className="w-4 h-4 text-[#8B5CF6] mt-0.5 sm:mt-0 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="label-caps text-[10px] text-[#9d8f78]">
                  Data de Registo no Sistema
                </p>
                <p className="text-sm font-semibold text-[#e5e2e1] data-mono">
                  {joinedAt}
                </p>
              </div>
            </div>

            {/* Telemóvel */}
            <div className="flex items-start sm:items-center gap-3 p-3 rounded bg-[#1c1b1b] border border-[#414042]">
              <Phone className="w-4 h-4 text-[#8B5CF6] mt-0.5 sm:mt-0 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="label-caps text-[10px] text-[#9d8f78]">
                  Telemóvel / Contacto
                </p>
                <p className="text-sm font-semibold text-[#e5e2e1] data-mono">
                  {phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sessões Ativas */}
        <div className="bg-[#121212] border border-[#414042] rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#414042] pb-3">
            <Monitor className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="headline-sm text-[#e5e2e1]">
              Sessões e Segurança de Acesso
            </h2>
          </div>
          <div>
            <div className="flex items-center justify-between p-3.5 bg-[#1c1b1b] rounded border border-[#414042]">
              <div>
                <p className="font-semibold text-sm text-[#e5e2e1]">
                  Navegador Atual • Sessão Autenticada
                </p>
                <p className="text-xs text-[#d5c4ac] mt-0.5">
                  Acesso ativo via yhankoEduca School Admin
                </p>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#2D6A4F]/30 text-[#2D6A4F] border border-[#2D6A4F]/60 data-mono">
                ATIVO AGORA
              </span>
            </div>
          </div>
        </div>

        {(role === "SUPER_ADMIN" || role === "ADMIN") && user?.institution && (
          <>
            <Separator className="bg-[#414042]" />
            {/* Institution Info Card */}
            <div className="bg-[#121212] border border-[#414042] rounded-lg p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#414042] pb-3">
                <Building2 className="w-4 h-4 text-[#8B5CF6]" />
                <h2 className="headline-sm text-[#e5e2e1]">
                  Dados da Instituição
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start sm:items-center gap-3 p-3 rounded bg-[#1c1b1b] border border-[#414042]">
                  <Building2 className="w-4 h-4 text-[#8B5CF6] mt-0.5 sm:mt-0 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="label-caps text-[10px] text-[#9d8f78]">Nome da Escola</p>
                    <p className="text-sm font-semibold text-[#e5e2e1] data-mono truncate">
                      {user.institution.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start sm:items-center gap-3 p-3 rounded bg-[#1c1b1b] border border-[#414042]">
                  <ShieldCheck className="w-4 h-4 text-[#8B5CF6] mt-0.5 sm:mt-0 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="label-caps text-[10px] text-[#9d8f78]">NIF</p>
                    <p className="text-sm font-semibold text-[#e5e2e1] data-mono">
                      {user.institution.nif || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <Separator className="bg-[#414042]" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full pb-6">
          {/* Editar Dados */}
          <Dialog
            open={isEditProfileOpen}
            onOpenChange={(open) => {
              setIsEditProfileOpen(open);
              if (!open) setProfileErrors({});
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="flex-1 rounded h-11 border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#1c1b1b] font-semibold text-xs sm:text-sm cursor-pointer"
              >
                <User className="w-4 h-4 mr-2 text-[#d5c4ac]" />
                Editar Dados
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md rounded-lg bg-[#1A1A1A] border border-[#C0C2C5] text-[#e5e2e1] font-hanken p-5 shadow-[0_0_25px_rgba(0,0,0,0.8)]">
              <DialogHeader className="border-b border-[#414042] pb-3">
                <DialogTitle className="flex items-center gap-2 headline-sm text-[#e5e2e1]">
                  <User className="w-4 h-4 text-[#8B5CF6]" />
                  Editar Dados do Perfil
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateProfile} className="space-y-4 mt-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="label-caps text-[#d5c4ac]">
                    Nome Completo *
                  </Label>
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => {
                      setEditData({ ...editData, name: e.target.value });
                      if (profileErrors.name)
                        setProfileErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className={`bg-[#0D0D0D] border rounded h-10 text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] outline-none ${
                      profileErrors.name
                        ? "border-[#ffb4ab]"
                        : "border-[#414042]"
                    }`}
                  />
                  {profileErrors.name && (
                    <p className="text-[#ffb4ab] text-xs">
                      {profileErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="label-caps text-[#d5c4ac]">
                    E-mail Institucional *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => {
                      setEditData({ ...editData, email: e.target.value });
                      if (profileErrors.email)
                        setProfileErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`bg-[#0D0D0D] border rounded h-10 text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] outline-none ${
                      profileErrors.email
                        ? "border-[#ffb4ab]"
                        : "border-[#414042]"
                    }`}
                  />
                  {profileErrors.email && (
                    <p className="text-[#ffb4ab] text-xs">
                      {profileErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="label-caps text-[#d5c4ac]">
                    Telemóvel
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => {
                      setEditData({ ...editData, phone: e.target.value });
                      if (profileErrors.phone)
                        setProfileErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    placeholder="+244 9XX XXX XXX"
                    className={`bg-[#0D0D0D] border rounded h-10 text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] outline-none ${
                      profileErrors.phone
                        ? "border-[#ffb4ab]"
                        : "border-[#414042]"
                    }`}
                  />
                  {profileErrors.phone && (
                    <p className="text-[#ffb4ab] text-xs">
                      {profileErrors.phone}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#414042]">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#1c1b1b] rounded h-10 px-4 text-xs font-semibold"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold rounded h-10 px-5 text-xs sm:text-sm shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] cursor-pointer"
                  >
                    {isUpdatingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Redefinir Senha */}
          <Dialog
            open={isChangePasswordOpen}
            onOpenChange={(open) => {
              setIsChangePasswordOpen(open);
              if (!open) setPasswordErrors({});
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex-1 rounded h-11 bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold text-xs sm:text-sm shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] cursor-pointer">
                <KeyRound className="w-4 h-4 mr-2" />
                Redefinir Palavra-Passe
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md rounded-lg bg-[#1A1A1A] border border-[#C0C2C5] text-[#e5e2e1] font-hanken p-5 shadow-[0_0_25px_rgba(0,0,0,0.8)]">
              <DialogHeader className="border-b border-[#414042] pb-3">
                <DialogTitle className="flex items-center gap-2 headline-sm text-[#e5e2e1]">
                  <KeyRound className="w-4 h-4 text-[#8B5CF6]" />
                  Alterar Palavra-Passe
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleChangePassword} className="space-y-4 mt-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="currentPassword"
                    className="label-caps text-[#d5c4ac]"
                  >
                    Palavra-Passe Atual *
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrent ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => {
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        });
                        if (passwordErrors.currentPassword)
                          setPasswordErrors((prev) => ({
                            ...prev,
                            currentPassword: "",
                          }));
                      }}
                      className={`pr-10 bg-[#0D0D0D] border rounded h-10 text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] outline-none ${
                        passwordErrors.currentPassword
                          ? "border-[#ffb4ab]"
                          : "border-[#414042]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9d8f78] hover:text-[#e5e2e1] cursor-pointer"
                    >
                      {showCurrent ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-[#ffb4ab] text-xs">
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="newPassword"
                    className="label-caps text-[#d5c4ac]"
                  >
                    Nova Palavra-Passe *
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => {
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        });
                        if (passwordErrors.newPassword)
                          setPasswordErrors((prev) => ({
                            ...prev,
                            newPassword: "",
                          }));
                      }}
                      className={`pr-10 bg-[#0D0D0D] border rounded h-10 text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] outline-none ${
                        passwordErrors.newPassword
                          ? "border-[#ffb4ab]"
                          : "border-[#414042]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9d8f78] hover:text-[#e5e2e1] cursor-pointer"
                    >
                      {showNew ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-[#ffb4ab] text-xs">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="confirmPassword"
                    className="label-caps text-[#d5c4ac]"
                  >
                    Confirmar Nova Palavra-Passe *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => {
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        });
                        if (passwordErrors.confirmPassword)
                          setPasswordErrors((prev) => ({
                            ...prev,
                            confirmPassword: "",
                          }));
                      }}
                      className={`pr-10 bg-[#0D0D0D] border rounded h-10 text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] outline-none ${
                        passwordErrors.confirmPassword
                          ? "border-[#ffb4ab]"
                          : "border-[#414042]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9d8f78] hover:text-[#e5e2e1] cursor-pointer"
                    >
                      {showConfirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-[#ffb4ab] text-xs">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#414042]">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsChangePasswordOpen(false)}
                    className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#1c1b1b] rounded h-10 px-4 text-xs font-semibold"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold rounded h-10 px-5 text-xs sm:text-sm shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] cursor-pointer"
                  >
                    {isChangingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Atualizar Senha
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Editar Instituição */}
        {(role === "SUPER_ADMIN" || role === "ADMIN") && (
          <Dialog
            open={isEditInstitutionOpen}
            onOpenChange={(open) => {
              setIsEditInstitutionOpen(open);
              if (!open) setInstitutionErrors({});
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="flex-1 rounded h-11 border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#1c1b1b] font-semibold text-xs sm:text-sm cursor-pointer"
              >
                <Building2 className="w-4 h-4 mr-2 text-[#d5c4ac]" />
                Editar Escola
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md rounded-lg bg-[#1A1A1A] border border-[#C0C2C5] text-[#e5e2e1] font-hanken p-5 shadow-[0_0_25px_rgba(0,0,0,0.8)]">
              <DialogHeader className="border-b border-[#414042] pb-3">
                <DialogTitle className="flex items-center gap-2 headline-sm text-[#e5e2e1]">
                  <Building2 className="w-4 h-4 text-[#8B5CF6]" />
                  Editar Dados da Instituição
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateInstitution} className="space-y-4 mt-3">
                <div className="space-y-1.5">
                  <Label htmlFor="instName" className="label-caps text-[#d5c4ac]">
                    Nome da Instituição *
                  </Label>
                  <Input
                    id="instName"
                    value={institutionData.name}
                    onChange={(e) => {
                      setInstitutionData({ ...institutionData, name: e.target.value });
                      if (institutionErrors.name)
                        setInstitutionErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className={`bg-[#0D0D0D] border rounded h-10 text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] outline-none ${
                      institutionErrors.name ? "border-[#ffb4ab]" : "border-[#414042]"
                    }`}
                  />
                  {institutionErrors.name && (
                    <p className="text-[#ffb4ab] text-xs">{institutionErrors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="instNif" className="label-caps text-[#d5c4ac]">
                    NIF
                  </Label>
                  <Input
                    id="instNif"
                    value={institutionData.nif}
                    onChange={(e) => {
                      setInstitutionData({ ...institutionData, nif: e.target.value });
                      if (institutionErrors.nif)
                        setInstitutionErrors((prev) => ({ ...prev, nif: "" }));
                    }}
                    className={`bg-[#0D0D0D] border rounded h-10 text-sm text-[#e5e2e1] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] outline-none ${
                      institutionErrors.nif ? "border-[#ffb4ab]" : "border-[#414042]"
                    }`}
                  />
                  {institutionErrors.nif && (
                    <p className="text-[#ffb4ab] text-xs">{institutionErrors.nif}</p>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#414042]">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditInstitutionOpen(false)}
                    className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#1c1b1b] rounded h-10 px-4 text-xs font-semibold"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdatingInstitution}
                    className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold rounded h-10 px-5 text-xs sm:text-sm shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] cursor-pointer"
                  >
                    {isUpdatingInstitution ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Salvar Instituição
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
}
