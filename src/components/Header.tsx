"use client";
//compoenetes
import { LogOutModal } from "@/components/LogOutModal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
//images e icones
import { LogOut } from "@/lib/icons";
import YhankoIMG from "../assets/yhankoIMG.svg";
//hooks
import { NotificationsHover } from "./NotificationHover";

import { useAuth } from "@/store/useAuth";

export function Header() {
    const { user } = useAuth();
    return (
        <header 
        className="flex h-[5rem] w-full items-center justify-end border-b-[1px] border-[#a39e9e] top-0 z-50">    
            <nav className="flex items-center w-[12rem] h-16">
             <Link href="profile" className="flex justify-center items-center mr-2 border-[1px] border-gray-300 rounded-full">
                <Image
                    src={YhankoIMG}
                    alt="Avatar"
                    className="w-12 h-12 md:w-12 p-2 lg:w-12 xl:w-12 2xl:w-12 md:h-12 lg:h-12 xl:h-12 2xl:h-12 rounded-3xl"
                />
            </Link>
            <div className="flex flex-col items-end mr-4">
                    <span className="text-sm font-bold text-[#303972]">{user?.name || 'Carregando...'}</span>
                    <span className="text-xs text-gray-500">{user?.role || ''}</span>
                </div>
                <div className="flex space-x-4 max-w-24">
                    <div className="static">
                        <span
                            className="absolute text-center ml-[20px] bg-[#1FC16B] text-[#ffffff] rounded-sm h-[4px] w-[4px] text-xs text-[10px] pt-[2px] mt-[12px]"
                        >
                        </span>
                        <NotificationsHover />
                    </div>

                    <LogOutModal>
                        <Button className="border-[1px] border-gray-300 hover:text-[#013479] w-12 h-12 md:size-10 lg:size-10 xl:size-10 2xl:size-10 bg-transparent hover:bg-transparent hover:cursor-pointer text-[#303972] shadow-none">
                            <LogOut />
                        </Button>
                    </LogOutModal>
                </div>
            </nav>
        </header>
    );
}