"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { NewTeacher } from "./new-teacher";

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

export function Search({ searchTerm, setSearchTerm, handleSearch }: SearchProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 w-full">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9d8f78]" />
          <input
            type="text"
            placeholder="Pesquisar professor por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D0D0D] border border-[#414042] rounded text-sm text-[#e5e2e1] placeholder:text-[#9d8f78] focus:outline-none focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] transition-all font-hanken"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-black h-10 px-5 text-sm font-hanken font-bold rounded shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] transition-all shrink-0 cursor-pointer"
        >
          Pesquisar
        </Button>
        <div className="shrink-0">
          <NewTeacher />
        </div>
      </div>
    </div>
  );
}