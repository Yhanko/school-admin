"use client"
import { Plus, Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onNewStudentClick?: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

export function SearchBar({ onNewStudentClick, searchTerm, setSearchTerm, handleSearch }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-4 w-full px-2 sm:px-4">
      {/* Input de Pesquisa */}
      <div className="flex items-center gap-2 flex-1 max-w-full sm:max-w-md">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Pesquisar por nome do estudante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-white border-2 border-[#E2E5F1] rounded-xl pl-9 pr-3 h-11 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:border-[#4D44B5] focus-visible:ring-0 w-full transition-all"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          className="bg-[#4D44B5] hover:bg-[#3d3695] text-white h-11 px-4 text-xs sm:text-sm font-semibold rounded-xl transition-all shrink-0 cursor-pointer"
        >
          Pesquisar
        </Button>
      </div>

      {/* Botão Novo Estudante */}
      <Button 
        onClick={onNewStudentClick} 
        className="bg-[#FF5777] hover:bg-[#fc4667] text-white rounded-xl px-5 h-11 text-xs sm:text-sm font-semibold cursor-pointer shrink-0 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        <span>Novo Estudante</span>
      </Button>
    </div>
  );
}