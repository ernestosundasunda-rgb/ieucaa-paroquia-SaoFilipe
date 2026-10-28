import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWithProfile } from '@/lib/auth/getUser'
import TabelaRelatorio from '@/components/relatorios/TabelaRelatorio'
import BotaoExportarRelatorio from '@/components/relatorios/BotaoExportarRelatorio'
import type { Membro } from '@/types'

export default async function RelatoriosPage() {
  const { profile } = await getUserWithProfile()

  if (!profile || profile.role !== 'superadmin') {
    redirect('/admin/dashboard')
  }

  const supabase = await createClient()

  const { data: membros } = await supabase
    .from('membros')
    .select('*')
    .order('nome', { ascending: true })

  const lista = (membros ?? []) as Membro[]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Barra superior institucional */}
      <div
        className="rounded-[14px] p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ backgroundColor: 'var(--color-primary-dark)' }}
      >
        <div className="min-w-0">
          <p
            className="text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            Sistema de Relatórios
          </p>
          <h1
            className="mt-1 text-[20px] font-bold tracking-tight"
            style={{ color: '#FFFFFF' }}
          >
            Relatório de Membros
          </h1>
          <p
            className="mt-1 text-[13px]"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            {lista.length} {lista.length === 1 ? 'registo' : 'registos'} · Lista completa
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 print:hidden">
         <Link
  href="/admin/financeiro"
  className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-[10px] text-[13px] font-semibold transition-all duration-200 hover:opacity-90"
  style={{
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    color: '#FFFFFF',
  }}
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
  Ir para Financeiro
</Link>
          <BotaoExportarRelatorio totalMembros={lista.length} />
        </div>
      </div>

      {/* Aviso superadmin */}
      <div
        className="rounded-[14px] border px-5 py-4 mb-6 print:hidden"
        style={{
          backgroundColor: 'var(--color-primary-soft)',
          borderColor: 'rgba(13, 110, 253, 0.15)',
        }}
      >
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="var(--color-primary)"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p
            className="text-[12px] leading-relaxed"
            style={{ color: 'var(--color-primary-dark)' }}
          >
            <strong>Acesso restrito.</strong> Os relatórios são exclusivos do
            nível de superadministrador. O PDF gerado inclui o cabeçalho
            institucional e todos os dados dos membros.
          </p>
        </div>
      </div>

      {/* Tabela (sem filtros) */}
      <TabelaRelatorio membros={lista} filtrosAtivos={{}} />
    </div>
  )
}