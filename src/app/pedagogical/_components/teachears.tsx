"use client"
import { Phone, Mail, MoreHorizontal } from "@/lib/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Link from "next/link";
import { useEffect, useState } from "react";
import axiosInstance from "@/service/api";
import { Loader2 } from "@/lib/icons";
import { Modal } from "@/app/student/_components/modal";

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

export function Teachears ({ activeSearch }: { activeSearch?: string }) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const handleAction = (type: 'view' | 'edit' | 'delete', teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setModalType(type);
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axiosInstance.get('/users');
        const teacherList = response.data.filter((user: any) => user.role === 'TEACHER');
        console.log("Fetched teachers:", teacherList);
        setTeachers(teacherList);
      } catch (error) {
        console.error("Failed to fetch teachers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 w-full max-w-7xl">
      {/* Grid of Teachers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {teachers.filter(t => !activeSearch || t.name.toLowerCase().includes(activeSearch)).map((teacher) => (
          <div key={teacher.id} className="bg-muted/30 border border-border rounded-lg p-6 text-center relative">
            {/* More Options */}
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border shadow-lg z-50">
                  <DropdownMenuItem className="hover:bg-gray-50 hover:cursor-pointer" onClick={() => handleAction('view', teacher)}>Ver Detalhes</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-50 hover:cursor-pointer" onClick={() => handleAction('edit', teacher)}>Editar</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-red-50 text-red-600 cursor-pointer" onClick={() => handleAction('delete', teacher)}>Remover</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Avatar */}
            <div className="mb-4 cursor-pointer">
              <Avatar className="h-16 w-16 mx-auto">
                {teacher.profile?.photoUrl ? (
                    <img src={teacher.profile.photoUrl} alt={teacher.name} className="object-cover w-full h-full rounded-full" />
                ) : (
                    <AvatarFallback className="bg-purple-200 text-purple-700 text-lg font-medium">
                      {getInitials(teacher.name)}
                    </AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Name */}
            <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate px-2">{teacher.name}</h3>
            
            {/* Subject */}
            <p className="text-gray-500 text-sm mb-4 truncate px-2">{teacher.profile?.degree || 'Professor'}</p>

            {/* Contact Buttons */}
            <div className="flex justify-center space-x-2">
              <Button 
                size="icon" 
                className="h-8 w-8 bg-[#6366f1] hover:bg-[#5856eb] text-white rounded-full"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="h-8 w-8 bg-[#6366f1] hover:bg-[#5856eb] text-white rounded-full"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {teachers.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nenhum professor encontrado.
          </div>
        )}
      </div>

      {/* Pagination */}
      {teachers.length > 0 && (
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
            Mostrando {teachers.length} professores
            </div>
        </div>
      )}

      {/* View Modal */}
      {selectedTeacher && (
        <Modal
          isOpen={modalType === 'view'}
          onClose={() => setModalType(null)}
          title="Dados do Professor"
          size="lg"
        >
          <div className="space-y-6">
            {/* Secção de Perfil Pessoal */}
            <div className="flex items-center gap-4 border-b pb-4">
              <Avatar className="h-20 w-20">
                {selectedTeacher.profile?.photoUrl ? (
                    <img src={selectedTeacher.profile.photoUrl} alt={selectedTeacher.name} className="object-cover w-full h-full rounded-full" />
                ) : (
                    <AvatarFallback className="bg-purple-200 text-purple-700 text-xl font-medium">
                      {getInitials(selectedTeacher.name)}
                    </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedTeacher.name}</h3>
                <p className="text-gray-500">{selectedTeacher.profile?.degree || 'Professor'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-b pb-6">
              <div>
                <p className="text-sm font-medium text-gray-500">E-mail</p>
                <p className="text-base text-gray-900">{selectedTeacher.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Número de Celular</p>
                <p className="text-base text-gray-900">{selectedTeacher.profile?.phone || "N/A"}</p>
              </div>
            </div>

            {/* Secção de Informações Pedagógicas */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Informações Pedagógicas</h4>
              
              {selectedTeacher.classSubjects && selectedTeacher.classSubjects.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-gray-700">
                      <tr>
                        <th className="px-4 py-3 font-medium">Disciplina</th>
                        <th className="px-4 py-3 font-medium">Turma</th>
                        <th className="px-4 py-3 font-medium">Classe</th>
                        <th className="px-4 py-3 font-medium">Período</th>
                        <th className="px-4 py-3 font-medium">Ano Letivo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedTeacher.classSubjects.map((cs, idx) => (
                        <tr key={idx} className="hover:bg-muted/50">
                          <td className="px-4 py-3">{cs.subject.name}</td>
                          <td className="px-4 py-3">{cs.class.name}</td>
                          <td className="px-4 py-3">{cs.class.grade || "N/A"}</td>
                          <td className="px-4 py-3">{cs.class.period}</td>
                          <td className="px-4 py-3">{cs.class.academicYear?.year || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : selectedTeacher.classesTeaching && selectedTeacher.classesTeaching.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-gray-700">
                      <tr>
                        <th className="px-4 py-3 font-medium">Turma</th>
                        <th className="px-4 py-3 font-medium">Classe</th>
                        <th className="px-4 py-3 font-medium">Período</th>
                        <th className="px-4 py-3 font-medium">Ano Letivo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {selectedTeacher.classesTeaching.map((ct, idx) => (
                        <tr key={idx} className="hover:bg-muted/50">
                          <td className="px-4 py-3">{ct.name}</td>
                          <td className="px-4 py-3">{ct.grade || "N/A"}</td>
                          <td className="px-4 py-3">{ct.period}</td>
                          <td className="px-4 py-3">{ct.academicYear?.year || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhuma disciplina ou turma atribuída atualmente.</p>
              )}
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button onClick={() => setModalType(null)} className="bg-[#5856eb] hover:bg-[#5856eb]/90 text-white">Fechar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {selectedTeacher && (
        <Modal
          isOpen={modalType === 'edit'}
          onClose={() => setModalType(null)}
          title="Editar Professor"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Em breve será possível editar as informações completas do professor através deste painel.
            </p>
            <div className="space-y-2">
               <label className="text-sm font-medium text-foreground">Nome do Professor</label>
               <input type="text" defaultValue={selectedTeacher.name} className="w-full border border-border rounded-lg p-2" />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium text-foreground">Telefone</label>
               <input type="text" defaultValue={selectedTeacher.profile?.phone} className="w-full border border-border rounded-lg p-2" />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalType(null)}>Cancelar</Button>
              <Button className="bg-[#5856eb] hover:bg-[#5856eb]/90 text-white" onClick={() => setModalType(null)}>Salvar Alterações</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {selectedTeacher && (
        <Modal
          isOpen={modalType === 'delete'}
          onClose={() => setModalType(null)}
          title="Confirmar Exclusão"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Tem certeza que deseja apagar o registo do professor <strong className="text-gray-900">{selectedTeacher.name}</strong>? Esta ação não pode ser desfeita.
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