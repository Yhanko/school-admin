"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { StudentRow, Student } from "./studentRow";
import { useState, useEffect } from "react";
import { Modal } from "./modal";
import { Button } from "@/components/ui/button";
import { StudentHistoryModal } from "./studentsHistoryModal";
import { mockStudentProfiles } from "@/types/academicHistoryData";
import { StudentFullProfile } from "@/types/academic-history";
import axiosInstance from "@/service/api";
import { Loader2, ChevronLeft, ChevronRight, UserCheck } from "@/lib/icons";
import { useToast } from "@/hooks/use-toast";

interface ApiStudentUser {
  id: string;
  name: string;
  createdAt: string;
  phone?: string;
  email?: string;
  code?: string;
  studentNumber?: string;
  city?: string;
  profile?: {
    phone?: string;
    email?: string;
    studentNumber?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
    city?: string;
    class?: string;
  };
  studentProfile?: {
    phone?: string;
    email?: string;
    studentNumber?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianEmail?: string;
    city?: string;
  };
  parent?: {
    name?: string;
    email?: string;
    phone?: string;
    employeeProfile?: {
      phone?: string;
    };
  };
  enrollments?: Array<{
    class: {
      grade: string;
      name: string;
    };
  }>;
}

export function StudentTable({
  refreshKey,
  activeSearch,
}: {
  refreshKey?: number;
  activeSearch?: string;
}) {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedStudentForAction, setSelectedStudentForAction] =
    useState<Student | null>(null);
  const [selectedHistoryStudent, setSelectedHistoryStudent] =
    useState<StudentFullProfile | null>(null);
  const [modalType, setModalType] = useState<
    "view" | "edit" | "delete" | "history" | null
  >(null);

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const handleAction = (
    action: "view" | "edit" | "delete" | "history",
    student: Student
  ) => {
    setSelectedStudentForAction(student);
    setEditName(student.name);
    setEditPhone(student.phone);

    if (action === "history") {
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
        const response = await axiosInstance.get("/users?role=STUDENT");
        const apiStudents = response.data.map((user: ApiStudentUser) => {
          const resolvedPhone =
            user.phone ||
            user.profile?.phone ||
            user.studentProfile?.phone ||
            user.profile?.guardianPhone ||
            user.studentProfile?.guardianPhone ||
            user.parent?.phone ||
            user.parent?.employeeProfile?.phone ||
            "";

          const resolvedEmail =
            user.email ||
            user.profile?.email ||
            user.studentProfile?.email ||
            user.parent?.email ||
            user.profile?.guardianEmail ||
            "";

          const resolvedParentName =
            user.parent?.name ||
            user.profile?.guardianName ||
            user.studentProfile?.guardianName ||
            "";

          const resolvedStudentNumber =
            user.code ||
            user.studentNumber ||
            user.profile?.studentNumber ||
            user.studentProfile?.studentNumber ||
            "";

          const resolvedGrade =
            user.enrollments &&
            user.enrollments.length > 0 &&
            user.enrollments[0].class
              ? `${user.enrollments[0].class.grade} - ${user.enrollments[0].class.name}`
              : user.profile?.class || "";

          return {
            id: user.id,
            name: user.name,
            date: new Date(user.createdAt).toLocaleDateString("pt-PT"),
            parentName: resolvedParentName || "Não atribuído",
            parentEmail: user.parent?.email || user.profile?.guardianEmail || "",
            parentPhone: user.parent?.employeeProfile?.phone || user.parent?.phone || user.profile?.guardianPhone || "",
            studentNumber: resolvedStudentNumber,
            city: user.city || user.profile?.city || "Luanda",
            grade: resolvedGrade || "Sem Turma",
            gradeColor: "bg-secondary",
            phone: resolvedPhone,
            email: resolvedEmail,
            isSelected: false,
          };
        });
        setStudents(apiStudents);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudents();
  }, [refreshKey]);

  const filteredStudents = students.filter(
    (student) =>
      !activeSearch || student.name.toLowerCase().includes(activeSearch)
  );

  return (
    <div className="w-full space-y-4 font-hanken text-[#090D16] dark:text-[#e5e2e1]">
      {/* Vista de Tabela para Computadores e Tablets */}
      <div className="bg-[#F4F6F8] dark:bg-[#121212] rounded-lg border border-[#CBD5E1] dark:border-[#414042] overflow-hidden w-full shadow-xs">
        <div className="overflow-x-auto w-full">
          <Table className="w-full border-0">
            <TableHeader>
              <TableRow className="bg-[#E2E6EA] dark:bg-[#1c1b1b] border-b border-[#CBD5E1] dark:border-[#414042] hover:bg-[#E2E6EA] dark:hover:bg-[#1c1b1b]">
                <TableHead className="w-10 px-3 sm:px-4 py-3">
                  <Checkbox className="border-[#CBD5E1] dark:border-[#414042] data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:text-white" />
                </TableHead>
                <TableHead className="px-3 sm:px-4 py-3 label-caps text-[#334155] dark:text-[#d5c4ac]">
                  Nº Registo
                </TableHead>
                <TableHead className="px-3 sm:px-4 py-3 label-caps text-[#334155] dark:text-[#d5c4ac]">
                  Nome Estudante
                </TableHead>
                <TableHead className="px-3 sm:px-4 py-3 label-caps text-[#334155] dark:text-[#d5c4ac]">
                  Data Matrícula
                </TableHead>
                <TableHead className="px-3 sm:px-4 py-3 label-caps text-[#334155] dark:text-[#d5c4ac]">
                  Encarregado
                </TableHead>
                <TableHead className="px-3 sm:px-4 py-3 label-caps text-[#334155] dark:text-[#d5c4ac]">
                  Cidade
                </TableHead>
                <TableHead className="px-3 sm:px-4 py-3 label-caps text-[#334155] dark:text-[#d5c4ac]">
                  Contactos
                </TableHead>
                <TableHead className="px-3 sm:px-4 py-3 label-caps text-[#334155] dark:text-[#d5c4ac]">
                  Turma / Classe
                </TableHead>
                <TableHead className="px-3 sm:px-4 py-3 label-caps text-[#334155] dark:text-[#d5c4ac] text-right">
                  Ação
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-[#CBD5E1] dark:divide-[#414042]/50 bg-[#F4F6F8] dark:bg-[#121212]">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Loader2 className="h-8 w-8 animate-spin text-[#8B5CF6]" />
                      <span className="label-caps text-[#556575] dark:text-[#d5c4ac]">
                        Carregando base de estudantes...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onAction={handleAction}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-32 text-center text-[#718096] dark:text-[#9d8f78] text-sm"
                  >
                    Nenhum estudante encontrado na base de dados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Rodapé da Tabela com Paginação */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#E2E6EA] dark:bg-[#121212] border-t border-[#CBD5E1] dark:border-[#414042]">
          <div className="text-xs text-[#556575] dark:text-[#d5c4ac] font-medium data-mono">
            A exibir{" "}
            <span className="font-semibold text-[#6D28D9] dark:text-[#DDD6FE]">
              {filteredStudents.length > 0 ? 1 : 0}-{filteredStudents.length}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-[#090D16] dark:text-[#e5e2e1]">
              {filteredStudents.length}
            </span>{" "}
            estudantes
          </div>
          <div className="flex items-center space-x-1.5">
            <Button
              variant="secondary"
              size="sm"
              className="h-7 w-7 p-0 border border-[#CBD5E1] dark:border-[#414042] bg-[#FAFBFD] dark:bg-[#1A1A1A] text-[#334155] dark:text-[#d5c4ac] hover:text-[#8B5CF6] hover:border-[#8B5CF6] rounded cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <button className="px-2.5 py-1 bg-[#8B5CF6] text-white rounded text-xs font-bold font-jetbrains shadow-xs">
              1
            </button>
            <Button
              variant="secondary"
              size="sm"
              className="h-7 w-7 p-0 border border-[#CBD5E1] dark:border-[#414042] bg-white dark:bg-[#1A1A1A] text-[#64748B] dark:text-[#d5c4ac] hover:text-[#8B5CF6] hover:border-[#8B5CF6] rounded cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <StudentHistoryModal
        student={selectedHistoryStudent}
        open={modalType === "history"}
        onOpenChange={(isOpen) => setModalType(isOpen ? "history" : null)}
      />

      {/* Modal Visualizar Detalhes */}
      {selectedStudentForAction && (
        <Modal
          isOpen={modalType === "view"}
          onClose={() => setModalType(null)}
          title={`Ficha de Matrícula: ${selectedStudentForAction.name}`}
          size="lg"
        >
          <div className="space-y-5 font-hanken text-[#0F172A] dark:text-[#e5e2e1]">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#414042] pb-2">
                <h3 className="label-caps text-[#7C3AED] dark:text-[#DDD6FE]">Dados do Estudante</h3>
                <span className="data-mono text-xs text-[#64748B] dark:text-[#9d8f78]">
                  ID: #{selectedStudentForAction.studentNumber}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#201f1f] border border-[#E2E8F0] dark:border-[#414042] rounded">
                  <span className="label-caps text-[#64748B] dark:text-[#9d8f78] block mb-1">
                    Nome Completo
                  </span>
                  <p className="font-semibold text-sm text-[#0F172A] dark:text-[#e5e2e1]">
                    {selectedStudentForAction.name}
                  </p>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#201f1f] border border-[#E2E8F0] dark:border-[#414042] rounded">
                  <span className="label-caps text-[#64748B] dark:text-[#9d8f78] block mb-1">
                    Turma / Classe
                  </span>
                  <p className="font-semibold text-sm text-[#7C3AED] dark:text-[#DDD6FE] data-mono">
                    {selectedStudentForAction.grade}
                  </p>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#201f1f] border border-[#E2E8F0] dark:border-[#414042] rounded">
                  <span className="label-caps text-[#64748B] dark:text-[#9d8f78] block mb-1">
                    Telemóvel
                  </span>
                  <p className="font-semibold text-sm text-[#0F172A] dark:text-[#e5e2e1] data-mono">
                    {selectedStudentForAction.phone}
                  </p>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#201f1f] border border-[#E2E8F0] dark:border-[#414042] rounded">
                  <span className="label-caps text-[#64748B] dark:text-[#9d8f78] block mb-1">
                    E-mail Institucional
                  </span>
                  <p className="font-semibold text-sm text-[#0F172A] dark:text-[#e5e2e1] truncate">
                    {selectedStudentForAction.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#414042] pb-2">
                <h3 className="label-caps text-[#7C3AED] dark:text-[#DDD6FE]">
                  Filiação & Encarregado
                </h3>
                <span className="data-mono text-xs text-[#64748B] dark:text-[#9d8f78]">
                  Matrícula: {selectedStudentForAction.date}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#201f1f] border border-[#E2E8F0] dark:border-[#414042] rounded">
                  <span className="label-caps text-[#64748B] dark:text-[#9d8f78] block mb-1">
                    Encarregado de Educação
                  </span>
                  <p className="font-semibold text-sm text-[#0F172A] dark:text-[#e5e2e1]">
                    {selectedStudentForAction.parentName}
                  </p>
                </div>
                <div className="p-3 bg-[#F8FAFC] dark:bg-[#201f1f] border border-[#E2E8F0] dark:border-[#414042] rounded">
                  <span className="label-caps text-[#64748B] dark:text-[#9d8f78] block mb-1">
                    Telemóvel do Encarregado
                  </span>
                  <p className="font-semibold text-sm text-[#0F172A] dark:text-[#e5e2e1] data-mono">
                    {selectedStudentForAction.parentPhone}
                  </p>
                </div>
                <div className="sm:col-span-2 p-3 bg-[#F8FAFC] dark:bg-[#201f1f] border border-[#E2E8F0] dark:border-[#414042] rounded">
                  <span className="label-caps text-[#64748B] dark:text-[#9d8f78] block mb-1">
                    E-mail do Encarregado
                  </span>
                  <p className="font-semibold text-sm text-[#0F172A] dark:text-[#e5e2e1]">
                    {selectedStudentForAction.parentEmail}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-[#E2E8F0] dark:border-[#414042]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModalType(null)}
                className="border border-[#CBD5E1] dark:border-[#414042] bg-white dark:bg-[#1A1A1A] text-[#0F172A] dark:text-[#e5e2e1] hover:border-[#8B5CF6] hover:bg-[#F1F5F9] dark:hover:bg-[#201f1f] rounded text-xs font-semibold"
              >
                Fechar Ficha
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Editar Aluno */}
      {selectedStudentForAction && (
        <Modal
          isOpen={modalType === "edit"}
          onClose={() => setModalType(null)}
          title="Editar Estudante"
          size="md"
        >
          <div className="space-y-4 font-hanken text-[#0F172A] dark:text-[#e5e2e1]">
            <div className="space-y-1.5">
              <label className="label-caps text-[#64748B] dark:text-[#d5c4ac]">
                Nome do Estudante
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-white dark:bg-[#0D0D0D] border border-[#CBD5E1] dark:border-[#414042] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] rounded text-sm text-[#0F172A] dark:text-[#e5e2e1] p-2.5 outline-none transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="label-caps text-[#64748B] dark:text-[#d5c4ac]">Telefone</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full bg-white dark:bg-[#0D0D0D] border border-[#CBD5E1] dark:border-[#414042] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] rounded text-sm text-[#0F172A] dark:text-[#e5e2e1] p-2.5 outline-none transition-colors"
              />
            </div>
            <div className="pt-3 flex justify-end gap-2.5 border-t border-[#E2E8F0] dark:border-[#414042]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModalType(null)}
                className="border border-[#CBD5E1] dark:border-[#414042] bg-white dark:bg-[#1A1A1A] text-[#0F172A] dark:text-[#e5e2e1] hover:border-[#8B5CF6] hover:bg-[#F1F5F9] dark:hover:bg-[#201f1f] rounded text-xs font-semibold"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-white font-bold rounded shadow-xs transition-all text-xs"
                onClick={() => {
                  toast({
                    title: "Atualizado",
                    description: "Dados do estudante guardados com sucesso.",
                  });
                  setModalType(null);
                }}
              >
                Guardar Alterações
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Excluir Aluno */}
      {selectedStudentForAction && (
        <Modal
          isOpen={modalType === "delete"}
          onClose={() => setModalType(null)}
          title="Excluir Estudante"
          size="sm"
        >
          <div className="space-y-4 font-hanken text-[#0F172A] dark:text-[#e5e2e1]">
            <p className="text-sm text-[#64748B] dark:text-[#d5c4ac]">
              Tem a certeza de que deseja excluir o estudante{" "}
              <strong className="text-[#0F172A] dark:text-[#e5e2e1]">
                {selectedStudentForAction.name}
              </strong>
              ? Esta ação revogará a matrícula e o histórico associado.
            </p>
            <div className="pt-3 flex justify-end gap-2.5 border-t border-[#E2E8F0] dark:border-[#414042]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModalType(null)}
                className="border border-[#CBD5E1] dark:border-[#414042] bg-white dark:bg-[#1A1A1A] text-[#0F172A] dark:text-[#e5e2e1] hover:border-[#8B5CF6] hover:bg-[#F1F5F9] dark:hover:bg-[#201f1f] rounded text-xs font-semibold"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                className="bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold rounded text-xs transition-colors"
                onClick={() => {
                  toast({
                    title: "Excluído",
                    description: `Estudante ${selectedStudentForAction.name} foi removido.`,
                  });
                  setModalType(null);
                }}
              >
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}