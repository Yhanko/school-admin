"use client";

import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { routes } from "@/lib/routes";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { LogOutModal } from "@/components/LogOutModal";
import { LogOut } from "@/lib/icons";
import { usePermissions } from "@/hooks/usePermissions";

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const { isDirector, isSecretary, isTeacher, isPedagogicalDirector } = usePermissions();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const visibleRoutes = routes.filter((item) => {
    if (isDirector) return true;

    if (isPedagogicalDirector) {
      const allowed = ["/dashboard", "/student", "/pedagogical", "/pautas", "/radar", "/turma", "/schedules", "/events", "/disciplinar", "/profile", "/chat", "/schoolRules"];
      return allowed.includes(item.url);
    }

    if (isSecretary) {
      const allowed = ["/dashboard", "/student", "/documents", "/payments", "/sms", "/profile", "/chat", "/schoolRules"];
      return allowed.includes(item.url);
    }

    if (isTeacher) {
      const allowed = ["/dashboard", "/pautas", "/turma", "/schedules", "/profile", "/chat", "/schoolRules"];
      return allowed.includes(item.url);
    }

    if (item.directorOnly && !isDirector) {
      return false;
    }
    return true;
  });

  return (
    <Sidebar className="h-screen border-r border-[#CBD5E1] dark:border-[#414042] bg-[#FAFBFD] dark:bg-[#131313]">
      <SidebarContent className="bg-[#FAFBFD] dark:bg-[#131313] h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] dark:[&::-webkit-scrollbar-thumb]:bg-[#414042] [&::-webkit-scrollbar-thumb]:rounded-full">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="py-2 space-y-1">
              {visibleRoutes.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.id} className="w-full px-2">
                    <SidebarMenuButton
                      asChild
                      className={`h-11 cursor-pointer rounded transition-all duration-200 relative overflow-hidden ${
                        isActive
                          ? "bg-primary/10 dark:bg-[#201f1f] text-primary dark:text-[#DDD6FE] font-bold border-l-[3px] border-primary pl-4"
                          : "text-[#556575] dark:text-[#d5c4ac] hover:bg-[#E2E6EA] dark:hover:bg-[#1A1A1A] hover:text-[#090D16] dark:hover:text-[#e5e2e1] pl-4"
                      }`}
                    >
                      <Link
                        href={item.url}
                        onClick={handleNavClick}
                        className="flex items-center gap-3 w-full font-hanken"
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div
                          className={`shrink-0 transition-all ${
                            isActive
                              ? "text-primary dark:text-[#8B5CF6]"
                              : "text-[#556575] dark:text-[#d5c4ac]"
                          }`}
                        >
                          <item.icon size={20} />
                        </div>
                        <span className="text-sm tracking-tight truncate">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#FAFBFD] dark:bg-[#131313] border-t border-[#CBD5E1] dark:border-[#414042] pb-6 pt-3 px-2">
        <SidebarMenu>
          <SidebarMenuItem className="w-full">
            <LogOutModal>
              <button 
                onClick={handleNavClick}
                className="flex w-full items-center gap-3 rounded px-4 h-10 text-sm text-[#556575] dark:text-[#d5c4ac] hover:bg-red-50 dark:hover:bg-[#9B2226]/20 text-red-600 dark:text-[#ffb4ab] border border-transparent hover:border-red-200 dark:hover:border-[#9B2226]/40 transition-all duration-200 cursor-pointer font-hanken"
              >
                <LogOut size={20} className="text-red-500 dark:text-[#9d8f78]" />
                <span>Terminar Sessão</span>
              </button>
            </LogOutModal>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
