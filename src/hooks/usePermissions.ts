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

  return {
    role,
    isSuperAdmin,
    isAdmin,
    isDirector,
    isSecretary,
    isTeacher,
    
    // Ações Críticas
    canDeleteUsers: isDirector,
    canDeleteClasses: isDirector,
    canManagePermissions: isDirector,
    canConfigureAcademicYear: isDirector,
    canViewProfitReports: isDirector,
    
    // Ações Operacionais
    canEnrollStudents: isDirector || isSecretary,
    canIssuePayments: isDirector || isSecretary,
    canCloseCashier: isDirector || isSecretary,
    canGenerateDocuments: isDirector || isSecretary,
    canLaunchGrades: isDirector || isSecretary || isTeacher,
    
    roleLabel: isDirector
      ? "Direcção Geral"
      : isSecretary
      ? "Secretaria Administrativa"
      : isTeacher
      ? "Docente"
      : "Utilizador",
  };
}
