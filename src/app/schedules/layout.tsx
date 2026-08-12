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
    <div className="w-full min-h-screen">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex flex-col min-h-screen flex-1 w-full max-w-full overflow-x-hidden">
            <Header />
            <div className="flex-1 px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
              {children}
            </div>
          </main>
        </SidebarProvider>
    </div>
  );
}
