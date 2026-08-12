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
import { AiOutlineClose, Loader2 } from "@/lib/icons";
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
    message: "As senhas não coincidem",
    path: ["confirmar_senha"],
  });

type FormData = z.infer<typeof passwordSchema>;

export default function NewPassword() {
  const { entidade } = useEntityStore();
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
      setPasswordError("A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, um número e um caractere especial.");
      return;
    } else {
      setPasswordError(null); 
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.patch(`/clientes/${entidade}/redifinir-senha`, data);
      setIsLoading(false);

      if (response.status === 202) {
        reset(); 
        router.push("/changed");
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
            <h2 className="text-xl sm:text-2xl font-bold text-[#171718]">Nova Palavra-passe</h2>
            <p className="text-sm text-[#717F96] mt-1 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
              Crie uma nova palavra-passe forte para proteger o seu acesso ao sistema.
            </p>
          </div>
        </div>

        <form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Nova Senha */}
          <div className="space-y-1">
            <div className="relative w-full">
              <Input
                id="new-pass-input"
                type={isVisible ? "text" : "password"}
                className={`peer w-full h-12 sm:h-14 pl-5 pr-12 pt-4 pb-1 rounded-xl border-2 border-[#E2E5F1] text-gray-800 text-sm focus:border-[#217EFD] focus-visible:ring-0 placeholder-transparent transition-all ${
                  errors.senha || passwordError ? 'border-[#FB3748]' : ''
                }`}
                placeholder=" "
                {...register("senha")} 
              />
              <label
                htmlFor="new-pass-input"
                className="absolute left-4 text-xs sm:text-sm font-medium text-[#B7BFDE] bg-white px-1 transition-all duration-200 pointer-events-none
                top-0 -translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-[#217EFD]"
              >
                Nova palavra-passe
              </label>

              <button
                type="button"
                className="absolute top-1/2 -translate-y-1/2 right-4 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setIsVisible(!isVisible)}
              >
                <Image src={isVisible ? EyesOff : EyesOpened} alt="Olho" width={22} height={22} className="w-5 h-5 opacity-70 hover:opacity-100" />
              </button>
            </div>
            {errors.senha && (
              <p className="text-xs text-[#FB3748] font-medium pl-1">{errors.senha.message}</p>
            )}
            {passwordError && (
              <p className="text-xs text-[#FB3748] font-medium pl-1 leading-normal">{passwordError}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-1">
            <div className="relative w-full">
              <Input
                id="confirm-pass-input"
                type={visible ? "text" : "password"}
                className={`peer w-full h-12 sm:h-14 pl-5 pr-12 pt-4 pb-1 rounded-xl border-2 border-[#E2E5F1] text-gray-800 text-sm focus:border-[#217EFD] focus-visible:ring-0 placeholder-transparent transition-all ${
                  errors.confirmar_senha ? 'border-[#FB3748]' : ''
                }`}
                placeholder=" "
                {...register("confirmar_senha")} 
              />
              <label
                htmlFor="confirm-pass-input"
                className="absolute left-4 text-xs sm:text-sm font-medium text-[#B7BFDE] bg-white px-1 transition-all duration-200 pointer-events-none
                top-0 -translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-[#217EFD]"
              >
                Confirmar nova palavra-passe
              </label>

              <button
                type="button"
                className="absolute top-1/2 -translate-y-1/2 right-4 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setVisible(!visible)}
              >
                <Image src={visible ? EyesOff : EyesOpened} alt="Olho" width={22} height={22} className="w-5 h-5 opacity-70 hover:opacity-100" />
              </button>
            </div>
            {errors.confirmar_senha && (
              <p className="text-xs text-[#FB3748] font-medium pl-1">{errors.confirmar_senha.message}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 sm:h-14 bg-[#FF5777] hover:bg-[#fc4667] text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-[#FF5777]/30 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" /> : "Guardar Nova Palavra-passe"}
            </Button>
          </div>

        </form>

      </div>
    </main>
  );
}
