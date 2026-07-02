"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewClass } from "./_components/new-class";
import { Button } from "@/components/ui/button";
import {
  Search,
  Trash2,
} from "@/lib/icons";
import { EditClass } from "./_components/edit-class";
import { EnrollStudent } from "./_components/enroll-student";


import { useState, useEffect } from "react";
import axiosInstance from "@/service/api";
import { Loader2 } from "lucide-react";

export default function Turma(){
  const [classes, setClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get('/classes');
      // Map API response to required UI format
      const mappedClasses = response.data.map((c: any) => ({
        id: c.id,
        name: c.name,
        level: `${c.grade || 1}º Ano`, // Mocked level
        teacher: "Prof. Atribuído", // Mocked teacher for now
        students: c.students?.length || 0,
        capacity: c.capacity || 35,
        schedule: c.shift === 'MORNING' ? '07:00 - 11:30' : '13:00 - 17:30',
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
// Remove static classes array

  const getOccupancyPercentage = (students: number, capacity: number) => {
    return Math.round((students / capacity) * 100);
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 80) return "text-orange-600";
    return "text-green-600";
  };

  return(
      <section className="space-y-4 p-4 w-[70rem]">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Gestão de Turmas</h1>
            <p className="text-muted-foreground">Visualize e gerencie todas as turmas da escola</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Total de Turmas</p>
                <p className="text-4xl font-bold text-primary">{classes.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Total de Alunos</p>
                <p className="text-4xl font-bold text-green-600">
                  {classes.reduce((sum, c) => sum + c.students, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Capacidade Total</p>
                <p className="text-4xl font-bold text-blue-600">
                  {classes.reduce((sum, c) => sum + c.capacity, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Taxa de Ocupação</p>
                <p className="text-4xl font-bold text-orange-600">
                  {Math.round(
                    (classes.reduce((sum, c) => sum + c.students, 0) /
                      classes.reduce((sum, c) => sum + c.capacity, 0)) *
                      100
                  )}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar por turma"
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <NewClass/>

        </div>

        {/* Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista Completa de Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-gray-200 border-[1px]">
                <thead>
                  <tr className="border-b border-gray-200 border-[1px]">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Turma</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Nível</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Professor</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Sala</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Alunos</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Ocupação</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Horário</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                      </td>
                    </tr>
                  ) : classes.length > 0 ? (
                    classes.map((cls) => {
                      const occupancy = getOccupancyPercentage(cls.students, cls.capacity);
                      return (
                        <tr key={cls.id} className="border-b border-gray-200 border-[1px] hover:bg-muted/50">
                          <td className="py-3 px-4 font-bold text-foreground text-lg">{cls.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{cls.level}</td>
                          <td className="py-3 px-4 text-muted-foreground text-xs">{cls.teacher}</td>
                          <td className="py-3 px-4 text-muted-foreground text-xs">Sala</td>
                          <td className="py-3 px-4 text-center font-semibold text-foreground">
                            {cls.students}/{cls.capacity}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-semibold ${getOccupancyColor(occupancy)}`}>
                              {occupancy}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-xs">{cls.schedule}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <EnrollStudent classId={cls.id} className={cls.name} onSuccess={fetchClasses} />
                              <EditClass/>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
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
  )
}