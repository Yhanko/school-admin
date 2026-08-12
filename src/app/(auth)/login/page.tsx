"use client";

//Configurações
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation'
import axiosInstance from "@/service/api";
//components
import { ToastAction } from "@/components/ui/toast";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
///Icones e imagens

import EyesOpened from "../../../assets/eye-open.svg";
import EyesOff from "../../../assets/eye-off.svg";
import { GrFormCheckmark, Loader2, AiOutlineClose } from "@/lib/icons";
import RequestError from "../../../assets/ErroDeResposta.svg";
import RoundedIcon from "../../../assets/roundedIcon.svg";
import YhankoIMG from "../../../assets/yhankoIMG.svg";
//Hook
import { useAuth } from "@/store/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Definindo o schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email("Formato de e-mail inválido").nonempty("E-mail é obrigatório"),
  senha: z.string({required_error: "Senha é obrigatória"}).nonempty("Senha é obrigatória"),
});

// Tipo inferido do schema do Zod
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible ] = useState(false)
  
const toggleCheck = () => {
  setIsChecked(!isChecked);
};
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver( loginSchema),
  });

  const { setAuth } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/auth/login", {
        email: data.email,
        password: data.senha
      });

      if (response.status === 201 || response.status === 200) {
        const token = response.data.access_token;
        
        // Fetch User Profile with auth header directly
        const userProfile = await axiosInstance.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Save to global state (js-cookie automatically via store)
        setAuth(userProfile.data, token);

        toast({
          description: (
            <div className="flex items-center gap-4 ">
              <div className="rounded-full w-8 h-8 flex justify-center items-center">
                <Image src={RoundedIcon} alt="icon"  />
              </div>
              <span className="text-[#717F96]">Login realizado com sucesso!</span>
            </div>
          ),
          action: <ToastAction altText="close" className="shadow-none border-none text-[#717F96] hover:bg-transparent"><AiOutlineClose /></ToastAction>,
          className: "border-l-4 border-l-[#1FC16B]",
        });
        
        router.push("/dashboard");
      }
    } catch (error) {
      setIsLoading(false);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || "Erro ao realizar o login.";
        toast({
          description: (
            <div className="flex items-center gap-4 ">
              <div className="rounded-full w-8 h-8 flex justify-center items-center bg-[fill: rgba(251, 55, 72, 0.16)]">
                <Image src={RequestError} alt="icon"  />
              </div>
              <span className="text-[#717F96]">{message}</span>
            </div>
          ),
          action: <ToastAction altText="close" className="shadow-none border-none text-[#717F96] hover:bg-transparent"><AiOutlineClose /></ToastAction>,
          className: "border-l-4 border-l-[#FB3748]",
        });
    }
  };
  
  return (
    <main className="flex bg-[#FFFFFF]">
       <div className="hidden lg:block lg:w-[45vw] 2xl:h-screen xl:h-[130vh] backgroundGradient"></div>
        <div className="w-[55vw] flex flex-col justify-center">
          <div className="flex flex-col justify-center items-center mt-12 md:mt-20 sm:mt-8 lg:mt-40 xl:mt-5 2xl:mt-14 lg:h-[100vh] 2xl:h-[70vh] w-[55vw]">
          <div className="flex flex-col w-[40rem] h-60 space-y-6 2xl:space-y-16 justify-center items-center xl:-mt-28">
            <div className="flex justify-center items-center space-x-3">
                <Image src={YhankoIMG} alt="logo" className="h-12 w-12 xl:h-12 2xl:h-14"/>
                <h1 className="text-black font-bold">Yhanko</h1>
            </div>
          
            <div className="text-center">
              <h1 className="text-[#171718] font-semibold text-lg lg:text-xl mb-3">Director Geral</h1>
              <span className="text-[#717F96] text-sm lg:text-base">
                Seja bem-vindo a melhor gestão escolar!<br/>
                A melhor gestão para a tua instituição de ensino
              </span>
            </div>
          </div>

          <form className="flex flex-col w-full max-w-md h-96 mt-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative w-full mt-2">
            <Input
              id="floating-input"
              type="email"
              className={`peer w-full h-12 lg:h-14 pl-6 pt-4 pb-2 rounded border-[2px] border-[#E2E5F1] focus:border-[#E2E5F1] focus-visible:border-[#E2E5F1] focus-visible:text-[#717F96] placeholder-transparent focus:outline-none ${errors.email &&   'border-[#D03816]'}`}
              placeholder=" " 
              {...register("email")}
            />
            <label
              htmlFor="floating-input"
              className="absolute left-6 text-sm font-medium text-[#B7BFDE] bg-white px-1 transition-all duration-300 transform origin-top-left
              top-0 -translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[#B7BFDE]
              peer-focus:top-0 peer-focus:text-[#717F96]"
            >
              E-mail
            </label>
          </div>

            <div className="relative w-full mt-6">
            <Input
              id="float-input"
              type={ isVisible ? "text" : "password"}
              className={`peer w-full appearance-none h-12 lg:h-14 pl-6 pt-4 pb-2 rounded border-[2px] border-[#E2E5F1] focus:border-[#E2E5F1] focus-visible:border-[#E2E5F1] focus-visible:text-[#717F96] placeholder-transparent focus:outline-none ${errors.senha &&   'border-[#D03816]'}`}
              placeholder=" "
              {...register("senha")} 
            />
            <label
              htmlFor="floating-input"
              className="absolute left-6 text-sm font-medium text-[#B7BFDE] bg-white px-1 transition-all duration-300 transform origin-top-left
              top-0 -translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[#B7BFDE]
              peer-focus:top-0 peer-focus:text-[#717F96]"
            >
              Palavra passe
            </label>

            <div className="absolute top-4 right-4" onClick={() => setIsVisible(!isVisible)}>
              <Image src={isVisible ? EyesOff : EyesOpened } alt="eys" className="w-6 h-6 cursor-pointer"/> 
            </div>
          </div>

            <div className="flex justify-between items-center w-full text-sm text-[#717F96] mt-4">
              <div className="flex items-center space-x-2">
                <div
                  className="flex relative items-center w-5 h-5 cursor-pointer"
                  onClick={toggleCheck}
                >
                  <input
                    type="checkbox"
                    id="check-box-1"
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    checked={isChecked}
                    onChange={toggleCheck}
                  />
                  <div
                    className={`w-5 h-5 border-[2px] border-[#E2E5F1] rounded flex items-center justify-center transition duration-300 ${
                      isChecked ? "bg-[#217EFD] border-[#217EFD]" : ""
                    }`}
                  >
                    {isChecked && (
                      <GrFormCheckmark className="text-[#FFFFFF] size-4 font-black transition duration-300" />
                    )}
                  </div>
                </div>
                <label htmlFor="checkbox" className="text-[#717F96]">Manter a sessão</label>
              </div>
              <Link href="/password">
                <span className="cursor-pointer hover:underline text-[#717F96]">Esqueci minha palavra-passe</span>
              </Link>
            </div>

            <div className="w-full mt-12">
              
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#FF5777] hover:bg-[#fc4667] hover:cursor-pointer hover:shadow-[0_0_12px_rgba(255,87,119,0.5)] text-white w-full h-12 lg:h-14 mb-10 rounded">
                {isLoading ? <Loader2  className="animate-spin" /> : "Entrar"}
              </Button>
            
              <Link href="/afiliate">
                <Button className="bg-[#a550f5] text-white hover:bg-[#823ef0] hover:text-white hover:cursor-pointer hover:shadow-[0_0_12px_rgba(165,80,245,0.5)] w-full h-12 lg:h-14 rounded shadow-none">
                  Entrar como Secretário/a
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}