import Link from 'next/link'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWithProfile } from '@/lib/auth/getUser'
import FiltrosFinanceiro from '@/components/financeiro/FiltrosFinanceiro'
import { formatarKz } from '@/lib/quota'
import type { Membro } from '@/types'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

interface Props {
  searchParams: Promise<{
    nome?: string
    bi?: string
    cargo?: string
    estado?: string
  }>
}

export default async function FinanceiroPage({ searchParams }: Props) {
  const { profile } = await getUserWithProfile()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    redirect('/admin/dashboard')
  }

  const filtros = await searchParams
  const supabase = await createClient()

  const hoje = new Date()
  const mesAtual = hoje.getMonth() + 1
  const anoAtual = hoje.getFullYear()

  // Buscar membros com filtros
  let queryMembros = supabase
    .from('membros')
    .select('*')
    .order('nome', { ascending: true })

  if (filtros.nome) queryMembros = queryMembros.ilike('nome', `%${filtros.nome}%`)
  if (filtros.bi) queryMembros = queryMembros.ilike('bi', `%${filtros.bi}%`)
  if (filtros.cargo) queryMembros = queryMembros.eq('cargo', filtros.cargo)

  const { data: membros } = await queryMembros

  // Quotas do mês atual
  const { data: quotasMes } = await supabase
    .from('quotas')
    .select('membro_id, pago, valor')
    .eq('mes', mesAtual)
    .eq('ano', anoAtual)

  const estadoPorMembro = new Map<string, { pago: boolean; valor: number }>()
  quotasMes?.forEach((q) => {
    estadoPorMembro.set(q.membro_id, { pago: q.pago, valor: q.valor })
  })

  // Filtro de estado
  let membrosFiltrados = (membros ?? []) as Membro[]
  if (filtros.estado === 'pago') {
    membrosFiltrados = membrosFiltrados.filter(
      (m) => estadoPorMembro.get(m.id)?.pago === true
    )
  } else if (filtros.estado === 'nao_pago') {
    membrosFiltrados = membrosFiltrados.filter(
      (m) => estadoPorMembro.get(m.id)?.pago !== true
    )
  }

  // Estatísticas
  const totalMembros = membrosFiltrados.length
  const pagosEsteMes = membrosFiltrados.filter(
    (m) => estadoPorMembro.get(m.id)?.pago === true
  ).length
  const naoPagosEsteMes = totalMembros - pagosEsteMes
  const valorRecebido = membrosFiltrados
    .filter((m) => estadoPorMembro.get(m.id)?.pago === true)
    .reduce((acc, m) => acc + Number(estadoPorMembro.get(m.id)?.valor ?? 0), 0)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <span className="section-label">
            <span className="w-8 h-px bg-[var(--color-primary)]" />
            Financeiro
          </span>
          <h1 className="heading-md text-[#0F172A]">Gestão Financeira</h1>
          <p className="mt-2 text-[13px] text-[#64748B]">
            Controlo de quotas mensais · {MESES[mesAtual - 1]} de {anoAtual}
          </p>
        </div>

        {profile.role === 'superadmin' && (
          <Link
            href="/admin/financeiro/configuracoes"
            className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-[10px] text-[13px] font-semibold border transition-all duration-200 hover:bg-[#F8FAFC]"
            style={{
              borderColor: 'var(--color-border-strong)',
              color: 'var(--color-text)',
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configurações
          </Link>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MiniStat label="Total de Membros" valor={totalMembros} />
        <MiniStat label="Pagaram este mês" valor={pagosEsteMes} cor="green" />
        <MiniStat label="Não pagaram" valor={naoPagosEsteMes} cor="red" />
        <MiniStat label="Recebido" valor={formatarKz(valorRecebido)} cor="blue" />
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-32 bg-white rounded-[14px] border border-[#E2E8F0]" />}>
          <FiltrosFinanceiro />
        </Suspense>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden">
        {membrosFiltrados.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-[13px] text-[#64748B]">
              {filtros.nome || filtros.bi || filtros.cargo || filtros.estado
                ? 'Nenhum membro corresponde aos filtros.'
                : 'Ainda não há membros registados.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="text-left px-5 py-3 font-semibold text-[#64748B] text-[10px] uppercase tracking-wider">
                    Membro
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-[#64748B] text-[10px] uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-[#64748B] text-[10px] uppercase tracking-wider">
                    Estado ({MESES[mesAtual - 1]})
                  </th>
                  <th className="text-right px-5 py-3 font-semibold text-[#64748B] text-[10px] uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {membrosFiltrados.map((membro) => {
                  const estado = estadoPorMembro.get(membro.id)
                  const pago = estado?.pago ?? false

                  return (
                    <tr key={membro.id} className="transition-colors duration-150 hover:bg-[#F8FAFC]">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[var(--color-primary-soft)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {membro.foto_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={membro.foto_url} alt={membro.nome} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[12px] font-bold text-[var(--color-primary)]">
                                {membro.nome.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#0F172A] truncate text-[13px]">{membro.nome}</p>
                            {membro.bi && (
                              <p className="text-[10px] text-[#94A3B8] font-mono">{membro.bi}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#64748B]">{membro.cargo || '—'}</td>
                      <td className="px-5 py-3.5">
                        {pago ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold bg-[#DCFCE7] text-[#166534] rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                            Pago
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold bg-[#FEE2E2] text-[#991B1B] rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                            Não pago
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/admin/financeiro/${membro.id}`}
                          className="text-[12px] font-semibold transition-colors"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          Ver ficha
                        </Link>
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

function MiniStat({
  label,
  valor,
  cor = 'neutral',
}: {
  label: string
  valor: string | number
  cor?: 'neutral' | 'green' | 'red' | 'blue'
}) {
  const cores = {
    neutral: { bg: '#FFFFFF', border: '#E2E8F0', text: '#0F172A' },
    green: { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' },
    red: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
    blue: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
  }

  return (
    <div
      className="rounded-[12px] border px-4 py-3"
      style={{
        backgroundColor: cores[cor].bg,
        borderColor: cores[cor].border,
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cores[cor].text, opacity: 0.7 }}>
        {label}
      </p>
      <p className="mt-1 text-[20px] font-bold tabular-nums leading-none" style={{ color: cores[cor].text }}>
        {valor}
      </p>
    </div>
  )
}