import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWithProfile } from '@/lib/auth/getUser'
import { formatarKz } from '@/lib/quota'
import type { Membro } from '@/types'

export default async function FinanceiroPage() {
  const { profile } = await getUserWithProfile()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    redirect('/admin/dashboard')
  }

  const supabase = await createClient()

  // Mês/ano atual
  const hoje = new Date()
  const mesAtual = hoje.getMonth() + 1
  const anoAtual = hoje.getFullYear()

  // Obter todos os membros
  const { data: membros } = await supabase
    .from('membros')
    .select('*')
    .order('nome', { ascending: true })

  // Obter quotas do mês atual
  const { data: quotasMes } = await supabase
    .from('quotas')
    .select('membro_id, pago, valor')
    .eq('mes', mesAtual)
    .eq('ano', anoAtual)

  // Mapear para consulta rápida
  const estadoPorMembro = new Map<
    string,
    { pago: boolean; valor: number }
  >()
  quotasMes?.forEach((q) => {
    estadoPorMembro.set(q.membro_id, { pago: q.pago, valor: q.valor })
  })

  // Estatísticas gerais do mês
  const totalMembros = membros?.length ?? 0
  const pagosEsteMes = quotasMes?.filter((q) => q.pago).length ?? 0
  const naoPagosEsteMes = totalMembros - pagosEsteMes
  const valorRecebido = quotasMes
    ?.filter((q) => q.pago)
    .reduce((acc, q) => acc + Number(q.valor), 0) ?? 0

  const MESES = [
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
  ]

  return (
    <div className="max-w-7xl mx-auto">
    
     

         {/* Cabeçalho */}
<div className="flex items-start justify-between mb-8">
  <div>
    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
      Gestão Financeira
    </h1>
    <p className="text-sm text-gray-500 mt-1">
      Controlo de quotas mensais dos membros · {MESES[mesAtual - 1]} de{' '}
      {anoAtual}
    </p>
  </div>

  {profile.role === 'superadmin' && (
    <Link
      href="/admin/financeiro/configuracoes"
      className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg border border-gray-200 transition-all duration-200 hover:border-blue-300 hover:text-blue-700"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      Configurações
    </Link>
  )}
</div>

      {/* Estatísticas do mês */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          titulo="Total de Membros"
          valor={totalMembros}
          cor="blue"
        />
        <StatCard
          titulo="Pagaram este mês"
          valor={pagosEsteMes}
          cor="green"
        />
        <StatCard
          titulo="Não pagaram"
          valor={naoPagosEsteMes}
          cor="red"
        />
        <StatCard
          titulo="Recebido este mês"
          valor={formatarKz(valorRecebido)}
          cor="blue"
          pequeno
        />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {!membros || membros.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-gray-500">
              Ainda não há membros registados.
            </p>
            <Link
              href="/admin/membros/novo"
              className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Adicionar primeiro membro
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Membro
                  </th>
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Estado ({MESES[mesAtual - 1]})
                  </th>
                  <th className="text-right px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {membros.map((membro: Membro) => {
                  const estado = estadoPorMembro.get(membro.id)
                  const pago = estado?.pago ?? false

                  return (
                    <tr
                      key={membro.id}
                      className="transition-colors duration-150 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {membro.foto_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={membro.foto_url}
                                alt={membro.nome}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-blue-600">
                                {membro.nome.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {membro.nome}
                            </p>
                            {membro.bi && (
                              <p className="text-xs text-gray-400 font-mono">
                                {membro.bi}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {membro.cargo || '—'}
                      </td>
                      <td className="px-6 py-4">
                        {pago ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Pago
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Não pago
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end">
                          <Link
                            href={`/admin/financeiro/${membro.id}`}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150"
                          >
                            Ver Ficha Financeira
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  titulo,
  valor,
  cor,
  pequeno = false,
}: {
  titulo: string
  valor: string | number
  cor: 'blue' | 'green' | 'red'
  pequeno?: boolean
}) {
  const cores = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    red: 'bg-red-50 text-red-700 border-red-100',
  }

  return (
    <div
      className={`rounded-xl border p-5 ${cores[cor]}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
        {titulo}
      </p>
      <p
        className={`font-bold mt-2 ${
          pequeno ? 'text-xl' : 'text-3xl'
        } tracking-tight`}
      >
        {valor}
      </p>
    </div>
  )
}