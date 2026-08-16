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
  phone?: string;
  avatar?: string;
  photoUrl?: string;
  employeeProfile?: {
    degree?: string;
    phone?: string;
    photoUrl?: string;
    department?: string;
  };
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
  const [editPhone, setEditPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const getTeacherPhone = (t?: Teacher | null) => {
    if (!t) return "";
    return (
      t.employeeProfile?.phone ||
      t.phone ||
      t.profile?.phone ||
      ""
    );
  };

  const getTeacherDegree = (t?: Teacher | null) => {
    if (!t) return "Docente";
    return (
      t.employeeProfile?.degree ||
      t.profile?.degree ||
      "Docente"
    );
  };

  const getTeacherPhoto = (t?: Teacher | null) => {
    if (!t) return null;
    return (
      t.employeeProfile?.photoUrl ||
      t.profile?.photoUrl ||
      t.avatar ||
      t.photoUrl ||
      null
    );
  };

  const handleAction = (type: "view" | "edit" | "delete", teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setEditName(teacher.name);
    setEditEmail(teacher.email);
    setEditPhone(getTeacherPhone(teacher));
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
      <div className="flex flex-col justify-center items-center h-64 w-full bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg space-y-3">
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin text-[#7C3AED] dark:text-[#8B5CF6]" />
          <div className="absolute inset-0 rounded-full blur-md bg-[#7C3AED]/20 dark:bg-[#8B5CF6]/30 animate-pulse" />
        </div>
        <span className="label-caps text-[#556575] dark:text-[#d5c4ac]">
          Carregando corpo docente...
        </span>
      </div>
    );
  }

  const filteredTeachers = teachers.filter(
    (t) => !activeSearch || t.name.toLowerCase().includes(activeSearch.toLowerCase())
  );

  return (
    <div className="bg-[#FAFBFD] dark:bg-[#121212] rounded-lg border border-[#CBD5E1] dark:border-[#414042] p-4 sm:p-6 w-full space-y-6 font-hanken">
      {/* Header Telemetry */}
      <div className="flex items-center justify-between border-b border-[#CBD5E1] dark:border-[#414042] pb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#7C3AED] dark:text-[#8B5CF6]" />
          <span className="label-caps text-[#090D16] dark:text-[#d5c4ac] font-bold">
            Corpo Docente Ativo ({filteredTeachers.length})
          </span>
        </div>
        <span className="text-xs text-[#556575] dark:text-[#9d8f78] data-mono font-medium">
          {teachers.length} Professores Registados
        </span>
      </div>

      {/* Grid de Professores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredTeachers.map((teacher) => {
          const photo = getTeacherPhoto(teacher);
          const phone = getTeacherPhone(teacher);
          const degree = getTeacherDegree(teacher);

          return (
            <div
              key={teacher.id}
              className="group bg-[#EDF0F3] dark:bg-[#1c1b1b] hover:bg-[#E2E6EA] dark:hover:bg-[#201f1f] border border-[#CBD5E1] dark:border-[#414042] hover:border-primary/50 rounded p-5 text-center relative transition-all duration-200 shadow-2xs flex flex-col justify-between"
            >
              {/* Opções Dropdown */}
              <div className="absolute top-2.5 right-2.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-[#556575] dark:text-[#9d8f78] hover:text-[#7C3AED] dark:hover:text-[#8B5CF6] hover:bg-white/60 dark:hover:bg-[#2a2a2a] rounded cursor-pointer transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#FAFBFD] dark:bg-[#1A1A1A] border border-[#CBD5E1] dark:border-[#C0C2C5] text-[#090D16] dark:text-[#e5e2e1] shadow-lg z-50 rounded p-1"
                  >
                    <DropdownMenuItem
                      className="hover:bg-[#E2E6EA] dark:hover:bg-[#201f1f] focus:bg-[#E2E6EA] dark:focus:bg-[#201f1f] cursor-pointer text-xs font-semibold text-[#090D16] dark:text-[#e5e2e1]"
                      onClick={() => handleAction("view", teacher)}
                    >
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-[#E2E6EA] dark:hover:bg-[#201f1f] focus:bg-[#E2E6EA] dark:focus:bg-[#201f1f] cursor-pointer text-xs font-semibold text-[#090D16] dark:text-[#e5e2e1]"
                      onClick={() => handleAction("edit", teacher)}
                    >
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 text-red-600 dark:text-red-400 cursor-pointer text-xs font-semibold"
                      onClick={() => handleAction("delete", teacher)}
                    >
                      Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Avatar & Nome */}
              <div className="mt-1 mb-3">
                <Avatar className="h-16 w-16 mx-auto border border-[#CBD5E1] dark:border-[#414042] bg-[#FAFBFD] dark:bg-[#201f1f] shadow-2xs">
                  {photo ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={photo}
                      alt={teacher.name}
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="bg-[#FAFBFD] dark:bg-[#201f1f] text-[#7C3AED] dark:text-[#DDD6FE] data-mono text-base font-bold">
                      {getInitials(teacher.name)}
                    </AvatarFallback>
                  )}
                </Avatar>

                <h3
                  className="font-bold text-[#090D16] dark:text-[#e5e2e1] text-sm sm:text-base mt-3 truncate px-1"
                  title={teacher.name}
                >
                  {teacher.name}
                </h3>
                
                <span className="inline-block label-caps text-[10px] text-[#6D28D9] dark:text-[#DDD6FE] font-bold px-2 py-0.5 mt-1 rounded bg-primary/10 border border-primary/20 truncate max-w-full">
                  {degree}
                </span>
              </div>

              {/* Botões de Contacto */}
              <div className="flex justify-center items-center gap-2 pt-3 border-t border-[#CBD5E1] dark:border-[#414042]/50">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-[#FAFBFD] dark:bg-[#201f1f] text-[#556575] dark:text-[#d5c4ac] hover:text-primary border border-[#CBD5E1] dark:border-[#414042] hover:border-primary rounded-full transition-all cursor-pointer"
                  title={phone || "Sem telefone cadastrado"}
                >
                  <Phone className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-[#FAFBFD] dark:bg-[#201f1f] text-[#556575] dark:text-[#d5c4ac] hover:text-primary border border-[#CBD5E1] dark:border-[#414042] hover:border-primary rounded-full transition-all cursor-pointer"
                  title={teacher.email || "Sem email"}
                >
                  <Mail className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          );
        })}

        {filteredTeachers.length === 0 && (
          <div className="col-span-full text-center py-16 text-[#556575] dark:text-[#9d8f78] text-sm space-y-1">
            <p className="font-semibold text-[#090D16] dark:text-[#e5e2e1]">Nenhum professor encontrado</p>
            <p className="text-xs">Tente ajustar o termo de pesquisa no topo.</p>
          </div>
        )}
      </div>

      {/* Paginação & Telemetria */}
      {filteredTeachers.length > 0 && (
        <div className="flex items-center justify-between pt-3 text-xs text-[#556575] dark:text-[#d5c4ac] border-t border-[#CBD5E1] dark:border-[#414042]">
          <span className="data-mono">
            A exibir <strong className="text-[#6D28D9] dark:text-[#DDD6FE]">{filteredTeachers.length}</strong> de{" "}
            <strong className="text-[#090D16] dark:text-[#e5e2e1]">{teachers.length}</strong> professores
          </span>
          <span className="label-caps text-[#556575] dark:text-[#9d8f78] hidden sm:inline">
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
          <div className="space-y-5 text-[#090D16] dark:text-[#e5e2e1] font-hanken">
            <div className="flex items-center gap-4 border-b border-[#CBD5E1] dark:border-[#414042] pb-4">
              <Avatar className="h-16 w-16 border border-[#CBD5E1] dark:border-[#414042] bg-[#FAFBFD] dark:bg-[#201f1f]">
                {getTeacherPhoto(selectedTeacher) ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={getTeacherPhoto(selectedTeacher)!}
                    alt={selectedTeacher.name}
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <AvatarFallback className="bg-[#FAFBFD] dark:bg-[#201f1f] text-[#7C3AED] dark:text-[#DDD6FE] text-lg font-bold">
                    {getInitials(selectedTeacher.name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-lg font-bold text-[#090D16] dark:text-[#e5e2e1]">
                  {selectedTeacher.name}
                </h3>
                <span className="inline-block label-caps text-[#6D28D9] dark:text-[#DDD6FE] text-[11px] font-bold mt-1 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded">
                  {getTeacherDegree(selectedTeacher)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-[#CBD5E1] dark:border-[#414042] pb-4 text-xs sm:text-sm">
              <div className="p-3 bg-[#E2E6EA] dark:bg-[#201f1f] border border-[#CBD5E1] dark:border-[#414042] rounded">
                <span className="label-caps text-[#556575] dark:text-[#9d8f78] block mb-1">E-mail</span>
                <p className="font-semibold text-[#090D16] dark:text-[#e5e2e1] truncate">
                  {selectedTeacher.email || (
                    <span className="text-muted-foreground text-xs italic font-normal">Não informado</span>
                  )}
                </p>
              </div>
              <div className="p-3 bg-[#E2E6EA] dark:bg-[#201f1f] border border-[#CBD5E1] dark:border-[#414042] rounded">
                <span className="label-caps text-[#556575] dark:text-[#9d8f78] block mb-1">Telemóvel</span>
                <p className="font-semibold data-mono text-[#090D16] dark:text-[#e5e2e1]">
                  {getTeacherPhone(selectedTeacher) || (
                    <span className="text-muted-foreground text-xs italic font-normal">Não informado</span>
                  )}
                </p>
              </div>
            </div>

            <div>
              <h4 className="label-caps text-[#6D28D9] dark:text-[#DDD6FE] mb-2.5 font-bold">
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
                        <tr key={idx} className="hover:bg-[#DDE2E6] dark:hover:bg-[#1A1A1A] transition-colors">
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
                <p className="text-xs text-[#556575] dark:text-[#9d8f78] italic p-3 bg-[#E2E6EA] dark:bg-[#201f1f] rounded border border-[#CBD5E1] dark:border-[#414042]">
                  Nenhuma disciplina ou turma atribuída atualmente no sistema.
                </p>
              )}
            </div>

            <div className="pt-3 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModalType(null)}
                className="border-[#CBD5E1] dark:border-[#414042] text-[#090D16] dark:text-[#e5e2e1] hover:bg-[#E2E6EA] dark:hover:bg-[#201f1f] rounded text-xs font-semibold"
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
          <div className="space-y-4 text-[#090D16] dark:text-[#e5e2e1] font-hanken">
            <div className="space-y-1.5">
              <label className="label-caps text-[#556575] dark:text-[#d5c4ac]">Nome do Professor</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-[#FAFBFD] dark:bg-[#0D0D0D] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary focus:ring-1 focus:ring-primary rounded text-sm text-[#090D16] dark:text-[#e5e2e1] p-2.5 outline-none transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="label-caps text-[#556575] dark:text-[#d5c4ac]">E-mail</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-[#FAFBFD] dark:bg-[#0D0D0D] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary focus:ring-1 focus:ring-primary rounded text-sm text-[#090D16] dark:text-[#e5e2e1] p-2.5 outline-none transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="label-caps text-[#556575] dark:text-[#d5c4ac]">Telemóvel</label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+244 9..."
                className="w-full bg-[#FAFBFD] dark:bg-[#0D0D0D] border border-[#CBD5E1] dark:border-[#414042] focus:border-primary focus:ring-1 focus:ring-primary rounded text-sm text-[#090D16] dark:text-[#e5e2e1] p-2.5 outline-none transition-colors"
              />
            </div>
            <div className="pt-4 flex justify-end gap-2.5 border-t border-[#CBD5E1] dark:border-[#414042]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModalType(null)}
                className="border-[#CBD5E1] dark:border-[#414042] text-[#090D16] dark:text-[#e5e2e1] hover:bg-[#E2E6EA] dark:hover:bg-[#201f1f] rounded text-xs font-semibold"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-[#A78BFA] text-white font-bold rounded shadow-sm transition-all text-xs"
                onClick={async () => {
                  try {
                    setIsSaving(true);
                    await axiosInstance.patch(`/users/${selectedTeacher.id}`, {
                      name: editName,
                      email: editEmail,
                      phone: editPhone,
                      employeeProfile: {
                        phone: editPhone,
                      },
                    });
                    toast({
                      title: "Atualizado",
                      description: "Dados do professor salvos com sucesso.",
                    });
                    fetchTeachers();
                    setModalType(null);
                  } catch (err) {
                    console.error("Erro ao atualizar professor:", err);
                    toast({
                      title: "Erro",
                      description: "Não foi possível atualizar o professor.",
                      variant: "destructive",
                    });
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
              >
                {isSaving ? "Guardando..." : "Guardar Alterações"}
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
          <div className="space-y-4 text-[#090D16] dark:text-[#e5e2e1] font-hanken">
            <p className="text-sm text-[#556575] dark:text-[#d5c4ac]">
              Tem a certeza que deseja remover o professor{" "}
              <strong className="text-[#090D16] dark:text-[#e5e2e1] font-bold">
                {selectedTeacher.name}
              </strong>
              ? Esta ação revogará os acessos e permissões pedagógicas.
            </p>
            <div className="pt-3 flex justify-end gap-2.5 border-t border-[#CBD5E1] dark:border-[#414042]">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setModalType(null)}
                className="border-[#CBD5E1] dark:border-[#414042] text-[#090D16] dark:text-[#e5e2e1] hover:bg-[#E2E6EA] dark:hover:bg-[#201f1f] rounded text-xs font-semibold"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs transition-colors"
                onClick={async () => {
                  try {
                    await axiosInstance.delete(`/users/${selectedTeacher.id}`);
                    toast({
                      title: "Removido",
                      description: `Professor ${selectedTeacher.name} removido.`,
                    });
                    fetchTeachers();
                    setModalType(null);
                  } catch (err) {
                    console.error("Erro ao remover professor:", err);
                    toast({
                      title: "Erro",
                      description: "Não foi possível remover o professor.",
                      variant: "destructive",
                    });
                  }
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