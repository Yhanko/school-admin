"use client"
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Search as SearchIcon } from "lucide-react";

interface SearchBarProps {
  onNewStudentClick?: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

export function SearchBar({ onNewStudentClick, searchTerm, setSearchTerm, handleSearch }: SearchBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 mt-6 w-full px-4">
      {/* Search Input */}
      <div className="flex-1 max-w-md relative flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar estudante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-background border border-border rounded-lg pl-10 pr-4 h-10 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent w-full"
          />
        </div>
        <Button onClick={handleSearch} className="bg-primary text-white hover:bg-primary/90 h-10 rounded-lg">Pesquisar</Button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        {/* New Student Button */}
        <Button onClick={onNewStudentClick} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-6 h-10 font-medium cursor-pointer w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Student
        </Button>
      </div>
    </div>
  );
}