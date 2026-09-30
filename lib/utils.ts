/**
 * Calcula a idade a partir de uma data de nascimento
 */
export function calcularIdade(dataNascimento: string | null): number | null {
  if (!dataNascimento) return null

  const nascimento = new Date(dataNascimento)
  if (isNaN(nascimento.getTime())) return null

  const hoje = new Date()
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mes = hoje.getMonth() - nascimento.getMonth()

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }

  return idade
}

/**
 * Formata uma data ISO para o formato português (DD/MM/AAAA)
 */
export function formatarData(data: string | null): string {
  if (!data) return '—'

  const d = new Date(data)
  if (isNaN(d.getTime())) return '—'

  return d.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Formata uma data ISO para o formato longo (DD de Mês de AAAA)
 */
export function formatarDataLonga(data: string | null): string {
  if (!data) return '—'

  const d = new Date(data)
  if (isNaN(d.getTime())) return '—'

  return d.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Gera um nome de ficheiro seguro (sem acentos, espaços, etc.)
 */
export function gerarNomeFicheiro(
  prefixo: string,
  nome: string
): string {
  const nomeLimpo = nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-zA-Z0-9]/g, '-') // Substitui símbolos por hífen
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, '') // Remove hífens no início/fim
    .toUpperCase()

  return `${prefixo}-${nomeLimpo}.pdf`
}

/**
 * Gera timestamp formatado para nomes de ficheiro
 * Ex: 2026-09-28-1430
 */
export function gerarTimestamp(): string {
  const d = new Date()
  const ano = d.getFullYear()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  const hora = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')

  return `${ano}-${mes}-${dia}-${hora}${min}`
}