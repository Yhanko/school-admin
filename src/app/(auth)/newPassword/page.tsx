"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { AxiosError } from "axios";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { isStrongPassword } from "@/utils/regex";
import { AiOutlineClose, Loader2, Lock } from "@/lib/icons";
import RequestError from "../../../assets/ErroDeResposta.svg";
import EyesOpened from "../../../assets/eye-open.svg";
import EyesOff from "../../../assets/eye-off.svg";
import YhankoIMG from "../../../assets/yhankoIMG.svg";
import { useEntityStore } from "@/hooks/useEntityStore";
import { useState } from "react";

const passwordSchema = z
  .object({
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").nonempty("Senha é obrigatória"),
    confirmar_senha: z.string().min(6, "Repetir a senha é obrigatório"),
  })
  .refine((data) => data.senha === data.confirmar_senha, {
    message: "As palavras-passe não coincidem",
    path: ["confirmar_senha"],
  });

type FormData = z.infer<typeof passwordSchema>;

export default function NewPassword() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!isStrongPassword(data.senha)) {
      setPasswordError("A palavra-passe deve conter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.");
      return;
    } else {
      setPasswordError(null); 
    }

    try {
      setIsLoading(true);
      const email = sessionStorage.getItem("resetEmail");
      const otp = sessionStorage.getItem("resetCode");

      if (!email || !otp) {
        throw new Error("Informações de recuperação ausentes.");
      }

      const requestBody = {
        email: email,
        otp: otp,
        newPassword: data.senha,
      };

      const response = await axiosInstance.post("/auth/reset-password", requestBody);
      setIsLoading(false);

      if (response.status === 200 || response.status === 201 || response.status === 202) {
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("resetCode");
        reset(); 
        router.push("/changed");
      } 
    } catch (error: any) {
      setIsLoading(false); 
      toast({
        description: (
          <div className="flex items-center gap-3 font-hanken">
            <div className="rounded-full w-8 h-8 flex justify-center items-center shrink-0 bg-red-100 dark:bg-red-950/40">
              <Image src={RequestError} alt="erro" width={24} height={24} />
            </div>
            <span className="text-[#334155] dark:text-[#e5e2e1] text-sm font-medium">{error?.response?.data.message || error.message || "Erro ao redefinir a palavra-passe."}</span>
          </div>
        ),
        action: <ToastAction altText="fechar" className="shadow-none border-none text-[#717F96] hover:bg-transparent"><AiOutlineClose /></ToastAction>,
        className: "border-l-4 border-l-[#DC2626]",
      });
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center bg-background px-4 sm:px-8 md:px-12 py-10 font-hanken text-foreground antialiased overflow-x-hidden">
      <div className="w-full max-w-md mx-auto space-y-8 bg-card border border-border p-6 sm:p-8 rounded shadow-xs">
        
        {/* Topo / Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center gap-2.5">
            <Image src={YhankoIMG} alt="Yhanko Logo" width={38} height={38} className="w-9 h-9" priority />
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Yhanko<span className="text-primary">Educa</span></h1>
          </div>
          <div className="pt-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide mb-2">
              <Lock className="w-3 h-3" />
              Segurança da Conta
            </div>
            <h2 className="text-2xl font-bold text-foreground">Definir Nova Palavra-passe</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
              Crie uma palavra-passe segura para proteger o seu acesso ao portal institucional.
            </p>
          </div>
        </div>

        <form className="space-y-5 w-full" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Nova Senha */}
          <div className="space-y-1.5">
            <label htmlFor="new-pass-input" className="block text-xs font-semibold text-foreground uppercase tracking-wide">
              Nova Palavra-passe
            </label>
            <div className="relative w-full">
              <Input
                id="new-pass-input"
                type={isVisible ? "text" : "password"}
                className={`w-full h-11 px-3.5 pr-11 rounded border text-foreground text-sm bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                  errors.senha || passwordError ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-border'
                }`}
                placeholder="••••••••"
                {...register("senha")} 
              />
              <button
                type="button"
                className="absolute top-1/2 -translate-y-1/2 right-3 p-1 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
                onClick={() => setIsVisible(!isVisible)}
                aria-label={isVisible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
              >
                <Image src={isVisible ? EyesOff : EyesOpened} alt="Olho" width={18} height={18} className="w-4 h-4 opacity-70 hover:opacity-100" />
              </button>
            </div>
            {errors.senha && (
              <p className="text-xs text-red-600 font-medium pl-0.5">{errors.senha.message}</p>
            )}
            {passwordError && (
              <p className="text-xs text-red-600 font-medium pl-0.5 leading-normal">{passwordError}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-1.5">
            <label htmlFor="confirm-pass-input" className="block text-xs font-semibold text-foreground uppercase tracking-wide">
              Confirmar Nova Palavra-passe
            </label>
            <div className="relative w-full">
              <Input
                id="confirm-pass-input"
                type={visible ? "text" : "password"}
                className={`w-full h-11 px-3.5 pr-11 rounded border text-foreground text-sm bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                  errors.confirmar_senha ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-border'
                }`}
                placeholder="••••••••"
                {...register("confirmar_senha")} 
              />
              <button
                type="button"
                className="absolute top-1/2 -translate-y-1/2 right-3 p-1 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
                onClick={() => setVisible(!visible)}
                aria-label={visible ? "Ocultar confirmação" : "Mostrar confirmação"}
              >
                <Image src={visible ? EyesOff : EyesOpened} alt="Olho" width={18} height={18} className="w-4 h-4 opacity-70 hover:opacity-100" />
              </button>
            </div>
            {errors.confirmar_senha && (
              <p className="text-xs text-red-600 font-medium pl-0.5">{errors.confirmar_senha.message}</p>
            )}
          </div>

          {/* Botão */}
          <div className="pt-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-[#A78BFA] text-white font-semibold text-sm rounded transition-all shadow-xs cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-white" /> : "Atualizar Palavra-passe"}
            </Button>
          </div>

        </form>

      </div>
    </main>
  );
}
