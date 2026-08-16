"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewClass } from "./_components/new-class";
import { NewRoom } from "./_components/new-room";
import { NewSubject } from "./_components/new-subject";
import { Button } from "@/components/ui/button";
import { Search } from "@/lib/icons";
import { EditClass } from "./_components/edit-class";
import { ClassSubjects } from "./_components/class-subjects";
import { ClassDetails } from "./_components/class-details";

import { useState, useEffect } from "react";
import axiosInstance from "@/service/api";
import { Loader2 } from "lucide-react";

export default function Turma() {
  const [classes, setClasses] = useState<{id: string, name: string, level: string, teacher: string, room: string, students: number, capacity: number, schedule: string, status: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const handleSearch = () => {
    setActiveSearch(searchTerm.toLowerCase());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get('/classes');
      const mappedClasses = response.data.map((c: {id: string, name: string, academicLevel: string, teachers?: {name: string}[], room?: string, students?: unknown[], capacity?: number, period?: string}) => ({
        id: c.id,
        name: c.name,
        level: c.academicLevel === '1-6' ? 'Ensino Primário (1-6)' : c.academicLevel === '7-9' ? 'Ensino Secundário I (7-9)' : c.academicLevel === '10-13' ? 'Ensino Secundário II (10-13)' : c.academicLevel,
        teacher: c.teachers && c.teachers.length > 0 ? c.teachers.map((t) => t.name).join(", ") : "Sem professor atribuído",
        room: c.room || 'Sem sala',
        students: c.students?.length || 0,
        capacity: c.capacity || 35,
        schedule: c.period || 'Integral',
        status: "Ativo"
      }));
      setClasses(mappedClasses);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const getOccupancyPercentage = (students: number, capacity: number) => {
    return Math.round((students / capacity) * 100);
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600 font-bold";
    if (percentage >= 80) return "text-amber-600 font-bold";
    return "text-emerald-600 font-bold";
  };

  const filteredClasses = classes.filter(c => !activeSearch || c.name.toLowerCase().includes(activeSearch));

  return (
    <section className="w-full max-w-full space-y-6 px-2 sm:px-4 py-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-hanken text-foreground tracking-tight">Gestão de Turmas</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Gerencie as turmas, salas, disciplinas e alunos da sua instituição</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border border-border shadow-none rounded-lg">
          <CardContent className="pt-5 pb-5 text-center">
            <p className="text-xs font-medium text-muted-foreground mb-1">Total de Turmas</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-primary">{classes.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-none rounded-lg">
          <CardContent className="pt-5 pb-5 text-center">
            <p className="text-xs font-medium text-muted-foreground mb-1">Total de Alunos</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {classes.reduce((sum, c) => sum + c.students, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-none rounded-lg">
          <CardContent className="pt-5 pb-5 text-center">
            <p className="text-xs font-medium text-muted-foreground mb-1">Capacidade Total</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-primary">
              {classes.reduce((sum, c) => sum + c.capacity, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border border-border shadow-none rounded-lg">
          <CardContent className="pt-5 pb-5 text-center">
            <p className="text-xs font-medium text-muted-foreground mb-1">Taxa de Ocupação</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
              {classes.length > 0
                ? Math.round(
                    (classes.reduce((sum, c) => sum + c.students, 0) /
                      classes.reduce((sum, c) => sum + (c.capacity || 1), 0)) *
                      100
                  )
                : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações e Pesquisa */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 bg-card p-4 rounded-lg border border-border shadow-none">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar turma por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-9 pr-3 h-11 bg-input border border-border focus:border-secondary-foreground rounded-sm text-xs sm:text-sm text-foreground focus:border-primary focus:bg-card focus:outline-none transition-all"
            />
          </div>
          <Button onClick={handleSearch} className="bg-primary text-primary-foreground border-none rounded-sm hover:bg-[#A78BFA] hover:shadow-[0_0_12px_rgba(139, 92, 246,0.4)] transition-all font-bold font-hanken text-sm px-4 py-2 h-10">
            Pesquisar
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <NewSubject onCreated={fetchClasses} />
          <NewRoom />
          <NewClass />
        </div>
      </div>

      {/* Tabela de Turmas */}
      <Card className="bg-card border border-border shadow-none rounded-lg shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base sm:text-lg font-bold text-foreground">Lista Completa de Turmas</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-xs sm:text-sm text-left divide-y divide-border">
              <thead className="bg-muted font-jetbrains text-[11px] font-bold text-secondary-foreground uppercase tracking-widest">
                <tr>
                  <th className="py-3 px-4">Turma</th>
                  <th className="py-3 px-4">Nível</th>
                  <th className="py-3 px-4">Professor(es)</th>
                  <th className="py-3 px-4">Sala</th>
                  <th className="py-3 px-4 text-center">Alunos</th>
                  <th className="py-3 px-4 text-center">Ocupação</th>
                  <th className="py-3 px-4">Horário</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                      <span className="text-xs text-muted-foreground mt-2 block">Carregando turmas...</span>
                    </td>
                  </tr>
                ) : filteredClasses.length > 0 ? (
                  filteredClasses.map((cls) => {
                    const percentage = getOccupancyPercentage(cls.students, cls.capacity);
                    return (
                      <tr key={cls.id} className="hover:bg-muted transition-colors">
                        <td className="py-3 px-4 font-bold text-foreground whitespace-nowrap">{cls.name}</td>
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{cls.level}</td>
                        <td className="py-3 px-4 text-foreground font-medium max-w-[180px] truncate" title={cls.teacher}>{cls.teacher}</td>
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{cls.room}</td>
                        <td className="py-3 px-4 text-center font-semibold text-foreground whitespace-nowrap">
                          {cls.students} / {cls.capacity}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span className={getOccupancyColor(percentage)}>{percentage}%</span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{cls.schedule}</td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1">
                            <ClassDetails classId={cls.id} />
                            <ClassSubjects classId={cls.id} className={cls.name} />
                            <EditClass />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground text-sm">
                      Nenhuma turma encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}