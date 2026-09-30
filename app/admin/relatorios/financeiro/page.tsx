import Link from 'next/link'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWithProfile } from '@/lib/auth/getUser'
import FiltrosRelatorioFinanceiro from '@/components/relatorios/FiltrosRelatorioFinanceiro'
import TabelaRelatorioFinanceiro from '@/components/relatorios/TabelaRelatorioFinanceiro'
import BotaoExportarRelatorioFinanceiro from '@/components/relatorios/BotaoExportarRelatorioFinanceiro'

interface Props {
  searchParams: Promise<{
    nome?: string
    cargo?: string
    ano?: string
    estado?: string
  }>
}

export default async function RelatorioFinanceiroPage({ searchParams }: Props) {
  const { profile } = await getUserWithProfile()

  // ⚠️ APENAS superadmin
  if (!profile || profile.role !== 'superadmin') {
    redirect('/admin/dashboard')
  }

  const filtros = await searchParams
  const supabase = await createClient()

  // Obter todos os membros
  let queryMembros = supabase
    .from('membros')
    .select('id, nome, bi, cargo, foto_url')
    .order('nome', { ascending: true })

  if (filtros.nome) {
    queryMembros = queryMembros.ilike('nome', `%${filtros.nome}%`)
  }
  if (filtros.cargo) {
    queryMembros = queryMembros.eq('cargo', filtros.cargo)
  }

  const { data: membros } = await queryMembros

  // Obter quotas (com filtro de ano se aplicável)
  let queryQuotas = supabase
    .from('quotas')
    .select('membro_id, mes, ano, valor, pago')

  if (filtros.ano) {
    queryQuotas = queryQuotas.eq('ano', Number(filtros.ano))
  }

  const { data: quotas } = await queryQuotas

  // Anos disponíveis (para filtro)
  const { data: todosAnos } = await supabase
    .from('quotas')
    .select('ano')
    .order('ano', { ascending: false })

  const anosDisponiveis = Array.from(
    new Set(todosAnos?.map((q) => q.ano) ?? [])
  ).sort((a, b) => b - a)

  // Agrupar quotas por membro
  const quotasPorMembro = new Map<
    string,
    { pago: boolean; valor: number }[]
  >()

  quotas?.forEach((q) => {
    if (!quotasPorMembro.has(q.membro_id)) {
      quotasPorMembro.set(q.membro_id, [])
    }
    quotasPorMembro.get(q.membro_id)!.push({
      pago: q.pago,
      valor: Number(q.valor),
    })
  })

  // Calcular linha para cada membro
  let linhas = (membros ?? []).map((m) => {
    const quotasM = quotasPorMembro.get(m.id) ?? []
    const totalQuotas = quotasM.length
    const quotasPagas = quotasM.filter((q) => q.pago).length
    const quotasNaoPagas = totalQuotas - quotasPagas
    const valorPago = quotasM
      .filter((q) => q.pago)
      .reduce((acc, q) => acc + q.valor, 0)
    const valorTotal = quotasM.reduce((acc, q) => acc + q.valor, 0)
    const valorEmFalta = valorTotal - valorPago
    const percentagem =
      totalQuotas > 0 ? Math.round((quotasPagas / totalQuotas) * 100) : 0

    return {
      membro: m,
      totalQuotas,
      quotasPagas,
      quotasNaoPagas,
      valorPago,
      valorEmFalta,
      percentagem,
    }
  })

  // Filtro por estado (aplicar após cálculo)
  if (filtros.estado === 'em_dia') {
    linhas = linhas.filter((l) => l.percentagem === 100)
  } else if (filtros.estado === 'com_divida') {
    linhas = linhas.filter((l) => l.percentagem < 100)
  }

  // Resumo geral
  const totalRecebido = linhas.reduce((acc, l) => acc + l.valorPago, 0)
  const totalEmFalta = linhas.reduce((acc, l) => acc + l.valorEmFalta, 0)
  const totalQuotasPagas = linhas.reduce((acc, l) => acc + l.quotasPagas, 0)
  const totalQuotas = linhas.reduce((acc, l) => acc + l.totalQuotas, 0)
  const taxaAdesao =
    totalQuotas > 0 ? Math.round((totalQuotasPagas / totalQuotas) * 100) : 0

  const resumoGeral = {
    totalMembros: linhas.length,
    totalRecebido,
    totalEmFalta,
    taxaAdesao,
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Toolbar */}
      <div className="mb-6 print:hidden">
        <Link
          href="/admin/relatorios"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-150 mb-4"
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
          Voltar aos relatórios
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Relatório Financeiro Consolidado
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Análise de quotas por membro · apenas superadministrador
            </p>
          </div>

          <BotaoExportarRelatorioFinanceiro totalLinhas={linhas.length} />
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <Suspense
          fallback={
            <div className="h-32 bg-white rounded-xl border border-gray-100" />
          }
        >
          <FiltrosRelatorioFinanceiro anosDisponiveis={anosDisponiveis} />
        </Suspense>
      </div>

      {/* Pré-visualização */}
      <TabelaRelatorioFinanceiro
        linhas={linhas}
        resumoGeral={resumoGeral}
        filtrosAtivos={filtros}
      />
    </div>
  )
}