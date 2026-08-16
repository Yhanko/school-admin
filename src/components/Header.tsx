"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NotificationsHover } from "./NotificationHover";
import { useAuth } from "@/store/useAuth";
import { useAcademicYear } from "@/store/useAcademicYear";
import axiosInstance from "@/service/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { FloatingMobileMenu } from "./FloatingMobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { user, updateUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { toggleSidebar } = useSidebar();

  const {
    academicYears,
    selectedYear,
    activeYear,
    setAcademicYears,
    setSelectedYear,
    setActiveYear,
  } = useAcademicYear();

  useEffect(() => {
    setMounted(true);

    const initHeaderData = async () => {
      try {
        const [allRes, activeRes] = await Promise.all([
          axiosInstance.get("/academic-years"),
          axiosInstance.get("/academic-years/active"),
        ]);

        setAcademicYears(allRes.data);
        setActiveYear(activeRes.data);

        if (!selectedYear) {
          setSelectedYear(activeRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch academic years", error);
      }

      // Fetch fresh profile data to get latest photoUrl if needed
      try {
        const profileRes = await axiosInstance.get("/users/me");
        if (profileRes.data) {
          updateUser(profileRes.data);
        }
      } catch {
        // Silently continue if user not logged in or endpoint unavailable
      }
    };

    initHeaderData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const photoUrl =
    user?.employeeProfile?.photoUrl ||
    user?.avatar ||
    user?.profile?.photoUrl ||
    user?.photoUrl;
  const userName = user?.name || "Carregando...";
  const initials = user?.name ? user.name.substring(0, 2) : "AD";

  return (
    <>
      <header className="flex h-[4.5rem] w-full items-center justify-between border-b border-[#414042] px-4 md:px-8 top-0 z-40 bg-[#131313] text-[#e5e2e1] font-hanken">
        <div className="flex items-center gap-3">
          {/* Botão de abrir menu no topo em mobile/tablet */}
          <button
            onClick={toggleSidebar}
            type="button"
            className="lg:hidden p-2 rounded text-[#d5c4ac] hover:bg-[#201f1f] hover:text-[#e5e2e1] transition-colors cursor-pointer border border-[#414042]"
            aria-label="Abrir Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Foto ou Monograma do Perfil / Instituição */}
          <Link
            href="/profile"
            className="flex items-center gap-3 group cursor-pointer"
            title="Ver Perfil Institucional"
          >
            <div className="w-10 h-10 rounded-full border border-[#414042] group-hover:border-[#8B5CF6] transition-colors overflow-hidden shrink-0 bg-[#1c1b1b] flex items-center justify-center shadow-xs">
              {mounted && photoUrl ? (
                <img
                  src={photoUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold font-jetbrains text-[#DDD6FE] uppercase">
                  {initials}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm md:text-base font-bold text-[#e5e2e1] group-hover:text-[#8B5CF6] transition-colors truncate max-w-[170px] sm:max-w-[240px] md:max-w-[320px]">
                {mounted ? userName : "Carregando..."}
              </span>
              <span className="label-caps text-[#9d8f78] text-[10px]">
                Painel Administrativo
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex items-center h-16">
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Academic Year Selector */}
            {mounted && academicYears.length > 0 && selectedYear && (
              <div className="flex items-center space-x-2 bg-[#201f1f] px-3 py-1.5 rounded border border-[#414042] text-xs md:text-sm">
                <CalendarDays className="h-4 w-4 text-[#8B5CF6]" />
                <span className="text-xs font-semibold text-[#d5c4ac] hidden md:inline">
                  Ano Letivo:
                </span>
                <Select
                  value={selectedYear.id}
                  onValueChange={(val) => {
                    const y = academicYears.find((ay) => ay.id === val);
                    if (y) setSelectedYear(y);
                  }}
                >
                  <SelectTrigger className="h-7 border-none bg-transparent shadow-none focus:ring-0 text-[#e5e2e1] font-semibold w-auto min-w-[90px] md:min-w-[110px] p-0 pr-2 text-xs md:text-sm">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border border-[#C0C2C5] text-[#e5e2e1]">
                    {academicYears.map((year) => (
                      <SelectItem
                        key={year.id}
                        value={year.id}
                        className="cursor-pointer hover:bg-[#201f1f] focus:bg-[#201f1f]"
                      >
                        {year.year} {year.id === activeYear?.id ? "(Ativo)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Theme Toggle Button (Dark / Light) */}
            <ThemeToggle />

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