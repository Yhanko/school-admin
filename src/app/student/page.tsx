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
    <section className="w-full space-y-4">
      <div className="px-2 sm:px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Estudantes</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Visualize e gerencie todos os estudantes matriculados na instituição</p>
      </div>
      
      <div className="w-full space-y-4">
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