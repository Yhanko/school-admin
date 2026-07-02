"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AxiosError } from "axios";
import axiosInstance from "@/service/api";
import { isStrongPassword } from "@/utils/regex";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useState, useEffect } from "react";
import { AiOutlineClose } from "@/lib/icons";
import RequestError from "../../../assets/ErroDeResposta.svg";
import RoundedIcon from "../../../assets/roundedIcon.svg";
import EyesOpened from "../../../assets/eye-open.svg";
import EyesOff from "../../../assets/eye-off.svg";
import { Loader2 } from "@/lib/icons";

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

export function ChangeNewPassword({nextStep }: {  nextStep: () => void}){
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible ] = useState(false);
  const [visible, setVisible ] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const fetchUser = async () => {
    try {
        const response = await axiosInstance.get('/users/me');
        setUser(response.data);
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  useEffect(() => {
      fetchUser();
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors}
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

    if (!user) return;

    try {
      setIsLoading(true);
      await axiosInstance.patch(`/users/${user.id}`, { password: data.senha });
  
      toast({
        description: (
        <div className="flex items-center gap-4 ">
            <div className="rounded-full w-8 h-8 flex justify-center items-center">
            <Image src={RoundedIcon} alt="icon"  />
            </div>
            <span className="text-[#717F96]">Senha atualizada com sucesso!</span>
        </div>
        ),
        action: <ToastAction altText="close" className="shadow-none border-none text-[#717F96] hover:bg-transparent"><AiOutlineClose /></ToastAction>,
        className: "border-l-4 border-l-[#1FC16B]",
      });

      reset(); 
      setIsLoading(false);
      nextStep();
    } catch (error: unknown) {
      setIsLoading(false); 
      if (error instanceof AxiosError) {
        toast({
          description: (
            <div className="flex items-center gap-4 ">
              <div className="rounded-full w-8 h-8 flex justify-center items-center bg-[fill: rgba(251, 55, 72, 0.16)]">
                <Image src={RequestError} alt="icon"  />
              </div>
              <span className="text-[#717F96]">{error?.response?.data.message || 'Falha ao redefinir a senha'}</span>
            </div>
          ),
          action: <ToastAction altText="close" className="shadow-none border-none text-[#717F96] hover:bg-transparent"><AiOutlineClose /></ToastAction>,
          className: "border-l-4 border-l-[#FB3748]",
        });
      }
    } 
  };

  return(
    <section className="space-y-8 flex flex-col items-center h-[55rem] w-[34rem] pt-4">
    <div className="flex flex-col space-y-4 items-center pt-4">
        <div className="border-[2px] border-[#80848a] rounded-full w-[9rem] h-[9rem] flex justify-center items-center bg-indigo-50">
            <span className="text-3xl font-bold text-indigo-500">
                {user?.profile?.firstName?.[0]}{user?.profile?.lastName?.[0]}
            </span>
        </div>
        <span className="text-[#2D3339] font-semibold text-[1rem]">
            {user?.profile?.firstName} {user?.profile?.lastName}
        </span>
    </div>

    <div className="flex flex-col w-[40rem] space-y-6 2xl:space-y-16 lg:space-y-12 items-center">
        <div className="text-center space-y-4">
            <h1 className="text-[#171718] font-semibold text-lg lg:text-xl mb-2">Redefinição de Senha</h1>
            <span className="text-[#717F96] text-sm">
                Defina uma nova senha para<br />  acessar a sua conta.
            </span>
        </div>
    </div>

    <form className="flex flex-col w-full max-w-md space-y-4 xl:space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative w-full">
            <Input
            id="floatin-input"
            type={ visible ? "text" : "password"}
            className={`peer w-full h-12 lg:h-14 pl-6 pt-4 pb-2 border-[2px] border-[#E2E5F1] focus:border-[#E2E5F1] focus-visible:border-[#E2E5F1] focus-visible:text-[#717F96] placeholder-transparent focus:outline-none ${errors.senha &&   'border-[#D03816]'}`}
            placeholder=" " 
            {...register("senha")}
            />
            <label
            htmlFor="floating-input"
            className="absolute left-6 text-sm font-medium text-[#B7BFDE] bg-white px-1 transition-all duration-300 transform origin-top-left
            top-0 -translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[#B7BFDE]
            peer-focus:top-0 peer-focus:text-[#717F96]"
            >
            Nova senha
            </label>

            <div className="absolute top-4 right-4" onClick={() => setVisible(!visible)}>
                <Image src={visible ? EyesOff : EyesOpened } alt="eys" className="w-6 h-6 cursor-pointer"/> 
            </div>
        </div>

        <div className="relative w-full mt-6">
            <Input
            id="floating-input"
            type={ isVisible ? "text" : "password"}
            className={`peer w-full h-12 lg:h-14 pl-6 pt-4 pb-2 border-[2px] border-[#E2E5F1] focus:border-[#E2E5F1] focus-visible:border-[#E2E5F1] focus-visible:text-[#717F96] placeholder-transparent focus:outline-none ${errors.confirmar_senha && 'border-[#D03816]'}`}
            placeholder=" "
            {...register("confirmar_senha")} 
            />
            <label
            htmlFor="floating-input"
            className="absolute left-6 text-sm font-medium text-[#B7BFDE] bg-white px-1 transition-all duration-300 transform origin-top-left
            top-0 -translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[#B7BFDE]
            peer-focus:top-0 peer-focus:text-[#717F96]"
            >
            Repita a nova senha
            </label>

            <div className="absolute top-4 right-4" onClick={() => setIsVisible(!isVisible)}>
                <Image src={isVisible ? EyesOff : EyesOpened } alt="eys" className="w-6 h-6 cursor-pointer"/> 
            </div>
        </div>  
        {passwordError && (
            <span className="text-red-500 text-sm mt-2">{passwordError}</span>
        )}
        
        {errors.confirmar_senha && (
            <span className="text-red-500 text-sm mt-2">{errors.confirmar_senha.message}</span>
        )}
        <div>
            <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#5856eb] rounded-full cursor-pointer shadow-none hover:bg-[#3f3cf1] text-white w-full mb-10 h-12 lg:h-14 xl:mt-9">
            {isLoading ? <Loader2  className="animate-spin" /> : "Redefinir"}
            </Button>
        </div>
    </form>
    </section>
  )
}