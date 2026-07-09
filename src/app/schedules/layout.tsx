import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horários - YhankoEduca",
  description: "Gestão de Horários Escolares",
};

import { AppSidebar } from "@/components/AppSidebarMenu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";

export default function SchedulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
        <SidebarProvider>
          <AppSidebar />
          <main className={`flex flex-col h-screen flex-1 sm:w-full md:w-full xl:w-[1100px] 2xl:w-[1100px] overflow-y-auto`}>
            <Header />
            <div className="flex-1 space-y-4 p-8 pt-6">
              {children}
            </div>
          </main>
        </SidebarProvider>
    </div>
  );
}
