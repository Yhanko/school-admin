"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function FloatingMobileMenu() {
  const { openMobile, toggleSidebar } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleSidebar}
      type="button"
      aria-label="Abrir Menu de Navegação"
      title="Abrir Menu"
      className="lg:hidden fixed bottom-6 right-6 z-[999] w-14 h-14 bg-[#4D44B5] hover:bg-[#3d3695] active:scale-95 text-white rounded-full shadow-2xl shadow-[#4D44B5]/60 border-2 border-white/20 flex items-center justify-center transition-all duration-300 group cursor-pointer"
    >
      {openMobile ? (
        <X className="w-6 h-6 text-white transition-transform duration-200 group-hover:rotate-90" />
      ) : (
        <Menu className="w-6 h-6 text-white transition-transform duration-200 group-hover:scale-110" />
      )}
    </button>
  );
}
