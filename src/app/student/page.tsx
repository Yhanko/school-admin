"use client"
import { useState } from "react";
import { StudentTable } from "./_components/studentTable";
import { SearchBar } from "./_components/searchBar";
import { NewStudentModal } from "./_components/NewStudentModal";

const Student = () => {
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const handleSearch = () => {
    setActiveSearch(searchTerm.toLowerCase());
  };

  return (
    <section className="w-full space-y-6 font-hanken text-[#0F172A] dark:text-[#e5e2e1]">
      <div className="border-b border-[#E2E8F0] dark:border-[#414042] pb-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
          <h1 className="headline-lg text-[#0F172A] dark:text-[#e5e2e1]">Estudantes</h1>
        </div>
        <p className="body-md text-[#475569] dark:text-[#d5c4ac] mt-1">
          Base de dados e gestão integral de matrículas, turmas e percurso escolar dos estudantes
        </p>
      </div>
      
      <div className="w-full space-y-5">
        <SearchBar 
          onNewStudentClick={() => setIsNewStudentModalOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
        <StudentTable refreshKey={refreshKey} activeSearch={activeSearch} />
      </div>

      <NewStudentModal 
        isOpen={isNewStudentModalOpen} 
        onClose={() => setIsNewStudentModalOpen(false)} 
        onAdded={() => {
          setIsNewStudentModalOpen(false);
          setRefreshKey(prev => prev + 1);
        }}
      />
    </section>
  );
};

export default Student;