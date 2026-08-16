"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Modal } from "./modal";
import {
  FileText,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
} from "@/lib/icons";
import axiosInstance from "@/service/api";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BiDocumentScanner, ExtractedBiData } from "@/components/BiDocumentScanner";

type AcademicLevel = "1-6" | "7-9" | "10-13" | "transfer" | null;

interface StudentFormData {
  studentNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
  birthCertificate: File | null;
  vaccineCard: File | null;
  proofOfAddress: File | null;

  // Parent Info (for 1-6)
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  parentPassword?: string;
  parentConfirmPassword?: string;

  // Guardian Info (for 10-13)
  guardianFirstName: string;
  guardianLastName: string;
  guardianEmail: string;
  guardianPhone: string;
  guardianRelationship: string;
  guardianPassword?: string;
  guardianConfirmPassword?: string;

  // Academic Info
  cycle: string;
  course: string;
  class: string;
  classe?: string;

  // Documents
  previousCertificate: File | null; // for 7-9
  grade9Certificate: File | null; // for 10-13
  transferRequest: File | null; // for transfer
  previousSchool: string; // for transfer
  previousClass: string; // for transfer
}

const safeStringRegex = /^[^<>\';=]*$/;
const baseString = z.string().trim().regex(safeStringRegex, "Caracteres inválidos").min(1, "Obrigatório").max(100, "Muito longo");
const emailString = z.string().trim().email("E-mail inválido").max(100).regex(safeStringRegex, "Caracteres inválidos").or(z.literal(""));

const studentSchema = z.object({
  firstName: baseString,
  lastName: baseString,
  dateOfBirth: baseString,
  gender: baseString.or(z.literal("")),
  email: emailString,
  phone: baseString.or(z.literal("")),
  password: z.string().min(6, "No mínimo 6 caracteres").max(100).regex(safeStringRegex, "Caracteres inválidos").or(z.literal("")),
  confirmPassword: z.string().or(z.literal("")),
  class: baseString,
  classe: baseString,
}).superRefine((data, ctx) => {
  if (data.password && data.password !== data.confirmPassword) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Senhas não conferem", path: ["confirmPassword"] });
  }
});

const parentSchema = z.object({
  parentFirstName: baseString,
  parentLastName: baseString,
  parentEmail: emailString,
  parentPhone: baseString,
  parentPassword: z.string().min(6, "No mínimo 6 caracteres").max(100).regex(safeStringRegex, "Caracteres inválidos").or(z.literal("")),
  parentConfirmPassword: z.string().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.parentPassword && data.parentPassword !== data.parentConfirmPassword) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Senhas não conferem", path: ["parentConfirmPassword"] });
  }
});

const guardianSchema = z.object({
  guardianFirstName: baseString,
  guardianLastName: baseString,
  guardianRelationship: baseString,
  guardianEmail: emailString,
  guardianPhone: baseString,
  guardianPassword: z.string().min(6, "No mínimo 6 caracteres").max(100).regex(safeStringRegex, "Caracteres inválidos").or(z.literal("")),
  guardianConfirmPassword: z.string().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.guardianPassword && data.guardianPassword !== data.guardianConfirmPassword) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Senhas não conferem", path: ["guardianConfirmPassword"] });
  }
});

const transferSchema = z.object({
  previousSchool: baseString,
  previousClass: baseString,
});

