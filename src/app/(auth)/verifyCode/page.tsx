"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import axiosInstance from "@/service/api"; 
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from "axios";
import { Loader2, ShieldCheck, AiOutlineClose } from "@/lib/icons";
import RequestError from "../../../assets/ErroDeResposta.svg";
import YhankoIMG from "../../../assets/yhankoIMG.svg";
import { useEntityStore } from "@/hooks/useEntityStore";

const verificationSchema = z.object({
  code: z
    .string({
      required_error: "O código de verificação é obrigatório",
    })
    .min(4, "O código deve ter pelo menos 4 dígitos"),
});

type LoginFormData = z.infer<typeof verificationSchema>;

export default function VerifyCode() {
  const { entidade } = useEntityStore();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(verificationSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true); 
    const responseBody = {
      codigo_seguranca: data.code,
      entidade: entidade
    };
    try {
      const response = await axiosInstance.post("clientes/codigo-seguranca/redifinir", responseBody);
      setIsLoading(false);

      if (response.status === 202) {
        reset();
        router.push("/newPassword"); 
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
              <span className="text-[#334155] dark:text-[#e5e2e1] text-sm font-medium">{error?.response?.data.mensagem || "Código inválido ou expirado."}</span>
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
            <Image src={YhankoIMG} alt="Yhanko Logo" width={38} height={38} className="w-9 h-9" priority />
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Yhanko<span className="text-primary">Educa</span></h1>
          </div>
          <div className="pt-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide mb-2">
              <ShieldCheck className="w-3 h-3" />
              Verificação em 2 Passos
            </div>
            <h2 className="text-2xl font-bold text-foreground">Código de Segurança</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
              Insira o código de validação que enviamos para prosseguir com a recuperação.
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form className="space-y-5 w-full" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="space-y-1.5">
            <label htmlFor="code-input" className="block text-xs font-semibold text-foreground uppercase tracking-wide text-center">
              Código de Verificação
            </label>
            <Input
              id="code-input"
              type="text"
              className={`w-full h-12 px-3.5 text-center font-mono text-xl tracking-widest rounded border text-foreground bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                errors.code ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-border'
              }`}
              placeholder="000000" 
              {...register("code")}
            />
            {errors.code && (
              <p className="text-xs text-red-600 font-medium pl-0.5 text-center">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-3 pt-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-[#A78BFA] text-white font-semibold text-sm rounded transition-all shadow-xs cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-white" /> : "Validar Código"}
            </Button>

            <Link href="/password" className="block w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border border-border bg-background hover:bg-muted text-foreground font-semibold text-sm rounded transition-all cursor-pointer"
              >
                Voltar
              </Button>
            </Link>
          </div>

        </form>

      </div>
    </main>
  );
}