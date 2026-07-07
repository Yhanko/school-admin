"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {StudentRow} from "./studentRow";
import { useState, useEffect } from "react";
import axiosInstance from "@/service/api";
import { Loader2 } from "lucide-react";

interface Student {
  id: string;
  name: string;
  studentId: string;
  date: string;
  parentName: string;
  city: string;
  grade: string;
  gradeColor: string;
  isSelected: boolean;
}

// Remove static students mock

export function StudentTable (){
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await axiosInstance.get('/users?role=STUDENT');
        const apiStudents = response.data.map((user: any) => ({
          id: user.id,
          name: user.name,
          studentId: user.id.substring(0, 8),
          date: new Date(user.createdAt).toLocaleDateString(),
          parentName: "N/A", // TODO: Fetch from profile if available
          city: "Luanda", // TODO: Update based on entity
          grade: "N/A", // TODO: Update based on class
          gradeColor: "bg-[#FF5777]",
          isSelected: false,
        }));
        setStudents(apiStudents);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudents();
  }, []);

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden w-full">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-[1px] border-gray-200">
            <TableHead className="w-12 px-6 py-4 border-[1px] border-gray-200">
              <Checkbox />
            </TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Name</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">ID</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Date</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Parent Name</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">City</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Contact</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Grade</TableHead>
            <TableHead className="px-6 py-4 text-gray-700 font-medium">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-[1px] border-gray-200">
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
              </TableCell>
            </TableRow>
          ) : students.length > 0 ? (
            students.map((student) => (
              <StudentRow key={student.id} student={student} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                Nenhum estudante encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-between px-6 py-4 bg-transparent border-t border-border">
        <div className="text-sm text-gray-500">
          Showing 1-5 from 100 data
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md text-sm">2</button>
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md text-sm">3</button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};