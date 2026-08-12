"use client"
import { useState } from "react";
import { Teachears } from "./_components/teachears";
import { Search } from "./_components/search";

export default function TeachearDatails() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const handleSearch = () => {
    setActiveSearch(searchTerm.toLowerCase());
  };

  return (
    <section className="w-full max-w-full space-y-4">
      <div className="px-2 sm:px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Área Pedagógica</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Visualize e gerencie os professores e o corpo docente da instituição</p>
      </div>
      <div className="w-full space-y-4">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
        <Teachears activeSearch={activeSearch} />
      </div>
    </section>
  );
}
