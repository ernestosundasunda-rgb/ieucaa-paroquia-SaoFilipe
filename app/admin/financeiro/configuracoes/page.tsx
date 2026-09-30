import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWithProfile } from '@/lib/auth/getUser'
import ConfiguracoesForm from '@/components/financeiro/ConfiguracoesForm'
import { formatarData } from '@/lib/utils'
import { formatarKz } from '@/lib/quota'

export default async function ConfiguracoesFinanceiroPage() {
  const { profile } = await getUserWithProfile()

  // ⚠️ APENAS superadmin
  if (!profile || profile.role !== 'superadmin') {
    redirect('/admin/financeiro')
  }

  const supabase = await createClient()

  // Valor atual da quota
  const { data: config } = await supabase
    .from('configuracoes')
    .select('*')
    .eq('chave', 'valor_quota')
    .single()

  const valorAtual = config?.valor ?? '200'
  const atualizadoEm = config?.updated_at ?? null

  // Total de membros
  const { count: totalMembros } = await supabase
    .from('membros')
    .select('*', { count: 'exact', head: true })

  // Total de quotas pagas
  const { data: quotasPagas } = await supabase
    .from('quotas')
    .select('valor')
    .eq('pago', true)

  const totalRecebido =
    quotasPagas?.reduce((acc, q) => acc + Number(q.valor), 0) ?? 0

  return (
    <div className="max-w-3xl mx-auto">
      {/* Toolbar */}
      <div className="mb-6">
        <Link
          href="/admin/financeiro"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-150"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar ao financeiro
        </Link>
      </div>

      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Configurações Financeiras
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Apenas o superadministrador pode alterar estas configurações
        </p>
      </div>

      {/* Aviso superadmin */}
      <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              Área Restrita
            </h3>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
              Estas configurações afetam o sistema financeiro de toda a juventude
              paróquial. Todas as alterações ficam registadas.
            </p>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Valor Atual
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">
            {formatarKz(Number(valorAtual))}
          </p>
          {atualizadoEm && (
            <p className="text-[10px] text-gray-400 mt-1">
              Atualizado em {formatarData(atualizadoEm)}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total de Membros
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1.5 tracking-tight">
            {totalMembros ?? 0}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            Receita mensal esperada:{' '}
            {formatarKz(Number(valorAtual) * (totalMembros ?? 0))}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Total Recebido
          </p>
          <p className="text-2xl font-bold text-blue-700 mt-1.5 tracking-tight">
            {formatarKz(totalRecebido)}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            Todas as quotas pagas
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-xl border border-gray-100 p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Valor da Quota
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Define o valor mensal que cada membro deve contribuir
          </p>
        </div>

        <ConfiguracoesForm
          valorAtual={valorAtual}
          totalMembros={totalMembros ?? 0}
        />
      </div>
    </div>
  )
}