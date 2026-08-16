import { AppSidebar } from "@/components/AppSidebarMenu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen bg-[#ECEEF1] dark:bg-[#ECEEF1] dark:bg-[#131313] text-[#090D16] dark:text-[#e5e2e1]">
        <SidebarProvider>
          <AppSidebar  />
          <main className="flex flex-col min-h-screen flex-1 w-full max-w-full overflow-x-hidden bg-[#ECEEF1] dark:bg-[#131313]">
            <Header />
            {children}
          </main>
        </SidebarProvider>
    </div>
  );
}