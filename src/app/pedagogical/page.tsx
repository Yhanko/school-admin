"use client"
import { useState } from "react";
import {Teachears} from "./_components/teachears";
import { Search } from "./_components/search";


export default function TeachearDatails(){
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const handleSearch = () => {
    setActiveSearch(searchTerm.toLowerCase());
  };

  return (
    <section className="pt-4 w-[70rem]">
      <div className="pl-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Área pedagógica</h1>
        <p className="text-muted-foreground">Visualize e gerencie professores e outros profissionais</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
        <Teachears activeSearch={activeSearch} />
      </div>
      
    </section>
  );
}
