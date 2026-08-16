"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import Logo from "../../../assets/yhankoIMG.svg";
import RequestError from "../../../assets/ErroDeResposta.svg";
import { AiOutlineClose, Loader2 } from "@/lib/icons";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from "axios";
import axiosInstance from "@/service/api";

const safeStringRegex = /^[^<>';=]*$/;

const getPasswordSchema = z.object({
  email: z.string()
    .trim()
    .min(1, "E-mail é obrigatório")
    .email("Formato de e-mail inválido")
    .max(100, "E-mail demasiado longo")
    .regex(safeStringRegex, "Caracteres inválidos não permitidos"),
});

type FormData = z.infer<typeof getPasswordSchema>;

export default function ResetPassword() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(getPasswordSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/forgot-password", { email: data.email });
      setIsLoading(false);

      if (response.status === 202) {
        sessionStorage.setItem("resetEmail", data.email);
        reset();
        router.push("/verifyCode");
      }
        
    } catch (error: unknown) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        toast({
          description: (
            <div className="flex items-center gap-3 font-hanken">
              <div className="rounded-full w-8 h-8 flex justify-center items-center shrink-0 bg-red-100 dark:bg-red-950/40">
                <Image src={RequestError} alt="erro" width={24} height={24} />
              </div>
              <span className="text-[#334155] dark:text-[#e5e2e1] text-sm font-medium">{error?.response?.data.mensagem || "Erro ao solicitar recuperação."}</span>
            </div>
          ),
          action: <ToastAction altText="fechar" className="shadow-none border-none text-[#717F96] hover:bg-transparent"><AiOutlineClose /></ToastAction>,
          className: "border-l-4 border-l-[#DC2626]",
        });
      }
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center bg-background px-4 sm:px-8 md:px-12 py-10 font-hanken text-foreground antialiased overflow-x-hidden">
      <div className="w-full max-w-md mx-auto space-y-8 bg-card border border-border p-6 sm:p-8 rounded shadow-xs">
        
        {/* Topo / Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center gap-2.5">
            <Image src={Logo} alt="Yhanko Logo" width={38} height={38} className="w-9 h-9" priority />
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Yhanko<span className="text-primary">Educa</span></h1>
          </div>
          <div className="pt-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide mb-2">
              <KeyRound className="w-3 h-3" />
              Recuperação de Acesso
            </div>
            <h2 className="text-2xl font-bold text-foreground">Redefinir Palavra-passe</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
              Insira o seu e-mail institucional para receber um código SMS no seu telemóvel.
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form className="space-y-5 w-full" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="space-y-1.5">
            <label htmlFor="reset-email-input" className="block text-xs font-semibold text-foreground uppercase tracking-wide">
              E-mail Institucional
            </label>
            <Input
              id="reset-email-input"
              type="email"
              className={`w-full h-11 px-3.5 rounded border text-foreground text-sm bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                errors.email ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-border'
              }`}
              placeholder="exemplo@escola.ao" 
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-600 font-medium pl-0.5">{errors.email.message}</p>
            )}
          </div>



          {/* Botões */}
          <div className="space-y-3 pt-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-[#A78BFA] text-white font-semibold text-sm rounded transition-all shadow-xs cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-white" /> : "Enviar Código de Recuperação"}
            </Button>

            <Link href="/login" className="block w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border border-border bg-background hover:bg-muted text-foreground font-semibold text-sm rounded transition-all cursor-pointer"
              >
                Voltar ao Login
              </Button>
            </Link>
          </div>

        </form>

      </div>
    </main>
  );
}
