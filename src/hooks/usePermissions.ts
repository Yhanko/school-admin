"use client";

import { useAuth } from "@/store/useAuth";

export function usePermissions() {
  const { user } = useAuth();
  
  const role = user?.role || "ADMIN";
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isAdmin = role === "ADMIN";
  const isDirector = isSuperAdmin || isAdmin;
  const isSecretary = role === "SECRETARY";
  const isTeacher = role === "TEACHER";

  const isPedagogicalDirector = role === "PEDAGOGICAL_DIRECTOR";

  return {
    role,
    isSuperAdmin,
    isAdmin,
    isDirector,
    isSecretary,
    isTeacher,
    isPedagogicalDirector,
    
    // Ações Críticas
    canDeleteUsers: isDirector,
    canDeleteClasses: isDirector || isPedagogicalDirector,
    canManagePermissions: isDirector,
    canConfigureAcademicYear: isDirector || isPedagogicalDirector,
    canViewProfitReports: isDirector,
    
    // Ações Operacionais
    canEnrollStudents: isDirector || isSecretary || isPedagogicalDirector,
    canIssuePayments: isDirector || isSecretary,
    canCloseCashier: isDirector || isSecretary,
    canGenerateDocuments: isDirector || isSecretary || isPedagogicalDirector,
    canLaunchGrades: isDirector || isSecretary || isTeacher || isPedagogicalDirector,
    
    roleLabel: isDirector
      ? "Direcção Geral"
      : isSecretary
      ? "Secretaria Administrativa"
      : isPedagogicalDirector
      ? "Director Pedagógico"
      : isTeacher
      ? "Docente"
      : "Utilizador",
  };
}
