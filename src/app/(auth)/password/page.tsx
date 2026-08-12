"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import Logo from "../../../assets/yhankoIMG.svg";
import RequestError from "../../../assets/ErroDeResposta.svg";
import { AiOutlineClose, Loader2 } from "@/lib/icons";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useEntityStore } from "@/hooks/useEntityStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from "axios";
import axiosInstance from "@/service/api";

const getPasswordSchema = z.object({
  email: z.string().email("Formato de e-mail inválido").nonempty("E-mail é obrigatório"),
  canal: z.enum(["E-mail", "SMS"]),
});

type FormData = z.infer<typeof getPasswordSchema>;

export default function ResetPassword() {
  const { setEtidade } = useEntityStore();
  const { toast } = useToast();
  const [canal, setCanal] = useState<"E-mail" | "SMS">("SMS");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(getPasswordSchema),
    defaultValues: { canal: "SMS" },
  });

  useEffect(() => {
    setValue("canal", canal);
  }, [canal, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    const requestBody = {
      email: data.email,
      canal,
    };

    try {
      const response = await axiosInstance.post("/clientes/codigo-seguranca/recuperar", requestBody);
      setIsLoading(false);

      if (response.status === 202) {
        const infoData = await response.data.info.entidade; 
        setEtidade(infoData);
        reset();
        router.push("/verifyCode");
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
        
        {/* Topo / Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex items-center gap-3">
            <Image src={Logo} alt="Yhanko Logo" width={44} height={44} className="w-11 h-11" priority />
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Yhanko</h1>
          </div>
          <div className="pt-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#171718]">Redefina a sua palavra-passe</h2>
            <p className="text-sm text-[#717F96] mt-1 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
              Preencha o campo abaixo para recuperar a sua palavra-passe de acesso.
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="space-y-1">
            <div className="relative w-full">
              <Input
                id="reset-email-input"
                type="email"
                className={`peer w-full h-12 sm:h-14 pl-5 pr-4 pt-4 pb-1 rounded-xl border-2 border-[#E2E5F1] text-gray-800 text-sm focus:border-[#217EFD] focus-visible:ring-0 placeholder-transparent transition-all ${
                  errors.email ? 'border-[#FB3748]' : ''
                }`}
                placeholder=" " 
                {...register("email")}
              />
              <label
                htmlFor="reset-email-input"
                className="absolute left-4 text-xs sm:text-sm font-medium text-[#B7BFDE] bg-white px-1 transition-all duration-200 pointer-events-none
                top-0 -translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-[#217EFD]"
              >
                Digite o seu e-mail
              </label>
            </div>
            {errors.email && (
              <p className="text-xs text-[#FB3748] font-medium pl-1">{errors.email.message}</p>
            )}
          </div>

          {/* Opções de Envio: Radio E-mail / SMS */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl border border-[#E2E5F1]">
            <span className="text-xs sm:text-sm font-medium text-[#717F96]">Receber Código por:</span>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-gray-700 font-medium">
                <input
                  type="radio"
                  name="canal-options"
                  className="w-4 h-4 text-[#217EFD] focus:ring-[#217EFD]"
                  checked={canal === "E-mail"}
                  onChange={() => setCanal("E-mail")}
                />
                E-mail
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-gray-700 font-medium">
                <input
                  type="radio"
                  name="canal-options"
                  className="w-4 h-4 text-[#217EFD] focus:ring-[#217EFD]"
                  checked={canal === "SMS"}
                  onChange={() => setCanal("SMS")}
                />
                SMS
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 sm:h-14 bg-[#FF5777] hover:bg-[#fc4667] text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-[#FF5777]/30 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" /> : "Enviar Código"}
            </Button>

            <Link href="/login" className="block w-full">
              <Button
                type="button"
                className="w-full h-12 sm:h-14 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm sm:text-base rounded-xl transition-all border border-[#E2E5F1] shadow-none cursor-pointer"
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
