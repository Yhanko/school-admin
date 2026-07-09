"use client"
import { AppSidebar } from "@/components/AppSidebarMenu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/components/Header";
import { BroadcastBanner } from "@/components/BroadcastBanner";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
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
    <div>
        <SidebarProvider>
          <AppSidebar />
          <main className={`flex flex-col h-screen flex-1 sm:w-full md:w-full xl:w-[1100px] 2xl:w-[1100px]`}>
            <Header />
            <div className="flex-1 p-4 mt-10">
              <BroadcastBanner />
              {children}
            </div>
          </main>
        </SidebarProvider>
    </div>
  );
}
