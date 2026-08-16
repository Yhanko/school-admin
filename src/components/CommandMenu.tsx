"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Student,
  University,
  SiGoogleclassroom,
  FileCheck,
  BsCashCoin,
  Award,
  Plus,
  Home,
  LuUserCog,
  CalendarDays,
  Clock,
  Loader2,
  Receipt,
  Printer,
} from "@/lib/icons";
import axiosInstance from "@/service/api";
import { usePermissions } from "@/hooks/usePermissions";

export function CommandMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { isDirector, isSecretary } = usePermissions();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    students: Array<{ id: string; name: string; code?: string }>;
    teachers: Array<{ id: string; name: string }>;
    classes: Array<{ id: string; name: string; grade?: string }>;
  }>({ students: [], teachers: [], classes: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          const evt = new CustomEvent("open-command-palette");
          window.dispatchEvent(evt);
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults({ students: [], teachers: [], classes: [] });
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const [usersRes, classesRes] = await Promise.all([
          axiosInstance.get("/users").catch(() => ({ data: [] })),
          axiosInstance.get("/classes").catch(() => ({ data: [] })),
        ]);

        const q = query.toLowerCase();
        const allUsers = Array.isArray(usersRes.data) ? usersRes.data : [];
        const allClasses = Array.isArray(classesRes.data) ? classesRes.data : [];

        const students = allUsers
          .filter(
            (u: any) =>
              u.role === "STUDENT" &&
              (u.name?.toLowerCase().includes(q) || u.code?.toLowerCase().includes(q))
          )
          .slice(0, 4);

        const teachers = allUsers
          .filter(
            (u: any) =>
              u.role === "TEACHER" && u.name?.toLowerCase().includes(q)
          )
          .slice(0, 3);

        const classes = allClasses
          .filter((c: any) => c.name?.toLowerCase().includes(q) || c.grade?.toLowerCase().includes(q))
          .slice(0, 3);

        setSearchResults({ students, teachers, classes });
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    onClose();
    setQuery("");
    startTransition(() => {
      router.push(path);
    });
  };

  const quickActions = [
    {
      title: "Nova Matrícula de Aluno",
      icon: Plus,
      path: "/student",
      badge: "Estudantes",
    },
    {
      title: "Emitir Declaração / Certificado",
      icon: FileCheck,
      path: "/documents",
      badge: "Documentos",
    },
    {
      title: "Lançar Pautas e Notas (MED)",
      icon: Award,
      path: "/pautas",
      badge: "Pedagógico",
    },
    {
      title: "Fecho de Caixa Diário",
      icon: Receipt,
      path: "/payments",
      badge: "Finanças",
    },
    ...(isDirector
      ? [
          {
            title: "Gerir Permissões de Acesso",
            icon: LuUserCog,
            path: "/permission",
            badge: "Direcção",
          },
        ]
      : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-xs font-hanken animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#FAFBFD] dark:bg-[#121212] border border-[#CBD5E1] dark:border-[#414042] rounded-lg shadow-2xl overflow-hidden text-[#090D16] dark:text-[#e5e2e1] flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#CBD5E1] dark:border-[#414042] gap-3 bg-white dark:bg-[#161616]">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar estudantes, professores, turmas, páginas ou ações (Ctrl+K)..."
            className="w-full bg-transparent text-sm sm:text-base outline-none text-[#090D16] dark:text-[#e5e2e1] placeholder-[#556575] dark:placeholder-[#9d8f78]"
            autoFocus
          />
          {isSearching && (
            <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-[#E2E6EA] dark:bg-[#201f1f] border border-[#CBD5E1] dark:border-[#414042] rounded text-[#556575] dark:text-[#d5c4ac] data-mono">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-3 space-y-4 max-h-[60vh]">
          {/* Quick Actions if query is empty or matches */}
          {(!query || quickActions.some((a) => a.title.toLowerCase().includes(query.toLowerCase()))) && (
            <div>
              <span className="label-caps text-[10px] text-[#556575] dark:text-[#9d8f78] px-2 block mb-1.5 font-bold">
                Ações Rápidas
              </span>
              <div className="space-y-1">
                {quickActions
                  .filter((a) => !query || a.title.toLowerCase().includes(query.toLowerCase()))
                  .map((act, i) => (
                    <button
                      key={i}
                      onClick={() => navigateTo(act.path)}
                      className="w-full flex items-center justify-between p-2.5 rounded hover:bg-[#E2E6EA] dark:hover:bg-[#1e1e1e] cursor-pointer text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded bg-primary/10 text-primary">
                          <act.icon size={16} />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-[#090D16] dark:text-[#e5e2e1] group-hover:text-primary">
                          {act.title}
                        </span>
                      </div>
                      <span className="label-caps text-[9px] px-2 py-0.5 rounded bg-[#E2E6EA] dark:bg-[#201f1f] text-[#556575] dark:text-[#d5c4ac] border border-[#CBD5E1] dark:border-[#414042]">
                        {act.badge}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Student Search Results */}
          {searchResults.students.length > 0 && (
            <div>
              <span className="label-caps text-[10px] text-[#556575] dark:text-[#9d8f78] px-2 block mb-1.5 font-bold">
                Estudantes Encontrados
              </span>
              <div className="space-y-1">
                {searchResults.students.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => navigateTo(`/students-details?id=${st.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded hover:bg-[#E2E6EA] dark:hover:bg-[#1e1e1e] cursor-pointer text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-primary/10 text-primary">
                        <Student size={16} />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-[#090D16] dark:text-[#e5e2e1]">
                          {st.name}
                        </p>
                        {st.code && (
                          <span className="data-mono text-[10px] text-[#556575] dark:text-[#d5c4ac]">
                            Matrícula #{st.code}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      Ver Ficha ➔
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Search Results */}
          {searchResults.teachers.length > 0 && (
            <div>
              <span className="label-caps text-[10px] text-[#556575] dark:text-[#9d8f78] px-2 block mb-1.5 font-bold">
                Professores Encontrados
              </span>
              <div className="space-y-1">
                {searchResults.teachers.map((tc) => (
                  <button
                    key={tc.id}
                    onClick={() => navigateTo(`/pedagogical`)}
                    className="w-full flex items-center justify-between p-2.5 rounded hover:bg-[#E2E6EA] dark:hover:bg-[#1e1e1e] cursor-pointer text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-primary/10 text-primary">
                        <University size={16} />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-[#090D16] dark:text-[#e5e2e1]">
                        {tc.name}
                      </span>
                    </div>
                    <span className="text-xs text-[#556575] dark:text-[#d5c4ac]">
                      Área Pedagógica
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Classes Search Results */}
          {searchResults.classes.length > 0 && (
            <div>
              <span className="label-caps text-[10px] text-[#556575] dark:text-[#9d8f78] px-2 block mb-1.5 font-bold">
                Turmas Encontradas
              </span>
              <div className="space-y-1">
                {searchResults.classes.map((cl) => (
                  <button
                    key={cl.id}
                    onClick={() => navigateTo(`/turma/${cl.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded hover:bg-[#E2E6EA] dark:hover:bg-[#1e1e1e] cursor-pointer text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-primary/10 text-primary">
                        <SiGoogleclassroom size={16} />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-[#090D16] dark:text-[#e5e2e1]">
                          {cl.name}
                        </span>
                        {cl.grade && (
                          <span className="data-mono text-[10px] text-[#556575] dark:text-[#d5c4ac] ml-2">
                            ({cl.grade})
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-primary">
                      Abrir Turma ➔
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {query.trim() &&
            !isSearching &&
            searchResults.students.length === 0 &&
            searchResults.teachers.length === 0 &&
            searchResults.classes.length === 0 && (
              <div className="py-8 text-center text-xs text-[#556575] dark:text-[#9d8f78] space-y-1">
                <p className="font-semibold text-[#090D16] dark:text-[#e5e2e1]">
                  Nenhum resultado encontrado para &quot;{query}&quot;
                </p>
                <p>Verifique a digitação ou tente pesquisar por outro termo.</p>
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#FAFBFD] dark:bg-[#161616] border-t border-[#CBD5E1] dark:border-[#414042] flex items-center justify-between text-[11px] text-[#556575] dark:text-[#9d8f78]">
          <div className="flex items-center gap-2">
            <span>Navegar:</span>
            <kbd className="px-1.5 py-0.5 bg-[#E2E6EA] dark:bg-[#201f1f] rounded border border-[#CBD5E1] dark:border-[#414042] data-mono text-[10px]">
              ↑
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-[#E2E6EA] dark:bg-[#201f1f] rounded border border-[#CBD5E1] dark:border-[#414042] data-mono text-[10px]">
              ↓
            </kbd>
            <kbd className="px-1.5 py-0.5 bg-[#E2E6EA] dark:bg-[#201f1f] rounded border border-[#CBD5E1] dark:border-[#414042] data-mono text-[10px]">
              ENTER
            </kbd>
          </div>
          <span className="label-caps text-[9px]">YhankoEduca Global Search</span>
        </div>
      </div>
    </div>
  );
}
