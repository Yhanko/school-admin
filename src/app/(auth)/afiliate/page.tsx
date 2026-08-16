"use client";

import { z } from "zod";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import saveCookie from "@/hooks/Hooks/Login/useSetTokenLoginAfiliate";
import { useEntityStore } from "@/hooks/useEntityStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GrFormCheckmark, AiOutlineClose, Loader2, BookOpen } from "@/lib/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import axiosInstance from "@/service/api";

import EyesOpened from "../../../assets/eye-open.svg";
import EyesOff from "../../../assets/eye-off.svg"; 
import RequestError from "../../../assets/ErroDeResposta.svg";
import RoundedIcon from "../../../assets/roundedIcon.svg";
import YhankoIMG from "../../../assets/yhankoIMG.svg";

const safeStringRegex = /^[^<>';=]*$/;

const loginSchema = z.object({
  user_name: z.string()
    .trim()
    .min(1, "E-mail ou Utilizador é obrigatório")
    .max(100, "Demasiado longo")
    .regex(safeStringRegex, "Caracteres inválidos não permitidos"),
  user_pass: z.string()
    .trim()
    .min(1, "Palavra-passe é obrigatória")
    .max(100, "Demasiada longa")
    .regex(safeStringRegex, "Caracteres inválidos não permitidos"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginAffliantePage() {
  const { toast } = useToast();
  const { setLoginHash } = useEntityStore();
  const [isChecked, setIsChecked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const toggleCheck = () => {
    setIsChecked(!isChecked);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("afiliados/login", data);

      if (response.status === 202) {
        setIsLoading(true);
        const dataResponse = await response.data.mensagem; 
        const remember = isChecked;

        saveCookie(dataResponse, remember);
        setLoginHash(dataResponse);

        toast({
          description: (
            <div className="flex items-center gap-3 font-hanken">
              <div className="rounded-full w-8 h-8 flex justify-center items-center shrink-0">
                <Image src={RoundedIcon} alt="sucesso" width={32} height={32} />
              </div>
              <span className="text-[#334155] dark:text-[#e5e2e1] text-sm font-medium">Login realizado com sucesso!</span>
            </div>
          ),
          action: (
            <ToastAction altText="fechar" className="shadow-none border-none text-[#717F96] hover:bg-transparent">
              <AiOutlineClose />
            </ToastAction>
          ),
          className: "border-l-4 border-l-[#10B981]",
        });
        
        router.push("/dashboard");
        reset();
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
              <span className="text-[#334155] dark:text-[#e5e2e1] text-sm font-medium">{error?.response?.data.mensagem || "Erro ao realizar login."}</span>
            </div>
          ),
          action: (
            <ToastAction altText="fechar" className="shadow-none border-none text-[#717F96] hover:bg-transparent">
              <AiOutlineClose />
            </ToastAction>
          ),
          className: "border-l-4 border-l-[#DC2626]",
        });
      }
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-background font-hanken text-foreground antialiased overflow-x-hidden">
      
      {/* Lado Esquerdo - Banner Decorativo */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 min-h-screen bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] relative flex-col justify-between p-12 text-white shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded backdrop-blur-md border border-white/20">
            <Image src={YhankoIMG} alt="Logo Yhanko" width={36} height={36} className="w-9 h-9" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">Yhanko<span className="text-[#DDD6FE]">Educa</span></span>
        </div>

        <div className="space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded text-xs font-semibold text-white border border-white/20 shadow-xs">
            <BookOpen className="w-3.5 h-3.5" />
            Portal da Secretaria & Tesouraria
          </div>
          <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight">
            Gestão Administrativa & Atendimento
          </h2>
          <p className="text-white/85 text-sm leading-relaxed">
            Controlo de matrículas, emissão de recibos, acompanhamento financeiro de propinas e organização pedagógica da instituição.
          </p>
        </div>

        <div className="text-xs text-white/70">
          &copy; {new Date().getFullYear()} Yhanko Educa. Todos os direitos reservados.
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-7/12 xl:w-1/2 min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-16 py-10">
        <div className="w-full max-w-md mx-auto space-y-8 bg-card border border-border p-6 sm:p-8 rounded shadow-xs">

          {/* Topo / Logo */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-2 lg:hidden">
              <Image src={YhankoIMG} alt="Yhanko Logo" width={36} height={36} className="w-9 h-9" priority />
              <span className="text-xl font-extrabold text-foreground tracking-tight">Yhanko<span className="text-primary">Educa</span></span>
            </div>

            <div className="pt-2">
              <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide mb-2">
                Acesso Secretaria
              </div>
              <h1 className="text-2xl font-bold text-foreground">Secretaria / Atendimento</h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
                Inicie sessão com o seu identificador de secretária ou tesouraria.
              </p>
            </div>
          </div>

          {/* Formulário */}
          <form className="space-y-5 w-full" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Input Usuário */}
            <div className="space-y-1.5">
              <label htmlFor="user-name-input" className="block text-xs font-semibold text-foreground uppercase tracking-wide">
                Utilizador ou E-mail
              </label>
              <Input
                id="user-name-input"
                type="text"
                className={`w-full h-11 px-3.5 rounded border text-foreground text-sm bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                  errors.user_name ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-border'
                }`}
                placeholder="nome.utilizador"
                {...register("user_name")}
              />
              {errors.user_name && (
                <p className="text-xs text-red-600 font-medium pl-0.5">{errors.user_name.message}</p>
              )}
            </div>

            {/* Input Senha */}
            <div className="space-y-1.5">
              <label htmlFor="user-pass-input" className="block text-xs font-semibold text-foreground uppercase tracking-wide">
                Palavra-passe
              </label>
              <div className="relative w-full">
                <Input
                  id="user-pass-input"
                  type={isVisible ? "text" : "password"}
                  className={`w-full h-11 px-3.5 pr-11 rounded border text-foreground text-sm bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all ${
                    errors.user_pass ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : 'border-border'
                  }`}
                  placeholder="••••••••"
                  {...register("user_pass")}
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
              {errors.user_pass && (
                <p className="text-xs text-red-600 font-medium pl-0.5">{errors.user_pass.message}</p>
              )}
            </div>

            {/* Manter Sessão */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <div
                  className="relative w-4 h-4 flex items-center justify-center shrink-0"
                  onClick={toggleCheck}
                >
                  <input
                    type="checkbox"
                    id="keep-session-afiliate"
                    className="sr-only"
                    checked={isChecked}
                    onChange={toggleCheck}
                  />
                  <div
                    className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${
                      isChecked ? "bg-primary border-primary" : "bg-background border-border"
                    }`}
                  >
                    {isChecked && (
                      <GrFormCheckmark className="text-white text-[10px] font-bold" />
                    )}
                  </div>
                </div>
                <span>Manter a sessão</span>
              </label>

              <Link href="/password" className="hover:underline text-primary font-semibold transition-colors">
                Recuperar palavra-passe
              </Link>
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3 pt-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary hover:bg-[#A78BFA] text-white font-semibold text-sm rounded transition-all shadow-xs cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto text-white" /> : "Entrar como Secretaria"}
              </Button>

              <Link href="/login" className="block w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 border border-border bg-background hover:bg-muted text-foreground font-semibold text-sm rounded transition-all cursor-pointer"
                >
                  Entrar como Director Geral
                </Button>
              </Link>
            </div>

          </form>

        </div>
      </div>

    </main>
  );
}