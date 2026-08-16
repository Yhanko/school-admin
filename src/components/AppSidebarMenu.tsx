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

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar className="h-screen border-r border-[#414042] bg-[#131313]">
      <SidebarContent className="bg-[#131313] h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#414042] [&::-webkit-scrollbar-thumb]:rounded-full">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="py-2 space-y-1">
              {routes.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.id} className="w-full px-2">
                    <SidebarMenuButton
                      asChild
                      className={`h-11 cursor-pointer rounded transition-all duration-200 relative overflow-hidden ${
                        isActive
                          ? "bg-[#201f1f] text-[#e5e2e1] font-semibold border-l-[3px] border-[#8B5CF6] pl-4"
                          : "text-[#d5c4ac] hover:bg-[#1A1A1A] hover:text-[#e5e2e1] pl-4"
                      }`}
                    >
                      <Link
                        href={item.url}
                        onClick={handleNavClick}
                        className="flex items-center gap-3 w-full"
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div
                          className={`shrink-0 transition-all ${
                            isActive
                              ? "text-[#8B5CF6] drop-shadow-[0_0_8px_rgba(139, 92, 246,0.5)]"
                              : "text-[#d5c4ac]"
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

      <SidebarFooter className="bg-[#131313] border-t border-[#414042] pb-6 pt-3 px-2">
        <SidebarMenu>
          <SidebarMenuItem className="w-full">
            <LogOutModal>
              <button 
                onClick={handleNavClick}
                className="flex w-full items-center gap-3 rounded px-4 h-10 text-sm text-[#d5c4ac] hover:bg-[#9B2226]/20 hover:text-[#ffb4ab] hover:border hover:border-[#9B2226]/40 transition-all duration-200 cursor-pointer"
              >
                <LogOut size={20} className="text-[#9d8f78]" />
                <span>Terminar Sessão</span>
              </button>
            </LogOutModal>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
