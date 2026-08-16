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
import { GrFormCheckmark, AiOutlineClose, Loader2 } from "@/lib/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import axiosInstance from "@/service/api";

import EyesOpened from "../../../assets/eye-open.svg";
import EyesOff from "../../../assets/eye-off.svg"; 
import RequestError from "../../../assets/ErroDeResposta.svg";
import RoundedIcon from "../../../assets/ErroDeResposta.svg";
import YhankoIMG from "../../../assets/yhankoIMG.svg";

// Regex simples para bloquear caracteres comuns em ataques de SQL Injection/XSS
const safeStringRegex = /^[^<>';=]*$/;

const loginSchema = z.object({
  user_name: z.string()
    .trim()
    .min(1, "E-mail/Utilizador é obrigatório")
    .max(100, "Demasiado longo")
    .regex(safeStringRegex, "Caracteres inválidos não permitidos"),
  user_pass: z.string()
    .trim()
    .min(1, "Senha é obrigatória")
    .max(100, "Demasiado longa")
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
            <div className="flex items-center gap-3">
              <div className="rounded-full w-8 h-8 flex justify-center items-center shrink-0">
                <Image src={RoundedIcon} alt="sucesso" width={32} height={32} />
              </div>
              <span className="text-[#717F96] text-sm">Login realizado com sucesso!</span>
            </div>
          ),
          action: (
            <ToastAction altText="fechar" className="shadow-none border-none text-[#717F96] hover:bg-transparent">
              <AiOutlineClose />
            </ToastAction>
          ),
          className: "border-l-4 border-l-[#1FC16B]",
        });
        
        router.push("/dashboard");
        reset();
      }

    } catch (error: unknown) {
      setIsLoading(false);
      if (error instanceof AxiosError) {
        toast({
          description: (
            <div className="flex items-center gap-3">
              <div className="rounded-full w-8 h-8 flex justify-center items-center shrink-0 bg-red-100">
                <Image src={RequestError} alt="erro" width={24} height={24} />
              </div>
              <span className="text-[#717F96] text-sm">{error?.response?.data.mensagem}</span>
            </div>
          ),
          action: (
            <ToastAction altText="fechar" className="shadow-none border-none text-[#717F96] hover:bg-transparent">
              <AiOutlineClose />
            </ToastAction>
          ),
          className: "border-l-4 border-l-[#FB3748]",
        });
      }
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-white font-sans antialiased overflow-x-hidden">
      
      {/* Lado Esquerdo - Banner Decorativo */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 min-h-screen backgroundGradient relative flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
            <Image src={YhankoIMG} alt="Logo Yhanko" width={40} height={40} className="w-10 h-10" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">Yhanko<span className="text-[#FF5777]">Educa</span></span>
        </div>

        <div className="space-y-6 max-w-lg">
          <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/20">
            Portal da Secretaria
          </div>
          <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight">
            Gestão Administrativa & Atendimento
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Introduza as suas credenciais de acesso para gerir matrículas, dados de alunos e expediente diário.
          </p>
        </div>

        <div className="text-xs text-white/60">
          &copy; {new Date().getFullYear()} Yhanko. Todos os direitos reservados.
        </div>
      </div>

      {/* Lado Direito - Formulário Responsivo */}
      <div className="w-full lg:w-7/12 xl:w-1/2 min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-16 py-10">
        <div className="w-full max-w-md mx-auto space-y-8">
          
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-3">
              <Image src={YhankoIMG} alt="Yhanko Logo" width={44} height={44} className="w-11 h-11" priority />
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Yhanko</h1>
            </div>

            <div className="pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171718]">Secretário/a</h2>
              <p className="text-sm text-[#717F96] mt-1 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
                Seja bem-vindo ao portal! Introduza as suas credenciais de acesso para aceder.
              </p>
            </div>
          </div>

          <form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="space-y-1">
              <div className="relative w-full">
                <Input
                  id="user-email-input"
                  type="text"
                  className={`peer w-full h-12 sm:h-14 pl-5 pr-4 pt-4 pb-1 rounded-xl border-2 border-[#E2E5F1] text-gray-800 text-sm focus:border-[#217EFD] focus-visible:ring-0 placeholder-transparent transition-all ${
                    errors.user_name ? 'border-[#FB3748]' : ''
                  }`}
                  placeholder=" " 
                  {...register("user_name")}
                />
                <label
                  htmlFor="user-email-input"
                  className="absolute left-4 text-xs sm:text-sm font-medium text-[#B7BFDE] bg-white px-1 transition-all duration-200 pointer-events-none
                  top-0 -translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                  peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-[#217EFD]"
                >
                  Digite o seu e-mail
                </label>
              </div>
              {errors.user_name && (
                <p className="text-xs text-[#FB3748] font-medium pl-1">{errors.user_name.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative w-full">
                <Input
                  id="user-pass-input"
                  type={isVisible ? "text" : "password"}
                  className={`peer w-full h-12 sm:h-14 pl-5 pr-12 pt-4 pb-1 rounded-xl border-2 border-[#E2E5F1] text-gray-800 text-sm focus:border-[#217EFD] focus-visible:ring-0 placeholder-transparent transition-all ${
                    errors.user_pass ? 'border-[#FB3748]' : ''
                  }`}
                  placeholder=" "
                  {...register("user_pass")} 
                />
                <label
                  htmlFor="user-pass-input"
                  className="absolute left-4 text-xs sm:text-sm font-medium text-[#B7BFDE] bg-white px-1 transition-all duration-200 pointer-events-none
                  top-0 -translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                  peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-[#217EFD]"
                >
                  Palavra-passe
                </label>

                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-4 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setIsVisible(!isVisible)}
                  aria-label={isVisible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                >
                  <Image src={isVisible ? EyesOff : EyesOpened} alt="Olho" width={22} height={22} className="w-5 h-5 opacity-70 hover:opacity-100" />
                </button>
              </div>
              {errors.user_pass && (
                <p className="text-xs text-[#FB3748] font-medium pl-1">{errors.user_pass.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#717F96] pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <div
                  className="relative w-5 h-5 flex items-center justify-center shrink-0"
                  onClick={toggleCheck}
                >
                  <input
                    type="checkbox"
                    id="check-box-afiliate"
                    className="sr-only"
                    checked={isChecked}
                    onChange={toggleCheck}
                  />
                  <div
                    className={`w-5 h-5 border-2 border-[#E2E5F1] rounded-xl flex items-center justify-center transition-all ${
                      isChecked ? "bg-[#217EFD] border-[#217EFD]" : "bg-white"
                    }`}
                  >
                    {isChecked && (
                      <GrFormCheckmark className="text-white text-xs font-bold" />
                    )}
                  </div>
                </div>
                <span>Manter a sessão</span>
              </label>

              <Link href="/password" className="hover:underline hover:text-[#217EFD] font-medium transition-colors">
                Esqueci minha palavra-passe
              </Link>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 sm:h-14 bg-[#FF5777] hover:bg-[#fc4667] text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-[#FF5777]/30 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" /> : "Entrar"}
              </Button>
            
              <Link href="/login" className="block w-full">
                <Button
                  type="button"
                  className="w-full h-12 sm:h-14 bg-[#a550f5] hover:bg-[#823ef0] text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-none hover:shadow-lg hover:shadow-[#a550f5]/30 cursor-pointer"
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