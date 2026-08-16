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
import { CalendarDays, Menu, Search } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { FloatingMobileMenu } from "./FloatingMobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { CommandMenu } from "./CommandMenu";
import { usePermissions } from "@/hooks/usePermissions";

export function Header() {
  const { user, updateUser } = useAuth();
  const { roleLabel, isDirector } = usePermissions();
  const [mounted, setMounted] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
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

    const handleCustomOpen = () => setCommandOpen(true);
    window.addEventListener("open-command-palette", handleCustomOpen);

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
    return () => window.removeEventListener("open-command-palette", handleCustomOpen);
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
      <header className="flex h-[4.5rem] w-full items-center justify-between border-b border-[#CBD5E1] dark:border-[#414042] px-4 md:px-8 top-0 z-40 bg-[#FAFBFD] dark:bg-[#131313] text-[#090D16] dark:text-[#e5e2e1] font-hanken">
        <div className="flex items-center gap-3">
          {/* Botão de abrir menu no topo em mobile/tablet */}
          <button
            onClick={toggleSidebar}
            type="button"
            className="lg:hidden p-2 rounded text-[#556575] dark:text-[#d5c4ac] hover:bg-[#E2E6EA] dark:hover:bg-[#201f1f] hover:text-[#090D16] dark:hover:text-[#e5e2e1] transition-colors cursor-pointer border border-[#CBD5E1] dark:border-[#414042]"
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
            <div className="w-10 h-10 rounded-full border border-[#CBD5E1] dark:border-[#414042] group-hover:border-primary transition-colors overflow-hidden shrink-0 bg-[#E2E6EA] dark:bg-[#1c1b1b] flex items-center justify-center shadow-xs">
              {mounted && photoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={photoUrl}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold font-jetbrains text-primary dark:text-[#DDD6FE] uppercase">
                  {mounted ? initials : "AD"}
                </span>
              )}
            </div>

            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm md:text-base font-bold text-[#090D16] dark:text-[#e5e2e1] group-hover:text-primary transition-colors truncate max-w-[170px] sm:max-w-[240px] md:max-w-[320px]">
                {mounted ? userName : "Carregando..."}
              </span>
              <span className="label-caps text-[10px] text-primary dark:text-[#DDD6FE] font-bold">
                {mounted ? roleLabel : "Painel Administrativo"}
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex items-center h-16 gap-3">
          {/* Quick Search Button (Command Palette Ctrl+K) */}
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-[#E2E6EA] dark:bg-[#201f1f] border border-[#CBD5E1] dark:border-[#414042] hover:border-primary px-3 py-1.5 rounded text-xs text-[#556575] dark:text-[#d5c4ac] transition-all cursor-pointer shadow-2xs"
            title="Pesquisa Global (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">Pesquisar...</span>
            <kbd className="text-[10px] data-mono bg-white dark:bg-[#121212] px-1.5 py-0.5 rounded border border-[#CBD5E1] dark:border-[#414042] text-[#556575] dark:text-[#d5c4ac] font-bold">
              Ctrl+K
            </kbd>
          </button>

          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Academic Year Selector */}
            {mounted && academicYears.length > 0 && selectedYear && (
              <div className="flex items-center space-x-2 bg-[#E2E6EA] dark:bg-[#201f1f] px-3 py-1.5 rounded border border-[#CBD5E1] dark:border-[#414042] text-xs md:text-sm">
                <CalendarDays className="h-4 w-4 text-primary dark:text-[#8B5CF6]" />
                <span className="text-xs font-semibold text-[#556575] dark:text-[#d5c4ac] hidden md:inline">
                  Ano Letivo:
                </span>
                <Select
                  value={selectedYear.id}
                  onValueChange={(val) => {
                    const y = academicYears.find((ay) => ay.id === val);
                    if (y) setSelectedYear(y);
                  }}
                >
                  <SelectTrigger className="h-7 border-none bg-transparent shadow-none focus:ring-0 text-[#090D16] dark:text-[#e5e2e1] font-semibold w-auto min-w-[90px] md:min-w-[110px] p-0 pr-2 text-xs md:text-sm">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#FAFBFD] dark:bg-[#1A1A1A] border border-[#CBD5E1] dark:border-[#C0C2C5] text-[#090D16] dark:text-[#e5e2e1]">
                    {academicYears.map((year) => (
                      <SelectItem
                        key={year.id}
                        value={year.id}
                        className="cursor-pointer hover:bg-[#E2E6EA] dark:hover:bg-[#201f1f] focus:bg-[#E2E6EA] dark:focus:bg-[#201f1f]"
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

      {/* Global Command Palette */}
      <CommandMenu isOpen={commandOpen} onClose={() => setCommandOpen(false)} />

      {/* Botão de Menu Flutuante para Telemóvel e Tablet */}
      <FloatingMobileMenu />
    </>
  );
}