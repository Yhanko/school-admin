"use client";
import { useEffect, useState } from "react";
import { NotificationsHover } from "./NotificationHover";
import { useAuth } from "@/store/useAuth";
import { useAcademicYear } from "@/store/useAcademicYear";
import axiosInstance from "@/service/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays } from "lucide-react";

export function Header() {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);
    
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
        
        // Fetch academic years
        const fetchAcademicYears = async () => {
            try {
                const [allRes, activeRes] = await Promise.all([
                    axiosInstance.get('/academic-years'),
                    axiosInstance.get('/academic-years/active')
                ]);
                
                setAcademicYears(allRes.data);
                setActiveYear(activeRes.data);
                
                // Set selected year to active year initially if not already set
                if (!selectedYear) {
                    setSelectedYear(activeRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch academic years", error);
            }
        };
        
        fetchAcademicYears();
    }, []);

    return (
        <header 
        className="flex h-[5rem] w-full items-center justify-between border-b-[1px] border-[#a39e9e] px-8 top-0 z-50">    
            <div className="flex flex-col items-start">
                <span className="text-lg md:text-xl font-bold text-[#303972]">
                    {mounted ? (user?.name || 'Carregando...') : 'Carregando...'}
                </span>
            </div>
            
            <nav className="flex items-center h-16">
                <div className="flex items-center space-x-6">
                    {/* Academic Year Selector */}
                    {mounted && academicYears.length > 0 && selectedYear && (
                        <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
                            <CalendarDays className="h-4 w-4 text-[#303972]" />
                            <span className="text-sm font-semibold text-[#303972] hidden md:inline">Ano Letivo:</span>
                            <Select 
                                value={selectedYear.id} 
                                onValueChange={(val) => {
                                    const y = academicYears.find(ay => ay.id === val);
                                    if(y) setSelectedYear(y);
                                }}
                            >
                                <SelectTrigger className="h-7 border-none bg-transparent shadow-none focus:ring-0 text-[#303972] font-semibold w-auto min-w-[110px] p-0 pr-2">
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
    );
}