export function NewStudentModal({ isOpen, onClose, onAdded }: { isOpen: boolean, onClose: () => void, onAdded?: () => void }) {
  const { toast } = useToast();
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOcrScanner, setShowOcrScanner] = useState(false);
  const [availableClasses, setAvailableClasses] = useState<{ id: string; name: string; academicLevel?: string; grade?: string; roomName?: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<StudentFormData>({
    studentNumber: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthCertificate: null,
    vaccineCard: null,
    proofOfAddress: null,
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentPhone: "",
    parentPassword: "",
    parentConfirmPassword: "",
    guardianFirstName: "",
    guardianLastName: "",
    guardianEmail: "",
    guardianPhone: "",
    guardianRelationship: "",
    guardianPassword: "",
    guardianConfirmPassword: "",
    cycle: "",
    course: "",
    class: "",
    classe: "",
    previousCertificate: null,
    grade9Certificate: null,
    transferRequest: null,
    previousSchool: "",
    previousClass: "",
  });

  const handleApplyBiData = (biData: ExtractedBiData) => {
    const parentFirst = biData.fatherName.split(" ")[0] || "";
    const parentLast = biData.fatherName.split(" ").slice(1).join(" ") || "";
    const guardianFirst = biData.motherName.split(" ")[0] || "";
    const guardianLast = biData.motherName.split(" ").slice(1).join(" ") || "";

    setFormData((prev) => ({
      ...prev,
      firstName: biData.firstName,
      lastName: biData.lastName,
      dateOfBirth: biData.dateOfBirth,
      gender: biData.gender === "M" ? "Masculino" : "Feminino",
      parentFirstName: parentFirst,
      parentLastName: parentLast,
      guardianFirstName: guardianFirst,
      guardianLastName: guardianLast,
    }));

    setShowOcrScanner(false);
    toast({
      title: "⚡ BI Reconhecido com Sucesso!",
      description: `Campos preenchidos automaticamente para ${biData.fullName}.`,
    });
  };

  useEffect(() => {
    if (isOpen) {
      const fetchClasses = async () => {
        try {
          const response = await axiosInstance.get('/classes');
          setAvailableClasses(response.data);
        } catch (error) {
          console.error("Failed to fetch classes", error);
        }
      };
      fetchClasses();
    }
  }, [isOpen]);

  const generateStudentNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    setFormData((prev) => ({ ...prev, studentNumber: `${year}${random}` }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axiosInstance.post('/users/student', {
        name: `${formData.firstName} ${formData.lastName}`,
        studentNumber: formData.studentNumber || undefined,
        email: formData.email || `student${formData.studentNumber}@school.com`,
        password: formData.password || "DefaultPassword123!",
        phone: formData.phone,
        classId: formData.class,
        parentName: formData.parentFirstName ? `${formData.parentFirstName} ${formData.parentLastName}`.trim() : undefined,
        parentEmail: formData.parentEmail || undefined,
        parentPhone: formData.parentPhone || undefined,
        parentPassword: formData.parentPassword || undefined,
      });

      if (onAdded) {
        onAdded();
      }
      toast({ title: 'Sucesso', description: "Aluno registrado com sucesso!" });
      resetForm();
    } catch (error) {
      console.error("Failed to register student", error);
      toast({ title: 'Erro', description: "Erro ao registrar aluno. Verifique os dados e tente novamente.", variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    onClose();
    setSelectedLevel(null);
    setCurrentStep(1);
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowOcrScanner(false);
    setFormData({
      studentNumber: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      birthCertificate: null,
      vaccineCard: null,
      proofOfAddress: null,
      parentFirstName: "",
      parentLastName: "",
      parentEmail: "",
      parentPhone: "",
      parentPassword: "",
      parentConfirmPassword: "",
      guardianFirstName: "",
      guardianLastName: "",
      guardianEmail: "",
      guardianPhone: "",
      guardianRelationship: "",
      guardianPassword: "",
      guardianConfirmPassword: "",
      cycle: "",
      course: "",
      class: "",
      classe: "",
      previousCertificate: null,
      grade9Certificate: null,
      transferRequest: null,
      previousSchool: "",
      previousClass: "",
    });
  };

  const getTotalSteps = () => {
    if (selectedLevel === "1-6") return 3;
    if (selectedLevel === "7-9") return 3;
    if (selectedLevel === "10-13") return 4;
    if (selectedLevel === "transfer") return 4;
    return 1;
  };

  const renderLevelSelection = () => (
    <div className="space-y-4">
      <p className="text-muted-foreground mb-6">
        Selecione o nível acadêmico do aluno para continuar:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            level: "1-6" as AcademicLevel,
            title: "Classes 1-6",
            description: "Ensino Primário",
            icon: "📚",
          },
          {
            level: "7-9" as AcademicLevel,
            title: "Classes 7-9",
            description: "Ensino Secundário I",
            icon: "📖",
          },
          {
            level: "10-13" as AcademicLevel,
            title: "Classes 10-13",
            description: "Ensino Secundário II",
            icon: "🎓",
          },
          {
            level: "transfer" as AcademicLevel,
            title: "Transferência",
            description: "Aluno por Transferência",
            icon: "🔄",
          },
        ].map((option) => (
          <button
            key={option.level}
            onClick={() => {
              setSelectedLevel(option.level);
              setCurrentStep(2);
            }}
            className="p-6 border border-border rounded-sm hover:border-primary hover:bg-popover hover:shadow-[0_0_12px_rgba(139, 92, 246,0.1)] transition-all duration-200 text-left"
          >
            <div className="text-3xl mb-2">{option.icon}</div>
            <h3 className="font-semibold text-foreground text-lg">
              {option.title}
            </h3>
            <p className="text-sm text-muted-foreground">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStudentInfo = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          Informações do Aluno
        </h3>
        <Button
          type="button"
          onClick={() => setShowOcrScanner(!showOcrScanner)}
          className="bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 font-bold text-xs h-8 px-3 rounded flex items-center gap-1.5 cursor-pointer transition-all w-fit"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>⚡ Preencher com BI (OCR Express)</span>
        </Button>
      </div>

      {showOcrScanner && (
        <div className="mb-4">
          <BiDocumentScanner
            onDataExtracted={handleApplyBiData}
            onClose={() => setShowOcrScanner(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Número de Estudante
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.studentNumber}
              readOnly
              className="flex-1 bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2 bg-muted"
            />
            <Button
              type="button"
              onClick={generateStudentNumber}
              className="bg-primary text-primary-foreground border-none rounded-sm hover:bg-[#A78BFA] hover:shadow-[0_0_12px_rgba(139, 92, 246,0.4)] text-white hover:bg-primary text-primary-foreground border-none rounded-sm hover:bg-[#A78BFA] hover:shadow-[0_0_12px_rgba(139, 92, 246,0.4)] hover:text-white"
            >
              Gerar
            </Button>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Primeiro Nome *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
            placeholder="João"
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1 pl-1">{errors.firstName}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Último Nome *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
            placeholder="Silva"
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1 pl-1">{errors.lastName}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Data de Nascimento *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
          />
          {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1 pl-1">{errors.dateOfBirth}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Género</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
          >
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
          </select>
          {errors.gender && <p className="text-red-500 text-xs mt-1 pl-1">{errors.gender}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
            placeholder="joao@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 pl-1">{errors.email}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Telefone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
            placeholder="+244 923 456 789"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1 pl-1">{errors.phone}</p>}
        </div>

        {selectedLevel === "transfer" && (
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-foreground">Ciclo</label>
            <select
              name="cycle"
              value={formData.cycle}
              onChange={handleInputChange}
              className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
            >
              <option value="">Selecione o Ciclo</option>
              <option value="1-6">Ensino Primário (1-6)</option>
              <option value="7-9">Ensino Secundário I (7-9)</option>
              <option value="10-13">Ensino Secundário II (10-13)</option>
            </select>
            {errors.cycle && <p className="text-red-500 text-xs mt-1 pl-1">{errors.cycle}</p>}
          </div>
        )}

        {(selectedLevel === "10-13" || (selectedLevel === "transfer" && formData.cycle === "10-13")) && (
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-foreground">Curso / Área de Formação</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
              placeholder="Curso/Especialidade"
            />
            {errors.course && <p className="text-red-500 text-xs mt-1 pl-1">{errors.course}</p>}
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Classe</label>
          <select
            name="classe"
            value={formData.classe || ""}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
          >
            <option value="">Selecione uma classe</option>
            {(() => {
              const level = selectedLevel === "transfer" ? formData.cycle : selectedLevel;
              if (level === "1-6") {
                return (
                  <>
                    <option value="1">1ª Classe</option>
                    <option value="2">2ª Classe</option>
                    <option value="3">3ª Classe</option>
                    <option value="4">4ª Classe</option>
                    <option value="5">5ª Classe</option>
                    <option value="6">6ª Classe</option>
                  </>
                );
              } else if (level === "7-9") {
                return (
                  <>
                    <option value="7">7ª Classe</option>
                    <option value="8">8ª Classe</option>
                    <option value="9">9ª Classe</option>
                  </>
                );
              } else if (level === "10-13") {
                return (
                  <>
                    <option value="10">10ª Classe</option>
                    <option value="11">11ª Classe</option>
                    <option value="12">12ª Classe</option>
                    <option value="13">13ª Classe</option>
                  </>
                );
              }
              return null;
            })()}
          </select>
          {errors.classe && <p className="text-red-500 text-xs mt-1 pl-1">{errors.classe}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Turma</label>
          <select
            name="class"
            value={formData.class}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
          >
            <option value="">Selecione uma turma</option>
            {availableClasses.filter(c => {
               const classLevel = c.academicLevel;
               if (selectedLevel === "transfer") {
                  return formData.cycle ? classLevel === formData.cycle : true;
               }
               return classLevel === selectedLevel;
            }).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - {c.roomName} - {c.grade || ''}
              </option>
            ))}
          </select>
          {errors.class && <p className="text-red-500 text-xs mt-1 pl-1">{errors.class}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Senha *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1 pl-1">{errors.password}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Confirmar Senha *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 pl-1">{errors.confirmPassword}</p>}
        </div>
      </div>
    </div>
  );

  const renderParentInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Informações dos Pais/Encarregados
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Primeiro Nome *
          </label>
          <input
            type="text"
            name="parentFirstName"
            value={formData.parentFirstName}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
            placeholder="Maria"
          />
          {errors.parentFirstName && <p className="text-red-500 text-xs mt-1 pl-1">{errors.parentFirstName}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Último Nome *
          </label>
          <input
            type="text"
            name="parentLastName"
            value={formData.parentLastName}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
            placeholder="Silva"
          />
          {errors.parentLastName && <p className="text-red-500 text-xs mt-1 pl-1">{errors.parentLastName}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            name="parentEmail"
            value={formData.parentEmail}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
            placeholder="maria@example.com"
          />
          {errors.parentEmail && <p className="text-red-500 text-xs mt-1 pl-1">{errors.parentEmail}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Telefone *
          </label>
          <input
            type="tel"
            name="parentPhone"
            value={formData.parentPhone}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
            placeholder="+244 923 456 789"
          />
          {errors.parentPhone && <p className="text-red-500 text-xs mt-1 pl-1">{errors.parentPhone}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Senha *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="parentPassword"
              value={formData.parentPassword}
              onChange={handleInputChange}
              className="w-full bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.parentPassword && <p className="text-red-500 text-xs mt-1 pl-1">{errors.parentPassword}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Confirmar Senha *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="parentConfirmPassword"
              value={formData.parentConfirmPassword}
              onChange={handleInputChange}
              className="w-full bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.parentConfirmPassword && <p className="text-red-500 text-xs mt-1 pl-1">{errors.parentConfirmPassword}</p>}
        </div>
      </div>
    </div>
  );

  const renderGuardianInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Informações do Encarregado
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Primeiro Nome *
          </label>
          <input
            type="text"
            name="guardianFirstName"
            value={formData.guardianFirstName}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
          />
          {errors.guardianFirstName && <p className="text-red-500 text-xs mt-1 pl-1">{errors.guardianFirstName}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Último Nome *
          </label>
          <input
            type="text"
            name="guardianLastName"
            value={formData.guardianLastName}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
          />
          {errors.guardianLastName && <p className="text-red-500 text-xs mt-1 pl-1">{errors.guardianLastName}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Relação com o Aluno *
          </label>
          <select
            name="guardianRelationship"
            value={formData.guardianRelationship}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
          >
            <option value="">Selecione</option>
            <option value="Pai">Pai</option>
            <option value="Mãe">Mãe</option>
            <option value="Avô">Avô</option>
            <option value="Avó">Avó</option>
            <option value="Tio">Tio</option>
            <option value="Tia">Tia</option>
            <option value="Outro">Outro</option>
          </select>
          {errors.guardianRelationship && <p className="text-red-500 text-xs mt-1 pl-1">{errors.guardianRelationship}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            name="guardianEmail"
            value={formData.guardianEmail}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
          />
          {errors.guardianEmail && <p className="text-red-500 text-xs mt-1 pl-1">{errors.guardianEmail}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Telefone *
          </label>
          <input
            type="tel"
            name="guardianPhone"
            value={formData.guardianPhone}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
          />
          {errors.guardianPhone && <p className="text-red-500 text-xs mt-1 pl-1">{errors.guardianPhone}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Senha *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="guardianPassword"
              value={formData.guardianPassword}
              onChange={handleInputChange}
              className="w-full bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.guardianPassword && <p className="text-red-500 text-xs mt-1 pl-1">{errors.guardianPassword}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Confirmar Senha *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="guardianConfirmPassword"
              value={formData.guardianConfirmPassword}
              onChange={handleInputChange}
              className="w-full bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.guardianConfirmPassword && <p className="text-red-500 text-xs mt-1 pl-1">{errors.guardianConfirmPassword}</p>}
        </div>
      </div>
    </div>
  );

  const renderPreviousCertificate = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Documentos Académicos
      </h3>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-foreground">
          Declaração ou Certificado das Classes Anteriores *
        </label>
        <label className="border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary transition-all text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {formData.previousCertificate
              ? formData.previousCertificate.name
              : "Clique para enviar o certificado"}
          </span>
          <input
            type="file"
            name="previousCertificate"
            onChange={handleFileChange}
            className="hidden"
          />
          {errors.previousCertificate && <p className="text-red-500 text-xs mt-1 pl-1">{errors.previousCertificate}</p>}
        </label>
      </div>
    </div>
  );

  const renderTransferInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Informações de Transferência
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Escola Anterior *
          </label>
          <input
            type="text"
            name="previousSchool"
            value={formData.previousSchool}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
            placeholder="Nome da escola anterior"
          />
          {errors.previousSchool && <p className="text-red-500 text-xs mt-1 pl-1">{errors.previousSchool}</p>}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Classe Anterior *
          </label>
          <input
            type="text"
            name="previousClass"
            value={formData.previousClass}
            onChange={handleInputChange}
            className="bg-input border border-border focus:border-secondary-foreground focus:ring-0 rounded-sm font-hanken text-sm text-foreground placeholder:text-muted-foreground transition-colors p-2"
            placeholder="Ex: 9ª Classe"
          />
          {errors.previousClass && <p className="text-red-500 text-xs mt-1 pl-1">{errors.previousClass}</p>}
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Pedido de Transferência *
          </label>
          <label className="border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary transition-all text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {formData.transferRequest
                ? formData.transferRequest.name
                : "Clique para enviar o pedido"}
            </span>
            <input
              type="file"
              name="transferRequest"
              onChange={handleFileChange}
              className="hidden"
            />
            {errors.transferRequest && <p className="text-red-500 text-xs mt-1 pl-1">{errors.transferRequest}</p>}
          </label>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Declaração da 9ª Classe (se aplicável)
          </label>
          <label className="border-2 border-dashed border-border rounded-xl p-6 cursor-pointer hover:border-primary transition-all text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {formData.grade9Certificate
                ? formData.grade9Certificate.name
                : "Clique para enviar (opcional)"}
            </span>
            <input
              type="file"
              name="grade9Certificate"
              onChange={handleFileChange}
              className="hidden"
            />
            {errors.grade9Certificate && <p className="text-red-500 text-xs mt-1 pl-1">{errors.grade9Certificate}</p>}
          </label>
        </div>
      </div>
    </div>
  );

  const renderFormStep = () => {
    if (currentStep === 1) return renderLevelSelection();
    if (currentStep === 2) return renderStudentInfo();

    if (selectedLevel === "1-6") {
      if (currentStep === 3) return renderParentInfo();
    } else if (selectedLevel === "7-9") {
      if (currentStep === 3) return renderPreviousCertificate();
    } else if (selectedLevel === "10-13") {
      if (currentStep === 3) return renderGuardianInfo();
      if (currentStep === 4) return renderPreviousCertificate();
    } else if (selectedLevel === "transfer") {
      if (currentStep === 3) return renderGuardianInfo();
      if (currentStep === 4) return renderTransferInfo();
    }

    return null;
  };

  const validateStep = (step: number) => {
    try {
      if (step === 2) {
        studentSchema.parse(formData);
      } else if (step === 3) {
        if (selectedLevel === "1-6") parentSchema.parse(formData);
        if (selectedLevel === "10-13" || selectedLevel === "transfer") guardianSchema.parse(formData);
      } else if (step === 4 && selectedLevel === "transfer") {
        transferSchema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < getTotalSteps()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
      }}
      title={
        selectedLevel === null
          ? "Selecionar Nível Acadêmico"
          : `Cadastro de Aluno - Passo ${currentStep} de ${getTotalSteps()}`
      }
      size="xl"
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        {selectedLevel !== null && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#d5c4ac] label-caps">
              <span>Progresso</span>
              <span className="data-mono">
                {currentStep} de {getTotalSteps()}
              </span>
            </div>
            <div className="w-full bg-[#1c1b1b] border border-[#414042] rounded h-2 overflow-hidden">
              <div
                className="bg-[#8B5CF6] h-2 transition-all duration-300 shadow-[0_0_8px_#8B5CF6]"
                style={{
                  width: `${(currentStep / getTotalSteps()) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Form Content */}
        <div>{renderFormStep()}</div>

        {/* Buttons */}
        <div className="flex justify-between gap-4 pt-4 border-t border-[#414042]">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="border-[#414042] text-[#e5e2e1] hover:border-[#C0C2C5] hover:bg-[#1c1b1b] rounded text-xs font-semibold h-10 px-4 cursor-pointer"
          >
            Anterior
          </Button>

          {currentStep === getTotalSteps() ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold rounded shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] gap-2 h-10 px-5 text-xs sm:text-sm cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Registrar Aluno
            </Button>
          ) : selectedLevel !== null ? (
            <Button
              onClick={handleNext}
              className="bg-[#8B5CF6] hover:bg-[#A78BFA] text-black font-bold rounded shadow-[0_0_10px_rgba(139, 92, 246,0.35)] hover:shadow-[0_0_14px_rgba(139, 92, 246,0.55)] gap-2 h-10 px-5 text-xs sm:text-sm cursor-pointer"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
