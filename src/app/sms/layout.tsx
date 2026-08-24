"use client"
import { AppSidebar } from "@/components/AppSidebarMenu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, mounted, router]);

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="min-h-screen w-full bg-[#ECEEF1] dark:bg-[#131313] text-[#090D16] dark:text-[#e5e2e1] overflow-x-hidden">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col min-h-screen flex-1 w-full max-w-full overflow-x-hidden bg-[#ECEEF1] dark:bg-[#131313]">
          <Header />
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
