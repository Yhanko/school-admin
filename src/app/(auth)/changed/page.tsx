"use client";

import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from "next/link";
import PasswordKey from "../../../assets/password.svg";
import YhankoIMG from "../../../assets/yhankoIMG.svg";
import { CheckCircle } from "@/lib/icons";

export default function PasswordChangedPage() {
  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center bg-background px-4 sm:px-8 md:px-12 py-10 font-hanken text-foreground antialiased overflow-x-hidden">
      <div className="w-full max-w-md mx-auto space-y-8 bg-card border border-border p-6 sm:p-10 rounded shadow-xs text-center flex flex-col items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Image src={YhankoIMG} alt="Yhanko Logo" width={40} height={40} className="w-10 h-10" priority />
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Yhanko<span className="text-primary">Educa</span></h1>
        </div>

        {/* Ilustração / Ícone */}
        <div className="flex flex-col justify-center items-center space-y-4 py-2">
          <div className="relative">
            <Image src={PasswordKey} alt="Chave de Segurança" width={96} height={96} className="h-24 w-24 object-contain" />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          
          <div className="space-y-1.5 pt-2">
            <h2 className="text-2xl font-bold text-foreground">
              Palavra-passe Alterada!
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
              A sua palavra-passe foi atualizada com sucesso. Já pode aceder ao portal com as novas credenciais.
            </p>
          </div>
        </div>

        {/* Botão para Login */}
        <div className="w-full pt-2">
          <Link href="/login" className="block w-full">
            <Button className="w-full h-11 bg-primary hover:bg-[#A78BFA] text-white font-semibold text-sm rounded transition-all shadow-xs cursor-pointer">
              Fazer Login
            </Button>
          </Link>
        </div>

      </div>
    </main>
  );
}