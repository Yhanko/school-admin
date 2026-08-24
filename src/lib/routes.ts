import { 
  Home, 
  MessagesSquare, 
  CalendarDays,  
  Student,  
  University, 
  UserCircle,
  SiGoogleclassroom,
  FaRegFileAlt,
  PiFilesLight,
  LuUserCog,
  BsExclamationCircle,
  BsCashCoin,
  Clock,
  Award,
  FileCheck,
  Sparkles,
} from "@/lib/icons";

export interface AppRoute {
  id: number;
  title: string;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  directorOnly?: boolean;
}

export const routes: AppRoute[] = [
  {
    id: 1,
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    id: 2,
    title: "Alunos",
    url: "/student",
    icon: Student,
  },
  {
    id: 3,
    title: "Area pedagógica",
    url: "/pedagogical",
    icon: University,
  },
  {
    id: 4,
    title: "Pautas & Avaliações",
    url: "/pautas",
    icon: Award,
  },
  {
    id: 5,
    title: "Radar de Risco (IA)",
    url: "/radar",
    icon: Sparkles,
  },
  {
    id: 6,
    title: "Turmas",
    url: "/turma",
    icon: SiGoogleclassroom,
  },
  {
    id: 16,
    title: "Horários",
    url: "/schedules",
    icon: Clock,
  },
  {
    id: 7,
    title: "Documentos & QR Code",
    url: "/documents",
    icon: FileCheck,
  },
  {
    id: 8,
    title: "Pagamentos",
    url: "/payments",
    icon: BsCashCoin,
  },
  {
    id: 9,
    title: "Eventos",
    url: "/events",
    icon: CalendarDays,
  },
  {
    id: 10,
    title: "Chat",
    url: "/chat",
    icon: MessagesSquare,
  },
  {
    id: 11,
    title: "Relatórios",
    url: "/report",
    icon: FaRegFileAlt,
  },
  {
    id: 17,
    title: "Envio de SMS",
    url: "/sms",
    icon: MessagesSquare, // Or another icon, like Smartphone
  },
  {
    id: 12,
    title: "Regulamento",
    url: "/schoolRules",
    icon: PiFilesLight,
  },
  {
    id: 13,
    title: "Disciplinar",
    url: "/disciplinar",
    icon: BsExclamationCircle,
  },
  {
    id: 14,
    title: "Permissões",
    url: "/permission",
    icon: LuUserCog,
    directorOnly: true,
  },
  {
    id: 15,
    title: "Perfil",
    url: "/profile",
    icon: UserCircle,
  },
  {
    id: 18,
    title: "Suporte (Tickets)",
    url: "/support",
    icon: MessagesSquare, // or another appropriate icon
  },
];