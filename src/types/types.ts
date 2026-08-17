///Tipagens de acordo com os dados da API

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RelatorioProps = any;
export type AccountPeriodType = any;
export type webHookDataType = any;
export type webHookAPILog = any;
export type Paymentos = any;
export type TableTypeProps = any;
export type TableReportTypeProps = any;
export type ReferencePayments = any;
/* eslint-enable @typescript-eslint/no-explicit-any */
// Define a interface para uma notificação
export type Notification = {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
}

export type UserDataType = {
  id: number,
  email: string,
  contacto: string,
  cadastrado_em: string,
  ultimo_login: string,
  nome_empresa: string,
  logo: string,
  nif: string,
  arquivo_do_contrato: string
}

export type UserAfiliadoTypes = {
    id_afiliado: number;
    nome_afiliado: string;
    email_afiliado: string;
    user_name: string;
    gerado_em_: string;
    actualizado_em_: string;
    ultimo_login_afiliado: string;
    nome_empresa: string;
    nome_identificacao: string;
}


export type RemetenteType = {
  id_envio_rementente: number;
  id_api_rementente: string;
  nome_rementente: string;
  estado_remetente: string;
  criado_remetente: string; 
  campo_envio: string;
  entidade_remetente: string;
};

export type RemetenteSms = {
  id_envio: number;
  tipo_envio: string;
  id_envio_rementente_entidade: number;
  mensagem_envio: string;
  custo_envio: number;
  hora_envio: string; 
  id_envio_rementente: number;
  id_api_rementente: string;
  nome_rementente: string;
  estado_remetente: string;
  criado_remetente: string;
  campo_envio: string; 
  entidade_remetente: string;
};

export type Afiliado = {
  id_afiliado: number;
  activacao: boolean;
  nome_afiliado: string;
  email_afiliado: string;
  user_name: string;
  gerado_em_:string;
  actualizado_em_: string;
  nome_empresa: string;
  numero_entidade: string;
  entidade_tipo: string;
  nome_identificacao: string;
};

export type IdentificadoProps ={
  id_identificacao_afiliados: string,
  nome_identificacao: string,
}

export type PermitionsProps = {
  afiliado: number,
  permissoes_afiliados: number,
  pagina_referencia: string;
  pagina_pagamento: string,
  pagina_contabilistico: string,
  pagina_relatorio: string,
  pagina_pagamentos_online: string,
  pagina_relatorios_online:string,
  pagina_servico_api: string,
  pagina_faq: string,
  pagina_afiliado: string,
  pagina_sms: string,
  pagina_token: string,
  pagina_webwook: string,
  pagina_notificacao: string,
  pagina_perfil: string,
  pagina_sair: string,
}

export type AfliadosGroupProps = {
  nome_empresa: string,
  numero_entidade: string,
  entidade_tipo: string,
  id_identificacao_afiliados: number,
  nome_identificacao: string,
  gerado_ident_em: string
}

export type AfiliatesIdentificadosPorps = {
  id_afiliado: number,
  activacao: string,
  nome_afiliado: string,
  email_afiliado: string,
  user_name: string,
  gerado_em_: string,
  actualizado_em_: string,
  nome_empresa: string,
  numero_entidade: string,
  entidade_tipo: string,
  nome_identificacao: string
}

export type StudentStatus = 'ativo' | 'inativo' | 'suspenso' | 'transferido';

export interface Subject {
  id: string;
  name: string;
  grade: number;
  professor: string;
}

export interface Payment {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'pago' | 'pendente' | 'atrasado';
}

export interface Guardian {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Classroom {
  number: string;
  floor: string;
  capacity: number;
}

export interface Student {
  id: string;
  fullName: string;
  studentNumber: string;
  academicYear: string;
  class: string;
  course: string;
  classGroup: string;
  status: StudentStatus;
  subjects: Subject[];
  payments: Payment[];
  teachers: string[];
  guardian: Guardian;
  classroom: Classroom;
  enrollmentDate: string;
  dateOfBirth?: string;
  photoUrl?: string;
}
export interface Activity {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: "event" | "activity" | "meeting" | "holiday";
  organizer: string;
  location?: string;
  participants?: number;
}


export interface Class {
  id: string;
  name: string;
  level: number;
  created_at: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  class_id?: string;
  created_at: string;
}

export interface TuitionFee {
  id: string;
  class_id: string;
  amount: number;
  enrollment_fee: number;
  activity_fee: number;
  valid_from: string;
  created_at: string;
}

export type PaymentType = 'enrollment' | 'tuition' | 'activity';
export type PaymentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface PaymentRecord {
  id: string;
  student_id: string;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  payment_date?: string;
  confirmed_by?: string;
  notes?: string;
  created_at: string;
}

export interface Receipt {
  id: string;
  payment_id: string;
  receipt_number: string;
  issued_date: string;
  issued_by: string;
  student_name: string;
  amount: number;
  description: string;
}

export interface PaymentWithStudent extends PaymentRecord {
  students: StudentRecord | null;
}

export interface CashFlowSummary {
  total_confirmed: number;
  total_pending: number;
  enrollment_total: number;
  tuition_total: number;
  activity_total: number;
}