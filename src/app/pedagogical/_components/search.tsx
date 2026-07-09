import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { NewTeacher } from "./new-teacher";

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

export function Search({ searchTerm, setSearchTerm, handleSearch }: SearchProps){
    return(
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 mt-6 w-full px-4">
            <div className="flex flex-col md:flex-row w-full md:w-auto relative gap-2">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                      type="text"
                      placeholder="Pesquisar professor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="bg-background border border-border rounded-lg h-10 w-full pl-10 pr-4 md:w-64 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <Button onClick={handleSearch} className="bg-primary text-white h-10 rounded-lg">Pesquisar</Button>
                <NewTeacher />
            </div>
      </div>
    )
}