"use client";

// Configurações
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import axiosInstance from "@/service/api";
// Componentes
import { ToastAction } from "@/components/ui/toast";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
// Ícones e imagens
import EyesOpened from "../../../assets/eye-open.svg";
import EyesOff from "../../../assets/eye-off.svg";
import { GrFormCheckmark, Loader2, AiOutlineClose } from "@/lib/icons";
import RequestError from "../../../assets/ErroDeResposta.svg";
import RoundedIcon from "../../../assets/roundedIcon.svg";
// Hook
import { useAuth } from "@/store/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

// Schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email("Formato de e-mail inválido").nonempty("E-mail é obrigatório"),
  senha: z.string({ required_error: "Senha é obrigatória" }).nonempty("Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const toggleCheck = () => {
    setIsChecked(!isChecked);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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

        const userProfile = await axiosInstance.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAuth(userProfile.data, token);

        toast({
          description: (
            <div className="flex items-center gap-3">
              <div className="rounded-full w-8 h-8 flex justify-center items-center shrink-0">
                <Image src={RoundedIcon} alt="Sucesso" width={32} height={32} />
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
      }
    } catch (error) {
      setIsLoading(false);
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message || "Erro ao realizar o login.";
      toast({
        description: (
          <div className="flex items-center gap-3">
            <div className="rounded-full w-8 h-8 flex justify-center items-center shrink-0 bg-red-100">
              <Image src={RequestError} alt="Erro" width={24} height={24} />
            </div>
            <span className="text-[#717F96] text-sm">{message}</span>
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
  };

  return (
    <main className="min-h-screen w-full flex bg-white font-sans antialiased overflow-x-hidden">

      {/* Lado Esquerdo - Banner Decorativo (Apenas visível em telas grandes lg+) */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 min-h-screen backgroundGradient relative flex-col justify-between p-12 text-white">

        <div className="space-y-6 max-w-lg">
          <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium text-white border border-white/20">
            Plataforma de Gestão Escolar
          </div>
          <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight">
            A melhor gestão para a sua instituição de ensino.
          </h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Controlo académico, financeiro, pautas e acompanhamento de alunos e turmas de forma simples, eficiente e integrada.
          </p>
        </div>

        <div className="text-xs text-white/60">
          &copy; {new Date().getFullYear()} Yhanko. Todos os direitos reservados.
        </div>
      </div>

      {/* Lado Direito - Formulário Responsivo */}
      <div className="w-full lg:w-7/12 xl:w-1/2 min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-12 lg:px-16 py-10">
        <div className="w-full max-w-md mx-auto space-y-8">

          {/* Topo / Logo para telas móveis e desktop */}
          <div className="flex flex-col items-center text-center space-y-3">

            <div className="pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#171718]">Director Geral</h2>
              <p className="text-sm text-[#717F96] mt-1 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
                Seja bem-vindo à melhor gestão escolar! Aceda ao portal da sua instituição.
              </p>
            </div>
          </div>

          {/* Formulário de Login */}
          <form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>

            {/* Input E-mail */}
            <div className="space-y-1">
              <div className="relative w-full">
                <Input
                  id="email-input"
                  type="email"
                  className={`peer w-full h-12 sm:h-14 pl-5 pr-4 pt-4 pb-1 rounded-xl border-2 border-[#E2E5F1] text-gray-800 text-sm focus:border-[#217EFD] focus-visible:ring-0 placeholder-transparent transition-all ${errors.email ? 'border-[#FB3748]' : ''
                    }`}
                  placeholder=" "
                  {...register("email")}
                />
                <label
                  htmlFor="email-input"
                  className="absolute left-4 text-xs sm:text-sm font-medium text-[#B7BFDE] bg-white px-1 transition-all duration-200 pointer-events-none
                  top-0 -translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
                  peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:text-[#217EFD]"
                >
                  E-mail
                </label>
              </div>
              {errors.email && (
                <p className="text-xs text-[#FB3748] font-medium pl-1">{errors.email.message}</p>
              )}
            </div>

            {/* Input Password */}
            <div className="space-y-1">
              <div className="relative w-full">
                <Input
                  id="password-input"
                  type={isVisible ? "text" : "password"}
                  className={`peer w-full h-12 sm:h-14 pl-5 pr-12 pt-4 pb-1 rounded-xl border-2 border-[#E2E5F1] text-gray-800 text-sm focus:border-[#217EFD] focus-visible:ring-0 placeholder-transparent transition-all ${errors.senha ? 'border-[#FB3748]' : ''
                    }`}
                  placeholder=" "
                  {...register("senha")}
                />
                <label
                  htmlFor="password-input"
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
              {errors.senha && (
                <p className="text-xs text-[#FB3748] font-medium pl-1">{errors.senha.message}</p>
              )}
            </div>

            {/* Opções: Lembrar e Esqueci palavra-passe */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#717F96] pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <div
                  className="relative w-5 h-5 flex items-center justify-center shrink-0"
                  onClick={toggleCheck}
                >
                  <input
                    type="checkbox"
                    id="keep-session"
                    className="sr-only"
                    checked={isChecked}
                    onChange={toggleCheck}
                  />
                  <div
                    className={`w-5 h-5 border-2 border-[#E2E5F1] rounded-md flex items-center justify-center transition-all ${isChecked ? "bg-[#217EFD] border-[#217EFD]" : "bg-white"
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

            {/* Botões de Ação */}
            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 sm:h-14 bg-[#FF5777] hover:bg-[#fc4667] text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-[#FF5777]/30 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" /> : "Entrar"}
              </Button>

              <Link href="/afiliate" className="block w-full">
                <Button
                  type="button"
                  className="w-full h-12 sm:h-14 bg-[#a550f5] hover:bg-[#823ef0] text-white font-semibold text-sm sm:text-base rounded-xl transition-all shadow-none hover:shadow-lg hover:shadow-[#a550f5]/30 cursor-pointer"
                >
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