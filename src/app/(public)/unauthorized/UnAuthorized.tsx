"use client";
import { IoIosAlert } from "@/lib/icons";
import { useSidebarStore } from "@/hooks/useSidebar";

export default function Unauthorized () {
    const { isSidebarOpen } = useSidebarStore();
    return (
      <div className={`flex flex-col justify-center items-center space-y-8 mt-16 ml-14 p-6 xl:w-[73vw] 2xl:w-[85vw] bg-card ${ isSidebarOpen ? "xl:w-[75vw] 2xl:w-[85vw]" : "2xl:w-[93vw] xl:w-[88vw]"}`}>
        <IoIosAlert className="w-64 h-64"/>
        <h1 className="text-black font-semibold">Acesso não autorizado</h1>
        <p className="text-black font-semibold">Desculpe nos pelo transtorno causado, não temos acesso para sí nessa pagina.</p>
      </div>
    );
};