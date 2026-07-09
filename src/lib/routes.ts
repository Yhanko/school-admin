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
  Clock
} from "@/lib/icons";

export const routes = [
  {
    id: 1,
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    id: 2,
    title: "Estudantes",
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
    title: "Turmas",
    url: "/turma",
    icon: SiGoogleclassroom,
  },
  {
    id: 5,
    title: "Horários",
    url: "/schedules",
    icon: Clock,
  },
  {
    id: 6,
    title: "Eventos",
    url: "/events",
    icon: CalendarDays,
  },
  {
    id: 7,
    title: "Pagamentos",
    url: "/payments",
    icon: BsCashCoin,
  },
  {
    id: 8,
    title: "Chat",
    url: "/chat",
    icon:  MessagesSquare,
  },
  {
    id: 9,
    title: "Relatórios",
    url: "/report",
    icon: FaRegFileAlt,
  },
  {
    id: 10,
    title: "Regulamento",
    url: "/schoolRules",
    icon: PiFilesLight,
  },
  {
    id: 11,
    title: "Disciplinar",
    url: "/disciplinar",
    icon: BsExclamationCircle,
  },
  {
    id: 12,
    title: "Permissões",
    url: "/permission",
    icon: LuUserCog,
  },
  {
    id: 13,
    title: "Perfil",
    url: "/profile",
    icon: UserCircle,
  },
]