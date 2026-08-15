"use client";
//Components
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from "next/link";
//Images and icons
import PasswordKey from "../../../assets/password.svg";
import YhankoIMG from "../../../assets/yhankoIMG.svg";

export default function PasswordChangedPage() {
  return (
    <main className="2xl:h-screen xl:h-[130vh] flex flex-col bg-[#ffffff]">

      <section className="flex flex-col justify-center items-center mt-8 px-4 space-y-8 lg:space-y-12 2xl:mt-40 xl:mt-2">
        <div className="flex flex-col w-[40rem] h-[40rem] space-y-6 2xl:space-y-8 justify-center items-center">
          <div className="flex justify-center items-center space-x-3">
            <Image src={YhankoIMG} alt="logo" className="h-12 w-12 xl:h-12 2xl:h-14"/>
            <h1 className="text-black font-bold">Yhanko</h1>
          </div>
          <div className="flex flex-col justify-center items-center space-y-8 w-[40rem] h-96">
            <Image src={PasswordKey} alt="KeyImg" className="h-24 lg:h-28 2xl:h-36 mt-8" />
            <h1 className="text-[#171718] font-semibold text-lg 2xl:text-lg lg:text-2xl text-center">
              Senha alterada com sucesso!
            </h1>
            <span className="text-[#717F96] text-center text-sm lg:text-base">
              Clique em fazer login para iniciar
              <br />
              sessão com os seus dados de acesso.
            </span>
          </div>

          <Link href="login" className="2xl:w-[28rem] lg:w-[28rem] xl:w-[28rem] md:w-[28rem] w-full">
            <Button className="bg-[#FF5777] shadow-none hover:bg-[#fc4667] hover:cursor-pointer text-white w-full h-12 lg:h-14 rounded-xl mt-4">
              Login
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}