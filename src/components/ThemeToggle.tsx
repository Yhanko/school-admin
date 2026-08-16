"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-md border border-[#414042] bg-[#201f1f] flex items-center justify-center opacity-50" />
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2 rounded-md border border-[#414042] bg-[#201f1f] hover:bg-[#2a2a2a] text-[#d5c4ac] hover:text-[#8B5CF6] hover:border-[#8B5CF6] transition-all duration-200 cursor-pointer flex items-center justify-center group shadow-xs"
      title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
      aria-label="Alternar Tema Claro/Escuro"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#8B5CF6] transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#DDD6FE] transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
}
