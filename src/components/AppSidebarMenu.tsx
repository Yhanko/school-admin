"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  //SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
//import Image from 'next/image';
import { routes } from "@/lib/routes"
//import LogoTipo from "../assets/yhankoIMG.png";
import { usePathname } from 'next/navigation';
import Link from "next/link";

export function AppSidebar() {
   const pathname = usePathname();
  return(
    <Sidebar
    className={`h-screen border-none`}>
      <SidebarContent className="bg-[#4D44B5] h-full overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/20 [&::-webkit-scrollbar-thumb]:rounded-full">
        <SidebarGroup>
          {/* Dynamic Menu Sections */}
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((item) => {
                 const isActive = pathname === item.url

                return (
                  <SidebarMenuItem key={item.id} className="w-[14rem]">
                    <SidebarMenuButton asChild className="h-10 hover:text-[#4D44B5] cursor-pointer space-x-3 rounded-l-4xl overflow-hidden text-ellipsis whitespace-nowrap">
                      <Link
                        href={item.url}
                        className={`flex hover:bg-[#F1F5F7] cursor-pointer h-10 hover:text-[#4D44B5] hover:font-semibold pl-5 transition-colors ${
                          isActive 
                            ? "bg-white text-[#4D44B5] border-white" 
                            : "text-white"
                          }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <item.icon size={24} />
                        <span className="text-[0.9rem]">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
         </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>        
    </Sidebar>
  )}