// ============================================
// TIPOS DE AUTENTICAÇÃO E PERFIS
// ============================================

export type UserRole = 'member' | 'admin' | 'superadmin'

export interface Profile {
  id: string
  nome: string
  email: string
  telefone: string | null
  endereco: string | null
  data_nascimento: string | null
  data_batismo: string | null
  cargo: string | null
  foto_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

// ============================================
// TIPOS DE MEMBROS
// ============================================

export type TipoSanguineo =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'
  | 'desconhecido'

export interface Membro {
  id: string
  nome: string
  bi: string | null
  email: string | null
  telefone: string | null
  endereco: string | null
  data_nascimento: string | null
  data_batismo: string | null
  data_confirmacao: string | null
  data_inicio_quota: string | null 
  tipo_sanguineo: TipoSanguineo | null
  cargo: string | null
  foto_url: string | null
  created_at: string
  updated_at: string
}

// ============================================
// TIPOS DE NOTÍCIAS
// ============================================

export interface Noticia {
  id: string
  titulo: string
  conteudo: string
  imagem_url: string | null
  categoria: string
  autor_id: string | null
  autor_nome: string | null
  data_publicacao: string
  created_at: string
  updated_at: string
}

// ============================================
// TIPOS AUXILIARES
// ============================================

export interface AuthUser {
  id: string
  email: string
  profile: Profile | null
}

// ============================================
// TIPOS FINANCEIROS
// ============================================

export interface Quota {
  id: string
  membro_id: string
  mes: number // 1-12
  ano: number
  valor: number
  pago: boolean
  data_pagamento: string | null
  registado_por: string | null
  created_at: string
  updated_at: string
}

export interface Configuracao {
  chave: string
  valor: string
  descricao: string | null
  updated_at: string
}

// ============================================
// QUOTA COM DADOS DO MEMBRO (para relatórios)
// ============================================

export interface QuotaComMembro extends Quota {
  membro: {
    nome: string
    bi: string | null
    cargo: string | null
    foto_url: string | null
  }
}

// ============================================
// NOMES DOS MESES
// ============================================

export const NOMES_MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const

export const NOMES_MESES_CURTOS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
] as const