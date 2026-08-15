"use client";

import { useEffect, useState } from "react";
import { NotificationsHover } from "./NotificationHover";
import { useAuth } from "@/store/useAuth";
import { useAcademicYear } from "@/store/useAcademicYear";
import axiosInstance from "@/service/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { FloatingMobileMenu } from "./FloatingMobileMenu";

export function Header() {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);
    const { toggleSidebar } = useSidebar();
    
    const { 
        academicYears, 
        selectedYear, 
        activeYear, 
        setAcademicYears, 
        setSelectedYear, 
        setActiveYear 
    } = useAcademicYear();

    useEffect(() => {
        setMounted(true);
        
        const fetchAcademicYears = async () => {
            try {
                const [allRes, activeRes] = await Promise.all([
                    axiosInstance.get('/academic-years'),
                    axiosInstance.get('/academic-years/active')
                ]);
                
                setAcademicYears(allRes.data);
                setActiveYear(activeRes.data);
                
                if (!selectedYear) {
                    setSelectedYear(activeRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch academic years", error);
            }
        };
        
        fetchAcademicYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <header className="flex h-[5rem] w-full items-center justify-between border-b-[1px] border-[#a39e9e] px-4 md:px-8 top-0 z-40 bg-white">    
                <div className="flex items-center gap-3">
                    {/* Botão de abrir menu no topo em mobile/tablet */}
                    <button
                        onClick={toggleSidebar}
                        type="button"
                        className="lg:hidden p-2 rounded-xl text-[#303972] hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Abrir Menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col items-start">
                        <span className="text-base md:text-xl font-bold text-[#303972]">
                            {mounted ? (user?.name || 'Carregando...') : 'Carregando...'}
                        </span>
                    </div>
                </div>
                
                <nav className="flex items-center h-16">
                    <div className="flex items-center space-x-3 md:space-x-6">
                        {/* Academic Year Selector */}
                        {mounted && academicYears.length > 0 && selectedYear && (
                            <div className="flex items-center space-x-2 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs md:text-sm">
                                <CalendarDays className="h-4 w-4 text-[#303972]" />
                                <span className="text-xs md:text-sm font-semibold text-[#303972] hidden md:inline">Ano Letivo:</span>
                                <Select 
                                    value={selectedYear.id} 
                                    onValueChange={(val) => {
                                        const y = academicYears.find(ay => ay.id === val);
                                        if(y) setSelectedYear(y);
                                    }}
                                >
                                    <SelectTrigger className="h-7 border-none bg-transparent shadow-none focus:ring-0 text-[#303972] font-semibold w-auto min-w-[90px] md:min-w-[110px] p-0 pr-2 text-xs md:text-sm">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {academicYears.map((year) => (
                                            <SelectItem key={year.id} value={year.id} className="cursor-pointer">
                                                {year.year} {year.id === activeYear?.id ? "(Ativo)" : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="static">
                            <NotificationsHover />
                        </div>
                    </div>
                </nav>
            </header>

            {/* Botão de Menu Flutuante para Telemóvel e Tablet */}
            <FloatingMobileMenu />
        </>
    );
}