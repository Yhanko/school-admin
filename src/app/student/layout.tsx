import { AppSidebar } from "@/components/AppSidebarMenu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-[#F3F5F7] overflow-x-hidden">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col min-h-screen flex-1 w-full max-w-full overflow-x-hidden">
          <Header />
          <div className="flex-1 p-3 sm:p-6 md:p-8 mt-2">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}