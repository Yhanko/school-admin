import { AppSidebar } from "@/components/AppSidebarMenu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen">
        <SidebarProvider>
          <AppSidebar  />
          <main className="flex flex-col min-h-screen flex-1 w-full max-w-full overflow-x-hidden">
             <Header />
            {children}
          </main>
        </SidebarProvider>
    </div>
  );
}