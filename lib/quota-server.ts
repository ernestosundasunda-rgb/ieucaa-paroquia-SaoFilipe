import { createClient } from '@/lib/supabase/server'

/**
 * Obtém o valor atual da quota (server-side)
 */
export async function obterValorQuota(): Promise<number> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('configuracoes')
    .select('valor')
    .eq('chave', 'valor_quota')
    .single()

  const valor = Number(data?.valor ?? 200)
  return isNaN(valor) ? 200 : valor
}

/**
 * Garante que existem quotas para todos os meses do ano atual
 * até ao mês atual (inclusive). Cria as que faltarem.
 */
export async function garantirQuotasDoAno(membroId: string): Promise<void> {
  const supabase = await createClient()

  const hoje = new Date()
  const mesAtual = hoje.getMonth() + 1
  const anoAtual = hoje.getFullYear()

  // Valor atual da quota
  const valor = await obterValorQuota()

  // Buscar quotas existentes do ano atual
  const { data: existentes } = await supabase
    .from('quotas')
    .select('mes')
    .eq('membro_id', membroId)
    .eq('ano', anoAtual)

  const mesesExistentes = new Set(existentes?.map((q) => q.mes) ?? [])

  // Gerar lista de quotas em falta (do mês 1 até ao mês atual)
  const quotasFaltantes: {
    membro_id: string
    mes: number
    ano: number
    valor: number
    pago: boolean
  }[] = []

  for (let mes = 1; mes <= mesAtual; mes++) {
    if (!mesesExistentes.has(mes)) {
      quotasFaltantes.push({
        membro_id: membroId,
        mes,
        ano: anoAtual,
        valor,
        pago: false,
      })
    }
  }

  // Inserir quotas em falta
  if (quotasFaltantes.length > 0) {
    await supabase.from('quotas').insert(quotasFaltantes)
  }
}