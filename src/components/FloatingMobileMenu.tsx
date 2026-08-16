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
      className="lg:hidden fixed bottom-6 right-6 z-[999] w-14 h-14 bg-[#8B5CF6] hover:bg-[#A78BFA] active:scale-95 text-black rounded-full shadow-2xl shadow-[#8B5CF6]/40 border-2 border-[#131313] flex items-center justify-center transition-all duration-300 group cursor-pointer"
    >
      {openMobile ? (
        <X className="w-6 h-6 text-black transition-transform duration-200 group-hover:rotate-90" />
      ) : (
        <Menu className="w-6 h-6 text-black transition-transform duration-200 group-hover:scale-110" />
      )}
    </button>
  );
}
