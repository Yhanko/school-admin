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
    title: "Associação",
    url: "/association",
    icon: UsersThree,
  },
  {
    id: 5,
    title: "Turmas",
    url: "/turma",
    icon: SiGoogleclassroom,
  },
  {
    id: 6,
    title: "Eventos",
    url: "/events",
    icon: CalendarDays,
  },
  {
    id: 7,
    title: "Finanças",
    url: "/finance",
    icon: HandCoins,
  },
  {
    id: 8,
    title: "Pagamentos",
    url: "/payments",
    icon: BsCashCoin,
  },
  {
    id: 9,
    title: "Funcionários",
    url: "/employees",
    icon: SuitcaseSimple,
  },
  {
    id: 10,
    title: "Chat",
    url: "/chat",
    icon:  MessagesSquare,
  },
  {
    id: 11,
    title: "Perfil",
    url: "/profile",
    icon: UserCircle,
  },
  {
    id: 12,
    title: "Relatórios",
    url: "/report",
    icon: FaRegFileAlt,
  },
  {
    id: 13,
    title: "Regulamento",
    url: "/schoolRules",
    icon: PiFilesLight,
  },
  {
    id: 14,
    title: "Disciplinar",
    url: "/disciplinar",
    icon: BsExclamationCircle,
  },
  {
    id: 15,
    title: "Permissões",
    url: "/permission",
    icon: LuUserCog,
  },
  {
    id: 16,
    title: "Horários",
    url: "/schedules",
    icon: Clock,
  }
]