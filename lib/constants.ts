export const IGREJA = {
  nome: 'Paróquia de São Filipe',
  nomeCompleto: 'Igreja Evangélica Unida — Comunhão Anglicana em Angola',
  sigla: 'IEUCAA',
  slogan: 'Um lugar de fé, esperança e comunhão',  // placeholder — podes alterar depois
  localizacao: {
    provincia: 'Província do Uíge',
    bairro: 'Bairro Papelão',
    referencia: 'Rua direita da Rotunda do Songo até ao Aeroporto',
    pais: 'Angola',
  },
  contactos: {
    telefone: '+244 939 374 945',        // placeholder
    email: 'juventudesaofilipe@gmail.com',            // placeholder
  },
} as const

export const CULTOS = [
  { nome: 'Culto Dominical', dia: 'Domingo', inicio: '10h00', fim: '12h00' },
  { nome: 'Culto Dominical Infantil', dia: 'Domingo', inicio: '07h00', fim: '09h00' },
  { nome: 'Culto da Mulher Jovem', dia: 'Terça-feira', inicio: '07h00', fim: '09h00' },
  { nome: 'Culto de Edificação', dia: 'Sábado', inicio: '06h00', fim: '08h30' },
  { nome: 'Culto da Juventude', dia: 'Sábado', inicio: '15h00', fim: '17h00' },
] as const

export const CATEGORIAS_NOTICIA: Record<string, string> = {
  geral: 'Geral',
  eventos: 'Eventos',
  avisos: 'Avisos',
  testemunhos: 'Testemunhos',
  estudos: 'Estudos',
  jovens: 'Jovens',
}

// ============================================
// TIPOS SANGUÍNEOS
// ============================================

export const TIPOS_SANGUINEOS = [
  { valor: 'A+', label: 'A+' },
  { valor: 'A-', label: 'A-' },
  { valor: 'B+', label: 'B+' },
  { valor: 'B-', label: 'B-' },
  { valor: 'AB+', label: 'AB+' },
  { valor: 'AB-', label: 'AB-' },
  { valor: 'O+', label: 'O+' },
  { valor: 'O-', label: 'O-' },
  { valor: 'desconhecido', label: 'Desconhecido' },
] as const

// ============================================
// CARGOS MINISTERIAIS (sugestões para dropdown)
// ============================================

export const CARGOS_SUGERIDOS = [
  'Membro',
  'Diácono',
  'Diaconisa',
  'Presbítero',
  'Pastor',
  'Catequista',
  'Corista',
  'Secretário(a)',
  'Tesoureiro(a)',
  'Coordenador(a)',
  'Outro',
] as const

// ============================================
// VALIDAÇÃO DE BI
// Formato: 9 dígitos + 2 letras maiúsculas + 3 dígitos
// Exemplo: 000123456LA041
// ============================================

export const BI_REGEX = /^\d{9}[A-Z]{2}\d{3}$/