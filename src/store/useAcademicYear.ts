import { create } from 'zustand';

export interface AcademicYear {
  id: string;
  year: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

interface AcademicYearStore {
  academicYears: AcademicYear[];
  selectedYear: AcademicYear | null;
  activeYear: AcademicYear | null;
  setAcademicYears: (years: AcademicYear[]) => void;
  setSelectedYear: (year: AcademicYear) => void;
  setActiveYear: (year: AcademicYear) => void;
}

export const useAcademicYear = create<AcademicYearStore>((set) => ({
  academicYears: [],
  selectedYear: null,
  activeYear: null,
  setAcademicYears: (years) => set({ academicYears: years }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setActiveYear: (year) => set({ activeYear: year }),
}));
