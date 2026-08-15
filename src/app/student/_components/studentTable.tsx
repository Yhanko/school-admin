"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentRow, Student } from "./studentRow";
import { useState, useEffect } from "react";
import { Modal } from "./modal";
import { Button } from "@/components/ui/button";
import { StudentHistoryModal } from "./studentsHistoryModal";
import { mockStudentProfiles } from "@/types/academicHistoryData";
import { StudentFullProfile } from "@/types/academic-history";

import axiosInstance from "@/service/api";
import { Loader2 } from "lucide-react";

interface ApiStudentUser {
  id: string;
  name: string;
  createdAt: string;
  phone?: string;
  email?: string;
  parent?: {
    name?: string;
    email?: string;
    employeeProfile?: {
      phone?: string;
    };
  };
  code?: string;
  enrollments?: Array<{
    class: {
      grade: string;
      name: string;
    };
  }>;
}

export function StudentTable ({ refreshKey, activeSearch }: { refreshKey?: number, activeSearch?: string }){
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedStudentForAction, setSelectedStudentForAction] = useState<Student | null>(null);
  const [selectedHistoryStudent, setSelectedHistoryStudent] = useState<StudentFullProfile | null>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | 'history' | null>(null);

  const handleAction = (action: 'view' | 'edit' | 'delete' | 'history', student: Student) => {
    setSelectedStudentForAction(student);
    if (action === 'history') {
      const studentProfile = mockStudentProfiles.find((s) => s.id === student.id);
      if (studentProfile) {
        setSelectedHistoryStudent(studentProfile);
      } else {
        setSelectedHistoryStudent(null);
      }
    }
    setModalType(action);
  };

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await axiosInstance.get('/users?role=STUDENT');
        const apiStudents = response.data.map((user: ApiStudentUser) => ({
          id: user.id,
          name: user.name,
          date: new Date(user.createdAt).toLocaleDateString('pt-PT'),
          parentName: user.parent?.name || "N/A",
          parentEmail: user.parent?.email || "N/A",
          parentPhone: user.parent?.employeeProfile?.phone || "N/A",
          studentNumber: user.code || "N/A",
          city: "Luanda",
          grade: (user.enrollments && user.enrollments.length > 0 && user.enrollments[0].class)
            ? `${user.enrollments[0].class.grade} - ${user.enrollments[0].class.name}` 
            : "N/A",
          gradeColor: "bg-[#FF5777]",
          phone: user.phone || "N/A",
          email: user.email || "N/A",
          isSelected: false,
        }));
        setStudents(apiStudents);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudents();
  }, [refreshKey]);

  const filteredStudents = students.filter(student => 
    !activeSearch || student.name.toLowerCase().includes(activeSearch)
  );

  return (
    <div className="w-full space-y-4 px-2 sm:px-4">
      {/* Vista de Tabela para Computadores e Tablets */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="w-10 px-3 sm:px-4 py-3">
                  <Checkbox />
                </TableHead>
                <TableHead className="px-3 sm:px-4 py-3 text-xs font-bold text-gray-700 uppercase">Nº Registo</TableHead>
                <TableHead className="px-3 sm:px-4 py-3 text-xs font-bold text-gray-700 uppercase">Nome Estudante</TableHead>
                <TableHead className="px-3 sm:px-4 py-3 text-xs font-bold text-gray-700 uppercase">Data Matrícula</TableHead>
                <TableHead className="px-3 sm:px-4 py-3 text-xs font-bold text-gray-700 uppercase">Encarregado</TableHead>
                <TableHead className="px-3 sm:px-4 py-3 text-xs font-bold text-gray-700 uppercase">Cidade</TableHead>
                <TableHead className="px-3 sm:px-4 py-3 text-xs font-bold text-gray-700 uppercase">Contactos</TableHead>
                <TableHead className="px-3 sm:px-4 py-3 text-xs font-bold text-gray-700 uppercase">Turma / Classe</TableHead>
                <TableHead className="px-3 sm:px-4 py-3 text-xs font-bold text-gray-700 uppercase text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#4D44B5]" />
                    <span className="text-xs text-gray-500 mt-2 block">Carregando estudantes...</span>
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <StudentRow key={student.id} student={student} onAction={handleAction} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-gray-500 text-sm">
                    Nenhum estudante encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Rodapé da Tabela com Paginação Traduzida */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-gray-50/80 border-t border-gray-200">
          <div className="text-xs sm:text-sm text-gray-600 font-medium">
            Exibindo <span className="font-semibold text-gray-900">{filteredStudents.length > 0 ? 1 : 0}-{filteredStudents.length}</span> de <span className="font-semibold text-gray-900">{filteredStudents.length}</span> estudantes
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="px-3 py-1 bg-[#4D44B5] text-white rounded-xl text-xs font-semibold shadow-sm">1</button>
            <button className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <StudentHistoryModal
        student={selectedHistoryStudent}
        open={modalType === 'history'}
        onOpenChange={(isOpen) => setModalType(isOpen ? 'history' : null)}
      />

      {/* Modal Visualizar Detalhes */}
      {selectedStudentForAction && (
        <Modal
          isOpen={modalType === 'view'}
          onClose={() => setModalType(null)}
          title={`Detalhes de ${selectedStudentForAction.name}`}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#4D44B5] uppercase tracking-wider border-b pb-2 mb-3">Dados do Aluno</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Nº do Estudante</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedStudentForAction.studentNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Nome Completo</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedStudentForAction.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Turma / Classe</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedStudentForAction.grade}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Telemóvel</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedStudentForAction.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">E-mail</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedStudentForAction.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Data de Matrícula</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedStudentForAction.date}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#4D44B5] uppercase tracking-wider border-b pb-2 mb-3">Dados do Encarregado</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500">Nome do Encarregado</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedStudentForAction.parentName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">E-mail do Encarregado</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedStudentForAction.parentEmail}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Telemóvel do Encarregado</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedStudentForAction.parentPhone}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button variant="outline" onClick={() => setModalType(null)} className="rounded-xl">Fechar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Editar Aluno */}
      {selectedStudentForAction && (
        <Modal
          isOpen={modalType === 'edit'}
          onClose={() => setModalType(null)}
          title="Editar Estudante"
          size="md"
        >
          <div className="space-y-4">
            <div className="space-y-2">
               <label className="text-xs font-semibold text-gray-700">Nome do Estudante</label>
               <input type="text" defaultValue={selectedStudentForAction.name} className="w-full border border-gray-300 rounded-xl p-2.5 text-sm" />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-semibold text-gray-700">Telefone</label>
               <input type="text" defaultValue={selectedStudentForAction.phone} className="w-full border border-gray-300 rounded-xl p-2.5 text-sm" />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalType(null)} className="rounded-xl">Cancelar</Button>
              <Button className="bg-[#4D44B5] hover:bg-[#3d3695] text-white rounded-xl" onClick={() => setModalType(null)}>Guardar Alterações</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Excluir Aluno */}
      {selectedStudentForAction && (
        <Modal
          isOpen={modalType === 'delete'}
          onClose={() => setModalType(null)}
          title="Excluir Estudante"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Tem a certeza de que deseja excluir o estudante <strong className="text-gray-900">{selectedStudentForAction.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalType(null)} className="rounded-xl">Cancelar</Button>
              <Button className="bg-[#FF5777] hover:bg-[#fc4667] text-white rounded-xl" onClick={() => setModalType(null)}>Confirmar Exclusão</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}