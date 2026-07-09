"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {StudentRow} from "./studentRow";
import { useState, useEffect } from "react";
import { Modal } from "./modal";
import { Button } from "@/components/ui/button";
import { StudentHistoryModal } from "./studentsHistoryModal";
import { mockStudentProfiles } from "@/types/academicHistoryData";
import { StudentFullProfile } from "@/types/academic-history";

import axiosInstance from "@/service/api";
import { Loader2 } from "lucide-react";

interface Student {
  id: string;
  name: string;
  date: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  city: string;
  grade: string;
  gradeColor: string;
  phone: string;
  email: string;
  studentNumber: string;
  isSelected: boolean;
}

// Remove static students mock

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
        const apiStudents = response.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          date: new Date(user.createdAt).toLocaleDateString(),
          parentName: user.parent?.name || "N/A",
          parentEmail: user.parent?.email || "N/A",
          parentPhone: user.parent?.employeeProfile?.phone || "N/A",
          studentNumber: user.code || "N/A",
          city: "Luanda", // TODO: Update based on entity
          grade: user.enrollments?.length > 0 
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

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-[1px] border-gray-200">
            <TableHead className="w-12 px-6 py-4 border-[1px] border-gray-200">
              <Checkbox />
            </TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Nº</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Nome</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Data</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Encarregado</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Cidade</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Contacto</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Classe</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-[1px] border-gray-200">
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
              </TableCell>
            </TableRow>
          ) : students.length > 0 ? (
            students.filter(student => !activeSearch || student.name.toLowerCase().includes(activeSearch)).map((student) => (
              <StudentRow key={student.id} student={student} onAction={handleAction} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                Nenhum estudante encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-between px-6 py-4 bg-transparent border-t border-border">
        <div className="text-sm text-gray-500">
          Showing {students.length > 0 ? 1 : 0}-{students.length} from {students.length} data
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md text-sm">2</button>
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md text-sm">3</button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <StudentHistoryModal
        student={selectedHistoryStudent}
        open={modalType === 'history'}
        onOpenChange={(isOpen) => setModalType(isOpen ? 'history' : null)}
      />

      {/* View Details Modal */}
      {selectedStudentForAction && (
        <Modal
          isOpen={modalType === 'view'}
          onClose={() => setModalType(null)}
          title={`Detalhes de ${selectedStudentForAction.name}`}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Dados do Aluno</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nº do Estudante</p>
                  <p className="text-base text-gray-900">{selectedStudentForAction.studentNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome</p>
                  <p className="text-base text-gray-900">{selectedStudentForAction.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Turma/Classe</p>
                  <p className="text-base text-gray-900">{selectedStudentForAction.grade}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Telemóvel</p>
                  <p className="text-base text-gray-900">{selectedStudentForAction.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">E-mail</p>
                  <p className="text-base text-gray-900">{selectedStudentForAction.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Data de Matrícula</p>
                  <p className="text-base text-gray-900">{selectedStudentForAction.date}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Dados do Encarregado</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome</p>
                  <p className="text-base text-gray-900">{selectedStudentForAction.parentName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">E-mail</p>
                  <p className="text-base text-gray-900">{selectedStudentForAction.parentEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Telemóvel</p>
                  <p className="text-base text-gray-900">{selectedStudentForAction.parentPhone}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button variant="outline" onClick={() => setModalType(null)}>Fechar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {selectedStudentForAction && (
        <Modal
          isOpen={modalType === 'edit'}
          onClose={() => setModalType(null)}
          title="Editar Aluno"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Em breve será possível editar as informações completas do estudante através deste painel.
            </p>
            <div className="space-y-2">
               <label className="text-sm font-medium text-foreground">Nome do Estudante</label>
               <input type="text" defaultValue={selectedStudentForAction.name} className="w-full border border-border rounded-lg p-2" />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium text-foreground">Telefone</label>
               <input type="text" defaultValue={selectedStudentForAction.phone} className="w-full border border-border rounded-lg p-2" />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalType(null)}>Cancelar</Button>
              <Button className="bg-[#5856eb] hover:bg-[#5856eb]/90 text-white" onClick={() => setModalType(null)}>Salvar Alterações</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {selectedStudentForAction && (
        <Modal
          isOpen={modalType === 'delete'}
          onClose={() => setModalType(null)}
          title="Confirmar Exclusão"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Tem certeza que deseja apagar o registo do aluno <strong className="text-gray-900">{selectedStudentForAction.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalType(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={() => setModalType(null)}>Sim, Deletar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};