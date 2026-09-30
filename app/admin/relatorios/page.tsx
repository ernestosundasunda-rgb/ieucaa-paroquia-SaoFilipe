import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWithProfile } from '@/lib/auth/getUser'
import FiltrosRelatorios from '@/components/relatorios/FiltrosRelatorios'
import TabelaRelatorio from '@/components/relatorios/TabelaRelatorio'
import BotaoExportarRelatorio from '@/components/relatorios/BotaoExportarRelatorio'
import type { Membro } from '@/types'
import Link from 'next/link'
interface Props {
  searchParams: Promise<{
    nome?: string
    bi?: string
    cargo?: string
    tipo_sanguineo?: string
  }>
}

export default async function RelatoriosPage({ searchParams }: Props) {
  const { profile } = await getUserWithProfile()

  // ⚠️ APENAS superadmin
  if (!profile || profile.role !== 'superadmin') {
    redirect('/admin/dashboard')
  }

  const filtros = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('membros')
    .select('*')
    .order('nome', { ascending: true })

  if (filtros.nome) {
    query = query.ilike('nome', `%${filtros.nome}%`)
  }
  if (filtros.bi) {
    query = query.ilike('bi', `%${filtros.bi}%`)
  }
  if (filtros.cargo) {
    query = query.eq('cargo', filtros.cargo)
  }
  if (filtros.tipo_sanguineo) {
    query = query.eq('tipo_sanguineo', filtros.tipo_sanguineo)
  }

  const { data: membros } = await query
  const lista = (membros ?? []) as Membro[]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cabeçalho */}
      
      <div className="flex items-center justify-between mb-6 print:hidden">
  <div>
    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
      Relatórios
    </h1>
    <p className="text-sm text-gray-500 mt-1">
      Pré-visualização e exportação em PDF
    </p>
  </div>

  <div className="flex items-center gap-3">
    <Link
      href="/admin/relatorios/financeiro"
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Relatório Financeiro
    </Link>

    <BotaoExportarRelatorio totalMembros={lista.length} />
  </div>
</div>

      {/* Aviso superadmin */}
      <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 print:hidden">
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Nota:</strong> os relatórios são exclusivos do nível de
          superadministrador. O PDF gerado inclui o cabeçalho institucional
          e todos os dados filtrados.
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <Suspense
          fallback={
            <div className="h-32 bg-white rounded-xl border border-gray-100" />
          }
        >
          <FiltrosRelatorios />
        </Suspense>
      </div>

      {/* Pré-visualização */}
      <TabelaRelatorio membros={lista} filtrosAtivos={filtros} />
    </div>
  )
}