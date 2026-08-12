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
import { Loader2 } from "lucide-react";
import { AiOutlineClose } from "@/lib/icons";
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
            <div className="flex items-center gap-3">
              <div className="rounded-full w-8 h-8 flex justify-center items-center shrink-0 bg-red-100">
                <Image src={RequestError} alt="erro" width={24} height={24} />
              </div>
              <span className="text-[#717F96] text-sm">{error?.response?.data.mensagem}</span>
            </div>
          ),
          action: <ToastAction altText="fechar" className="shadow-none border-none text-[#717F96] hover:bg-transparent"><AiOutlineClose /></ToastAction>,
          className: "border-l-4 border-l-[#FB3748]",
        });
      }
    } 
  };
      
  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center bg-white px-4 sm:px-8 md:px-12 py-10 font-sans antialiased overflow-x-hidden">
      <div className="w-full max-w-md mx-auto space-y-8">
        
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center gap-3">
            <Image src={YhankoIMG} alt="Yhanko Logo" width={44} height={44} className="w-11 h-11" priority />
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Yhanko</h1>
          </div>
          <div className="pt-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#171718]">Código de Verificação</h2>
            <p className="text-sm text-[#717F96] mt-1 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
              Insira o código enviado por E-mail ou SMS para continuar a redefinição.
            </p>
          </div>
        </div>

        <form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="space-y-1">
            <div className="relative w-full">
              <Input
                id="code-input"
                type="text"
                className={`peer w-full h-12 sm:h-14 pl-5 pr-4 pt-4 pb-1 text-center font-mono text-lg tracking-widest rounded-xl border-2 border-[#E2E5F1] text-gray-800 focus:border-[#217EFD] focus-visible:ring-0 placeholder-transparent transition-all ${
                  errors.code ? 'border-[#FB3748]' : ''
                }`}
                placeholder=" " 
                {...register("code")}
              />
              <label
                htmlFor="code-input"
                className="absolute left-4 text-xs sm:text-sm font-medium text-[#B7BFDE] bg-white px-1 transition-all duration-200 pointer-events-none
                top-0 -translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-[#217EFD]"
              >
                Código de 6 dígitos
              </label>
            </div>
            {errors.code && (
              <p className="text-xs text-[#FB3748] font-medium pl-1 text-center">{errors.code.message}</p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 sm:h-14 bg-[#FF5777] hover:bg-[#fc4667] text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-[#FF5777]/30 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" /> : "Verificar Código"}
            </Button>

            <Link href="/password" className="block w-full">
              <Button
                type="button"
                className="w-full h-12 sm:h-14 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm sm:text-base rounded-xl transition-all border border-[#E2E5F1] shadow-none cursor-pointer"
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