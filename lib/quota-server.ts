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