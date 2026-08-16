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
    <section className="w-full space-y-6 font-hanken">
      <div className="border-b border-[#414042] pb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
          <h1 className="headline-lg text-[#e5e2e1]">Área Pedagógica</h1>
        </div>
        <p className="body-md text-[#d5c4ac] mt-1">
          Gestão e acompanhamento do corpo docente, turmas e disciplinas da instituição
        </p>
      </div>
      
      <div className="w-full space-y-5">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleSearch={handleSearch} />
        <Teachears activeSearch={activeSearch} />
      </div>
    </section>
  );
}
