"use client"

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {StudentRow} from "./studentRow";

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

const students: Student[] = [
  {
    id: "1",
    name: "Samanta William",
    studentId: "#123456789",
    date: "March 25, 2021",
    parentName: "Mana William",
    city: "Jakarta",
    grade: "VII A",
    gradeColor: "bg-[#FF5777]",
    isSelected: true
  },
  {
    id: "2",
    name: "Tony Soap",
    studentId: "#123456789",
    date: "March 25, 2021",
    parentName: "James Soap",
    city: "Jakarta",
    grade: "VII B",
    gradeColor: "bg-yellow-500",
    isSelected: false
  },
  {
    id: "3",
    name: "Karen Hope",
    studentId: "#123456789",
    date: "March 25, 2021",
    parentName: "Justin Hope",
    city: "Jakarta",
    grade: "VII C",
    gradeColor: "bg-blue-600",
    isSelected: true
  },
  {
    id: "4",
    name: "Jordan Nico",
    studentId: "#123456789",
    date: "March 25, 2021",
    parentName: "Amanda Nico",
    city: "Jakarta",
    grade: "VII A",
    gradeColor: "bg-yellow-500",
    isSelected: false
  },
  {
    id: "5",
    name: "Nadila Adja",
    studentId: "#123456789",
    date: "March 25, 2021",
    parentName: "Jack Adja",
    city: "Jakarta",
    grade: "VII A",
    gradeColor: "bg-[#FF5777]",
    isSelected: true
  },
  {
    id: "6",
    name: "Johnny Ahmad",
    studentId: "#123456789",
    date: "March 25, 2021",
    parentName: "Danny Ahmad",
    city: "Jakarta",
    grade: "VII A",
    gradeColor: "bg-yellow-500",
    isSelected: false
  }
];

export function StudentTable (){

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
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
          {students.map((student) => (
            <StudentRow key={student.id} student={student} />
          ))}
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