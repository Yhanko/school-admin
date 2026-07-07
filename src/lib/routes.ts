import { 
  Home, 
  HandCoins,  
  MessagesSquare, 
  CalendarDays, 
  UsersThree, 
  Student, 
  SuitcaseSimple, 
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
    title: "Eventos",
    url: "/events",
    icon: CalendarDays,
  },
  {
    id: 6,
    title: "Finanças",
    url: "/finance",
    icon: HandCoins,
  },
  {
    id: 7,
    title: "Pagamentos",
    url: "/payments",
    icon: BsCashCoin,
  },
  {
    id: 8,
    title: "Funcionários",
    url: "/employees",
    icon: SuitcaseSimple,
  },
  {
    id: 9,
    title: "Chat",
    url: "/chat",
    icon:  MessagesSquare,
  },
  {
    id: 10,
    title: "Perfil",
    url: "/profile",
    icon: UserCircle,
  },
  {
    id: 11,
    title: "Relatórios",
    url: "/report",
    icon: FaRegFileAlt,
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
  },
  {
    id: 15,
    title: "Horários",
    url: "/schedules",
    icon: Clock,
  }
]