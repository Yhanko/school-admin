import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "./modal";
import {
  Plus,
  User,
  FileText,
  Upload,
  Check,
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff
} from "@/lib/icons";
import axiosInstance from "@/service/api";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AcademicLevel = "1-6" | "7-9" | "10-13" | "transfer" | null;

interface StudentFormData {
  // Student Info
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

export function NewStudentModal({ isOpen, onClose, onAdded }: { isOpen: boolean, onClose: () => void, onAdded?: () => void }) {
  const { toast } = useToast();
  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
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

  const [submittedStudents, setSubmittedStudents] = useState<
    Array<{ id: string; name: string; level: string; date: string }>
  >([]);

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
    setFormData({ ...formData, studentNumber: `${year}${random}` });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/users/student', {
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
    setShowPassword(false);
    setShowConfirmPassword(false);
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
            className="p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-muted transition-all duration-200 text-left"
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
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Informações do Aluno
      </h3>

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
              className="flex-1 border border-border rounded-lg p-2 bg-muted"
            />
            <Button
              onClick={generateStudentNumber}
              className="bg-[#5856eb] text-white hover:bg-[#5856eb] hover:text-white"
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
            className="border border-border rounded-lg p-2"
            placeholder="João"
          />
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
            className="border border-border rounded-lg p-2"
            placeholder="Silva"
          />
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
            className="border border-border rounded-lg p-2"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Género</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="border border-border rounded-lg p-2"
          >
            <option value="">Selecione</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border border-border rounded-lg p-2"
            placeholder="joao@example.com"
          />
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
            className="border border-border rounded-lg p-2"
            placeholder="+244 923 456 789"
          />
        </div>


        {selectedLevel === "transfer" && (
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-foreground">Ciclo</label>
            <select
              name="cycle"
              value={formData.cycle}
              onChange={handleInputChange}
              className="border border-border rounded-lg p-2"
            >
              <option value="">Selecione o Ciclo</option>
              <option value="1-6">Ensino Primário (1-6)</option>
              <option value="7-9">Ensino Secundário I (7-9)</option>
              <option value="10-13">Ensino Secundário II (10-13)</option>
            </select>
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
              className="border border-border rounded-lg p-2"
              placeholder="Curso/Especialidade"
            />
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Classe</label>
          <select
            name="classe"
            value={(formData as any).classe || ""}
            onChange={handleInputChange}
            className="border border-border rounded-lg p-2"
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
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Turma</label>
          <select
            name="class"
            value={formData.class}
            onChange={handleInputChange}
            className="border border-border rounded-lg p-2"
          >
            <option value="">Selecione uma turma</option>
            {availableClasses.filter(c => {
               const classLevel = c.academicLevel; // Use DB academicLevel property
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
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Senha *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Confirmar Senha *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
            className="border border-border rounded-lg p-2"
            placeholder="Maria"
          />
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
            className="border border-border rounded-lg p-2"
            placeholder="Silva"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            name="parentEmail"
            value={formData.parentEmail}
            onChange={handleInputChange}
            className="border border-border rounded-lg p-2"
            placeholder="maria@example.com"
          />
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
            className="border border-border rounded-lg p-2"
            placeholder="+244 923 456 789"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Senha *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="parentPassword"
              value={formData.parentPassword}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Confirmar Senha *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="parentConfirmPassword"
              value={formData.parentConfirmPassword}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
            className="border border-border rounded-lg p-2"
          />
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
            className="border border-border rounded-lg p-2"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Relação com o Aluno *
          </label>
          <select
            name="guardianRelationship"
            value={formData.guardianRelationship}
            onChange={handleInputChange}
            className="border border-border rounded-lg p-2"
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
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            name="guardianEmail"
            value={formData.guardianEmail}
            onChange={handleInputChange}
            className="border border-border rounded-lg p-2"
          />
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
            className="border border-border rounded-lg p-2"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Senha *</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="guardianPassword"
              value={formData.guardianPassword}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">Confirmar Senha *</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="guardianConfirmPassword"
              value={formData.guardianConfirmPassword}
              onChange={handleInputChange}
              className="w-full border border-border rounded-lg p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
        <label className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-all text-center">
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
            className="border border-border rounded-lg p-2"
            placeholder="Nome da escola anterior"
          />
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
            className="border border-border rounded-lg p-2"
            placeholder="Ex: 9ª Classe"
          />
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Pedido de Transferência *
          </label>
          <label className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-all text-center">
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
          </label>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-foreground">
            Declaração da 9ª Classe (se aplicável)
          </label>
          <label className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-all text-center">
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

  const handleNext = () => {
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
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progresso</span>
                <span>
                  {currentStep} de {getTotalSteps()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-[#5856eb] h-2 rounded-full transition-all duration-300"
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
          <div className="flex justify-between gap-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="bg-blue-600 text-white rounded-full hover:bg-blue-500 hover:text-white hover:cursor-pointer"
            >
              Anterior
            </Button>

            {currentStep === getTotalSteps() ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 gap-2 hover:cursor-pointer rounded-full"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Registrar Aluno
              </Button>
            ) : selectedLevel !== null ? (
              <Button onClick={handleNext} className="gap-2 bg-green-600 hover:bg-green-700 hover:cursor-pointer rounded-full">
                Próximo
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </Modal>
  );
}
