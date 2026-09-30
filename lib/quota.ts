// ⚠️ Este ficheiro NÃO pode importar nada do servidor
// (sem Supabase, sem next/headers)

/**
 * Calcula o resumo financeiro de uma lista de quotas
 */
export function calcularResumoQuotas(
  quotas: { pago: boolean; valor: number }[]
) {
  const total = quotas.length
  const pagas = quotas.filter((q) => q.pago).length
  const naoPagas = total - pagas
  const valorPago = quotas
    .filter((q) => q.pago)
    .reduce((acc, q) => acc + Number(q.valor), 0)
  const valorTotal = quotas.reduce((acc, q) => acc + Number(q.valor), 0)
  const valorEmFalta = valorTotal - valorPago

  return {
    total,
    pagas,
    naoPagas,
    valorPago,
    valorTotal,
    valorEmFalta,
    percentagemPago: total > 0 ? Math.round((pagas / total) * 100) : 0,
  }
}

/**
 * Formata valor em Kwanzas
 */
export function formatarKz(valor: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor)
}