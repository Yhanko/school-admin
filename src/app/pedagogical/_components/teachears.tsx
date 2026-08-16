"use client";

import React, { useEffect, useState } from "react";
import { Phone, Mail, MoreHorizontal, Loader2, UserCheck } from "@/lib/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/app/student/_components/modal";
import axiosInstance from "@/service/api";
import { useToast } from "@/hooks/use-toast";

interface Teacher {
  id: string;
  name: string;
  role: string;
  email: string;
  profile?: {
    degree?: string;
    phone?: string;
    photoUrl?: string;
  };
  classSubjects?: {
    subject: { name: string };
    class: { 
      name: string; 
      grade: string; 
      period: string; 
      academicYear?: { year: string }; 
    };
  }[];
  classesTeaching?: {
    name: string;
    grade: string;
    period: string;
    academicYear?: { year: string };
  }[];
}

export function Teachears({ activeSearch }: { activeSearch?: string }) {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAction = (type: "view" | "edit" | "delete", teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditName(teacher.name);
    setEditEmail(teacher.email);
    setModalType(type);
  };

  const fetchTeachers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      const teacherList = response.data.filter(
        (user: { role: string }) => user.role === "TEACHER"
      );
      setTeachers(teacherList);
    } catch (error) {
      console.error("Failed to fetch teachers:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar a lista de professores.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "PR";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 w-full bg-[#121212] border border-[#414042] rounded-lg space-y-3">
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
          <div className="absolute inset-0 rounded-full blur-md bg-[#8B5CF6]/30 animate-pulse" />
        </div>
        <span className="label-caps text-[#d5c4ac]">
          Carregando corpo docente...
        </span>
      </div>
    );
  }

  const filteredTeachers = teachers.filter(
    (t) => !activeSearch || t.name.toLowerCase().includes(activeSearch)
  );

  return (
    <div className="bg-[#121212] rounded-lg border border-[#414042] p-4 sm:p-6 w-full space-y-6 font-hanken">
      {/* Header Telemetry */}
      <div className="flex items-center justify-between border-b border-[#414042] pb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#8B5CF6]" />
          <span className="label-caps text-[#d5c4ac]">
            Corpo Docente Ativo ({filteredTeachers.length})
          </span>
        </div>
        <span className="text-xs text-[#9d8f78] data-mono">
          {teachers.length} Professores Registados
        </span>
      </div>

      {/* Grid de Professores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="group bg-[#1c1b1b] hover:bg-[#201f1f] border border-[#414042] hover:border-[#C0C2C5] rounded p-5 text-center relative transition-all duration-200 shadow-sm flex flex-col justify-between"
          >
            {/* Opções Dropdown */}
            <div className="absolute top-2.5 right-2.5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-[#9d8f78] hover:text-[#8B5CF6] hover:bg-[#2a2a2a] rounded cursor-pointer transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-[#1A1A1A] border border-[#C0C2C5] text-[#e5e2e1] shadow-[0_0_20px_rgba(0,0,0,0.8)] z-50 rounded p-1"
                >
                  <DropdownMenuItem
                    className="hover:bg-[#201f1f] focus:bg-[#201f1f] cursor-pointer text-xs font-semibold text-[#e5e2e1]"
                    onClick={() => handleAction("view", teacher)}
                  >
                    Ver Detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-[#201f1f] focus:bg-[#201f1f] cursor-pointer text-xs font-semibold text-[#e5e2e1]"
                    onClick={() => handleAction("edit", teacher)}
                  >
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-[#9B2226]/20 focus:bg-[#9B2226]/20 text-[#ffb4ab] cursor-pointer text-xs font-semibold"
                    onClick={() => handleAction("delete", teacher)}
                  >
                    Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Avatar & Nome */}
            <div className="mt-1 mb-3">
              <Avatar className="h-16 w-16 mx-auto border border-[#414042] bg-[#201f1f] shadow-xs">
                {teacher.profile?.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={teacher.profile.photoUrl}
                    alt={teacher.name}
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <AvatarFallback className="bg-[#201f1f] text-[#DDD6FE] data-mono text-base font-bold">
                    {getInitials(teacher.name)}
                  </AvatarFallback>
                )}
              </Avatar>

              <h3
                className="font-bold text-[#e5e2e1] text-sm sm:text-base mt-3 truncate px-1"
                title={teacher.name}
              >
                {teacher.name}
              </h3>
              
              <span className="inline-block label-caps text-[10px] text-[#d5c4ac] px-2 py-0.5 mt-1 rounded bg-[#201f1f] border border-[#414042] truncate max-w-full">
                {teacher.profile?.degree || "Docente"}
              </span>
            </div>

            {/* Botões de Contacto */}
            <div className="flex justify-center items-center gap-2 pt-3 border-t border-[#414042]/50">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-[#201f1f] text-[#d5c4ac] hover:text-[#8B5CF6] border border-[#414042] hover:border-[#C0C2C5] rounded-full transition-all cursor-pointer"
                title={teacher.profile?.phone || "Sem telefone cadastrado"}
              >
                <Phone className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-[#201f1f] text-[#d5c4ac] hover:text-[#8B5CF6] border border-[#414042] hover:border-[#C0C2C5] rounded-full transition-all cursor-pointer"
                title={teacher.email || "Sem email"}
              >
                <Mail className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {filteredTeachers.length === 0 && (
          <div className="col-span-full text-center py-16 text-[#9d8f78] text-sm space-y-1">
            <p className="font-semibold text-[#e5e2e1]">Nenhum professor encontrado</p>
            <p className="text-xs">Tente ajustar o termo de pesquisa no topo.</p>
          </div>
        )}
      </div>

      {/* Paginação & Telemetria */}
      {filteredTeachers.length > 0 && (
        <div className="flex items-center justify-between pt-3 text-xs text-[#d5c4ac] border-t border-[#414042]">
          <span className="data-mono">
            A exibir <strong className="text-[#DDD6FE]">{filteredTeachers.length}</strong> de{" "}
            <strong className="text-[#e5e2e1]">{teachers.length}</strong> professores
          </span>
          <span className="label-caps text-[#9d8f78] hidden sm:inline">
            yhankoEduca • Pedagogical Registry
          </span>
        </div>
      )}

      {/* Modal Ver Detalhes */}
      {selectedTeacher && (
        <Modal
          isOpen={modalType === "view"}
          onClose={() => setModalType(null)}
          title="Dados do Professor"
          size="lg"
        >
          <div className="space-y-5 text-[#e5e2e1] font-hanken">
            <div className="flex items-center gap-4 border-b border-[#414042] pb-4">
              <Avatar className="h-16 w-16 border border-[#414042] bg-[#201f1f]">
                {selectedTeacher.profile?.photoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={selectedTeacher.profile.photoUrl}
                    alt={selectedTeacher.name}
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <AvatarFallback className="bg-[#201f1f] text-[#DDD6FE] text-lg font-bold">
                    {getInitials(selectedTeacher.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-lg font-bold text-[#e5e2e1]">
                  {selectedTeacher.name}
                </h3>
                <p className="label-caps text-[#d5c4ac] text-[11px] mt-0.5">
                  {selectedTeacher.profile?.degree || "Docente"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-[#414042] pb-4 text-xs sm:text-sm">
              <div className="p-3 bg-[#201f1f] border border-[#414042] rounded">
                <span className="label-caps text-[#9d8f78] block mb-1">E-mail</span>
                <p className="font-semibold text-[#e5e2e1] truncate">
                  {selectedTeacher.email || "N/A"}
                </p>
              </div>
              <div className="p-3 bg-[#201f1f] border border-[#414042] rounded">
                <span className="label-caps text-[#9d8f78] block mb-1">Telemóvel</span>
                <p className="font-semibold text-[#e5e2e1]">
                  {selectedTeacher.profile?.phone || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="label-caps text-[#DDD6FE] mb-2.5">
                Informações Pedagógicas & Turmas
              </h4>

              {selectedTeacher.classSubjects && selectedTeacher.classSubjects.length > 0 ? (
                <div className="overflow-x-auto rounded border border-[#CBD5E1] dark:border-[#414042]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#E2E6EA] dark:bg-[#1c1b1b] border-b border-[#CBD5E1] dark:border-[#414042] label-caps text-[#334155] dark:text-[#d5c4ac]">
                      <tr>
                        <th className="p-3">Disciplina</th>
                        <th className="p-3">Turma</th>
                        <th className="p-3">Ano Lectivo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#CBD5E1] dark:divide-[#414042]/50 bg-[#FAFBFD] dark:bg-[#121212]">
                      {selectedTeacher.classSubjects.map((cs, idx) => (
                        <tr key={idx} className="hover:bg-[#DDE2E7] dark:hover:bg-[#1A1A1A] transition-colors">
                          <td className="p-3 font-semibold text-[#090D16] dark:text-[#e5e2e1]">
                            {cs.subject.name}
                          </td>
                          <td className="p-3 text-[#334155] dark:text-[#d5c4ac]">
                            {cs.class.grade} - {cs.class.name} ({cs.class.period})
                          </td>
                          <td className="p-3 text-[#556575] dark:text-[#9d8f78] data-mono">
                            {cs.class.academicYear?.year || "Atual"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-[#9d8f78] italic p-3 bg-[#201f1f] rounded border border-[#414042]">
                  Nenhuma disciplina ou turma atribuída atualmente no sistema.
                </p>
              )}
            </div>

            <div className="pt-3 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModalType(null)}
                className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#201f1f] rounded text-xs font-semibold"
              >
                Fechar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Editar */}
      {selectedTeacher && (
        <Modal
          isOpen={modalType === "edit"}
          onClose={() => setModalType(null)}
          title="Editar Professor"
          size="md"
        >
          <div className="space-y-4 text-[#e5e2e1] font-hanken">
            <div className="space-y-1.5">
              <label className="label-caps text-[#d5c4ac]">Nome do Professor</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#414042] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] rounded text-sm text-[#e5e2e1] p-2.5 outline-none transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="label-caps text-[#d5c4ac]">E-mail</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-[#0D0D0D] border border-[#414042] focus:border-[#C0C2C5] focus:ring-1 focus:ring-[#C0C2C5] rounded text-sm text-[#e5e2e1] p-2.5 outline-none transition-colors"
              />
            </div>
            <div className="pt-4 flex justify-end gap-2.5 border-t border-[#414042]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModalType(null)}
                className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#201f1f] rounded text-xs font-semibold"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold rounded shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] transition-all text-xs"
                onClick={() => {
                  toast({
                    title: "Atualizado",
                    description: "Dados do professor salvos com sucesso.",
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

      {/* Modal Remover */}
      {selectedTeacher && (
        <Modal
          isOpen={modalType === "delete"}
          onClose={() => setModalType(null)}
          title="Remover Professor"
          size="sm"
        >
          <div className="space-y-4 text-[#e5e2e1] font-hanken">
            <p className="text-sm text-[#d5c4ac]">
              Tem a certeza que deseja remover o professor{" "}
              <strong className="text-[#e5e2e1] font-bold">
                {selectedTeacher.name}
              </strong>
              ? Esta ação revogará os acessos e permissões pedagógicas.
            </p>
            <div className="pt-3 flex justify-end gap-2.5 border-t border-[#414042]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModalType(null)}
                className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#201f1f] rounded text-xs font-semibold"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                className="bg-[#9B2226] hover:bg-[#b02a2f] text-[#e5e2e1] font-bold rounded text-xs transition-colors"
                onClick={() => {
                  toast({
                    title: "Removido",
                    description: `Professor ${selectedTeacher.name} removido.`,
                  });
                  setModalType(null);
                }}
              >
                Confirmar Remoção
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}