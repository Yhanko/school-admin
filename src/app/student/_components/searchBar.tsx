"use client";

import React from "react";
import { Plus, Search as SearchIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onNewStudentClick?: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

export function SearchBar({
  onNewStudentClick,
  searchTerm,
  setSearchTerm,
  handleSearch,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full font-hanken">
      {/* Input de Pesquisa */}
      <div className="flex items-center gap-2.5 flex-1 max-w-full sm:max-w-md">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] dark:text-[#9d8f78]" />
          <input
            type="text"
            placeholder="Pesquisar por nome do estudante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0D0D0D] border border-[#CBD5E1] dark:border-[#414042] rounded text-sm text-[#0F172A] dark:text-[#e5e2e1] placeholder:text-[#94A3B8] dark:placeholder:text-[#9d8f78] focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] transition-all font-hanken shadow-2xs"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-white h-10 px-5 text-sm font-hanken font-bold rounded shadow-xs transition-all shrink-0 cursor-pointer"
        >
          Pesquisar
        </Button>
      </div>

      {/* Botão Novo Estudante */}
      <Button
        onClick={onNewStudentClick}
        className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-white font-bold rounded h-10 px-5 text-sm font-hanken shadow-xs cursor-pointer shrink-0 transition-all flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        <span>Novo Estudante</span>
      </Button>
    </div>
  );
}