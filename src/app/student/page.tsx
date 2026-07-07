"use client"
import { useState } from "react";
import { StudentTable } from "./_components/studentTable";
import { SearchBar } from "./_components/searchBar";
import { NewStudentModal } from "./_components/NewStudentModal";

const Student = () => {
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);

  return (
    <section className="pt-4">
      <div className="pl-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Estudantes</h1>
        <p className="text-muted-foreground">Visualize e gerencie estudantes da instituição</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <SearchBar onNewStudentClick={() => setIsNewStudentModalOpen(true)} />
        <StudentTable />
      </div>

      <NewStudentModal 
        isOpen={isNewStudentModalOpen} 
        onClose={() => setIsNewStudentModalOpen(false)} 
        onAdded={() => {
          setIsNewStudentModalOpen(false);
          // In the future we can pass a refresh trigger to StudentTable
        }}
      />
    </section>
  );
};

export default Student