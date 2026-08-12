"use client"
import { Phone, Mail, MoreHorizontal } from "@/lib/icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
        const teacherList = response.data.filter((user: { role: string }) => user.role === 'TEACHER');
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
      <div className="flex flex-col justify-center items-center h-64 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-[#4D44B5]" />
        <span className="text-xs text-gray-500 mt-2">Carregando professores...</span>
      </div>
    );
  }

  const filteredTeachers = teachers.filter(t => !activeSearch || t.name.toLowerCase().includes(activeSearch));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 w-full shadow-sm">
      {/* Grid de Professores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {filteredTeachers.map((teacher) => (
          <div key={teacher.id} className="bg-gray-50/80 hover:bg-gray-50 border border-gray-200 rounded-xl p-5 text-center relative transition-all shadow-xs">
            {/* Opções */}
            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-600 cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border-border shadow-lg z-50 rounded-xl">
                  <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer text-xs font-medium" onClick={() => handleAction('view', teacher)}>Ver Detalhes</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-100 cursor-pointer text-xs font-medium" onClick={() => handleAction('edit', teacher)}>Editar</DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-red-50 text-red-600 cursor-pointer text-xs font-medium" onClick={() => handleAction('delete', teacher)}>Remover</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Avatar */}
            <div className="mb-3 cursor-pointer">
              <Avatar className="h-16 w-16 mx-auto shadow-xs">
                {teacher.profile?.photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={teacher.profile.photoUrl} alt={teacher.name} className="object-cover w-full h-full rounded-full" />
                ) : (
                    <AvatarFallback className="bg-purple-100 text-purple-700 text-base font-bold">
                      {getInitials(teacher.name)}
                    </AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Nome */}
            <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-0.5 truncate px-1" title={teacher.name}>{teacher.name}</h3>
            
            {/* Grau / Especialidade */}
            <p className="text-gray-500 text-xs mb-4 truncate px-1">{teacher.profile?.degree || 'Professor'}</p>

            {/* Botões de Contacto */}
            <div className="flex justify-center space-x-2">
              <Button 
                size="icon" 
                className="h-8 w-8 bg-[#4D44B5] hover:bg-[#3d3695] text-white rounded-full cursor-pointer"
                title={teacher.profile?.phone || "Sem telefone"}
              >
                <Phone className="h-3.5 w-3.5" />
              </Button>
              <Button 
                size="icon" 
                className="h-8 w-8 bg-[#4D44B5] hover:bg-[#3d3695] text-white rounded-full cursor-pointer"
                title={teacher.email}
              >
                <Mail className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {filteredTeachers.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 text-sm">
            Nenhum professor encontrado.
          </div>
        )}
      </div>

      {/* Paginação */}
      {filteredTeachers.length > 0 && (
        <div className="flex items-center justify-between pt-2 text-xs sm:text-sm text-gray-500 border-t border-gray-100">
          <div>Exibindo <span className="font-semibold text-gray-900">{filteredTeachers.length}</span> professores</div>
        </div>
      )}

      {/* Modal Ver Detalhes */}
      {selectedTeacher && (
        <Modal
          isOpen={modalType === 'view'}
          onClose={() => setModalType(null)}
          title="Dados do Professor"
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 border-b pb-4">
              <Avatar className="h-16 w-16">
                {selectedTeacher.profile?.photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={selectedTeacher.profile.photoUrl} alt={selectedTeacher.name} className="object-cover w-full h-full rounded-full" />
                ) : (
                    <AvatarFallback className="bg-purple-100 text-purple-700 text-lg font-bold">
                      {getInitials(selectedTeacher.name)}
                    </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedTeacher.name}</h3>
                <p className="text-xs text-gray-500">{selectedTeacher.profile?.degree || 'Professor'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-6 text-xs sm:text-sm">
              <div>
                <p className="font-medium text-gray-500">E-mail</p>
                <p className="font-semibold text-gray-900">{selectedTeacher.email || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">Telemóvel</p>
                <p className="font-semibold text-gray-900">{selectedTeacher.profile?.phone || "N/A"}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#4D44B5] uppercase tracking-wider mb-3">Informações Pedagógicas</h4>
              
              {selectedTeacher.classSubjects && selectedTeacher.classSubjects.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-xs sm:text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-[11px]">
                      <tr>
                        <th className="p-3">Disciplina</th>
                        <th className="p-3">Turma</th>
                        <th className="p-3">Ano Lectivo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedTeacher.classSubjects.map((cs, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-3 font-semibold text-gray-900">{cs.subject.name}</td>
                          <td className="p-3 text-gray-700">{cs.class.grade} - {cs.class.name} ({cs.class.period})</td>
                          <td className="p-3 text-gray-500">{cs.class.academicYear?.year || "Atual"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">Nenhuma disciplina ou turma atribuída atualmente.</p>
              )}
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button variant="outline" onClick={() => setModalType(null)} className="rounded-xl">Fechar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Editar */}
      {selectedTeacher && (
        <Modal
          isOpen={modalType === 'edit'}
          onClose={() => setModalType(null)}
          title="Editar Professor"
          size="md"
        >
          <div className="space-y-4">
            <div className="space-y-2">
               <label className="text-xs font-semibold text-gray-700">Nome do Professor</label>
               <input type="text" defaultValue={selectedTeacher.name} className="w-full border border-gray-300 rounded-xl p-2.5 text-sm" />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-semibold text-gray-700">E-mail</label>
               <input type="text" defaultValue={selectedTeacher.email} className="w-full border border-gray-300 rounded-xl p-2.5 text-sm" />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalType(null)} className="rounded-xl">Cancelar</Button>
              <Button className="bg-[#4D44B5] hover:bg-[#3d3695] text-white rounded-xl" onClick={() => setModalType(null)}>Guardar Alterações</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Remover */}
      {selectedTeacher && (
        <Modal
          isOpen={modalType === 'delete'}
          onClose={() => setModalType(null)}
          title="Remover Professor"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Tem a certeza que deseja remover o professor <strong className="text-gray-900">{selectedTeacher.name}</strong>?
            </p>
            <div className="pt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalType(null)} className="rounded-xl">Cancelar</Button>
              <Button className="bg-[#FF5777] hover:bg-[#fc4667] text-white rounded-xl" onClick={() => setModalType(null)}>Confirmar Remoção</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}