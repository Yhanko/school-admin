"use client"
import { AppSidebar } from "@/components/AppSidebarMenu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div
      >
        <SidebarProvider>
          <AppSidebar />
          <main className={`flex flex-col h-screen flex-1 sm:w-full md:w-full xl:w-[1100px] 2xl:w-[1100px]`}>
            <Header />
            <div className="flex-1 p-4 mt-10">
              {children}
            </div>
          </main>
        </SidebarProvider>
    </div>
  );
}