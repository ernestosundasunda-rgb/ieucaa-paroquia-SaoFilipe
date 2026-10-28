import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWithProfile } from '@/lib/auth/getUser'
import CabecalhoIgreja from '@/components/documentos/CabecalhoIgreja'
import BotaoQuota from '@/components/financeiro/BotaoQuota'
import BotaoExportarFichaFinanceira from '@/components/financeiro/BotaoExportarFichaFinanceira'
import { calcularIdade, formatarData } from '@/lib/utils'
import { calcularResumoQuotas, formatarKz } from '@/lib/quota'
import { NOMES_MESES_CURTOS } from '@/types'
import type { Membro, Quota } from '@/types'
import { garantirQuotasDoAno } from '@/lib/quota-server'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ ano?: string }>
}

export default async function FichaFinanceiraPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params
  const { ano: anoFiltro } = await searchParams
  const { profile } = await getUserWithProfile()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    redirect('/admin/dashboard')
  }

  const supabase = await createClient()

  const { data: membro } = await supabase
    .from('membros')
    .select('*')
    .eq('id', id)
    .single()

  if (!membro) notFound()

  const m = membro as Membro

    // Garantir que existem quotas do ano atual até ao mês atual

   await garantirQuotasDoAno(id) 
  // Todas as quotas do membro
  const { data: quotas } = await supabase
    .from('quotas')
    .select('*')
    .eq('membro_id', id)
    .order('ano', { ascending: false })
    .order('mes', { ascending: true })

  const lista = (quotas ?? []) as Quota[]
  const resumo = calcularResumoQuotas(lista)
  const idade = calcularIdade(m.data_nascimento)

  // Anos disponíveis
  const anos = Array.from(new Set(lista.map((q) => q.ano))).sort(
    (a, b) => b - a
  )

  // Ano selecionado (padrão: o mais recente com quotas ou o ano atual)
  const anoAtual = new Date().getFullYear()
  const anoSelecionado = anoFiltro
    ? Number(anoFiltro)
    : anos.includes(anoAtual)
    ? anoAtual
    : anos[0] ?? anoAtual

  // Quotas do ano selecionado (todas as 12 posições)
  const quotasAno = Array.from({ length: 12 }, (_, i) => {
    const mes = i + 1
    return lista.find((q) => q.ano === anoSelecionado && q.mes === mes) ?? null
  })

  const hoje = new Date()
  const mesAtual = hoje.getMonth() + 1

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          href="/admin/financeiro"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#64748B] hover:text-[var(--color-primary)] transition-colors uppercase tracking-[0.1em]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao financeiro
        </Link>

        <BotaoExportarFichaFinanceira nomeMembro={m.nome} />
      </div>

      {/* DOCUMENTO PDF */}
      <div
        id="ficha-financeira-pdf"
        className="bg-white rounded-[14px] border border-[#E2E8F0] p-8"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        <CabecalhoIgreja />

        <div className="text-center py-5 border-b-2 border-[#082F6B] mb-6">
          <h2 className="text-[15px] font-bold text-[#082F6B] uppercase tracking-[0.15em]">
            Ficha Financeira
          </h2>
        </div>

        {/* Foto + Dados */}
        <div className="flex gap-6 mb-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-40 bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center overflow-hidden">
              {m.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.foto_url} alt={m.nome} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center px-2">
                  <svg className="w-10 h-10 text-gray-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Fotografia</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-2.5">
            <Campo label="Nome completo" valor={m.nome} destaque />
            <Campo label="Nº do BI" valor={m.bi || '—'} mono />
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Data de Nascimento" valor={formatarData(m.data_nascimento)} />
              <Campo label="Idade" valor={idade !== null ? `${idade} anos` : '—'} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Cargo" valor={m.cargo || '—'} />
              <Campo label="Membro desde" valor={formatarData(m.data_inicio_quota || m.created_at)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Campo label="Telefone" valor={m.telefone || '—'} />
              <Campo label="Email" valor={m.email || '—'} />
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div className="border-t border-[#E2E8F0] pt-6 mb-6">
          <h3 className="text-[11px] font-bold text-[#082F6B] uppercase tracking-widest mb-4">
            Resumo Financeiro
          </h3>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <ResumoBox titulo="Total de Quotas" valor={String(resumo.total)} />
            <ResumoBox titulo="Pagas" valor={String(resumo.pagas)} cor="green" />
            <ResumoBox titulo="Não Pagas" valor={String(resumo.naoPagas)} cor="red" />
            <ResumoBox titulo="Total Recebido" valor={formatarKz(resumo.valorPago)} cor="blue" pequeno />
          </div>

          {/* Barra de progresso */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1.5">
              <span className="font-semibold uppercase tracking-wider">Progresso</span>
              <span className="font-bold tabular-nums">{resumo.percentagemPago}%</span>
            </div>
            <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${resumo.percentagemPago}%`,
                  background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ÁREA DE GESTÃO — Fora do PDF */}
      <div className="mt-6 print:hidden">
        {/* Navegação por anos */}
        <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-4 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-[13px] font-bold text-[#0F172A]">
                Gestão de quotas
              </h3>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Clica em cada mês para marcar/desmarcar como pago
              </p>
            </div>

            {/* Seletor de ano */}
            {anos.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  Ano:
                </span>
                <div className="flex items-center gap-1 flex-wrap">
                  {anos.map((a) => {
                    const ativo = a === anoSelecionado
                    return (
                      <Link
                        key={a}
                        href={`/admin/financeiro/${id}?ano=${a}`}
                        className="inline-flex items-center justify-center min-h-[32px] px-3 rounded-md text-[12px] font-bold tabular-nums transition-all duration-200"
                        style={{
                          backgroundColor: ativo
                            ? 'var(--color-primary)'
                            : '#F1F5F9',
                          color: ativo ? '#FFFFFF' : '#64748B',
                        }}
                      >
                        {a}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Grid de meses do ano selecionado */}
        <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[14px] font-bold text-[#0F172A]">
              {anoSelecionado}
            </h4>
            <span className="text-[11px] text-[#64748B]">
              {quotasAno.filter((q) => q?.pago).length} de{' '}
              {quotasAno.filter(Boolean).length} pagas
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {quotasAno.map((quota, i) => {
              const mes = i + 1
              const ehMesAtual =
                anoSelecionado === hoje.getFullYear() && mes === mesAtual

              // Se não existe quota para este mês
              if (!quota) {
                return (
                  <div
                    key={mes}
                    className="rounded-[12px] border-2 border-dashed border-[#E2E8F0] p-4 text-center opacity-50"
                  >
                    <p className="text-[12px] font-bold text-[#94A3B8]">
                      {NOMES_MESES_CURTOS[i]}
                    </p>
                    <p className="text-[10px] text-[#CBD5E1] mt-1">
                      Sem quota
                    </p>
                  </div>
                )
              }

              return (
                <div
                  key={mes}
                  className="rounded-[12px] border p-4 transition-all duration-200"
                  style={{
                    backgroundColor: quota.pago ? '#F0FDF4' : '#FFFFFF',
                    borderColor: quota.pago ? '#BBF7D0' : '#E2E8F0',
                    borderWidth: ehMesAtual ? '2px' : '1px',
                    borderStyle: ehMesAtual ? 'solid' : 'solid',
                    ...(ehMesAtual && !quota.pago
                      ? { borderColor: 'var(--color-primary)' }
                      : {}),
                    ...(ehMesAtual && quota.pago
                      ? { borderColor: '#16A34A' }
                      : {}),
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-[14px] font-bold tracking-tight"
                      style={{
                        color: quota.pago ? '#166534' : '#0F172A',
                      }}
                    >
                      {NOMES_MESES_CURTOS[i]}
                    </p>

                    {ehMesAtual && (
                      <span
                        className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: '#FFFFFF',
                        }}
                      >
                        Atual
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#64748B] mb-1">
                    {formatarKz(Number(quota.valor))}
                  </p>

                  {quota.pago && quota.data_pagamento && (
                    <p className="text-[10px] text-[#16A34A] font-semibold mb-2">
                      Pago em {formatarData(quota.data_pagamento)}
                    </p>
                  )}

                  <BotaoQuota
                    quotaId={quota.id}
                    pago={quota.pago}
                    mes={quota.mes}
                    ano={quota.ano}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   COMPONENTES AUXILIARES
   ============================================ */

function Campo({
  label,
  valor,
  destaque = false,
  mono = false,
}: {
  label: string
  valor: string
  destaque?: boolean
  mono?: boolean
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p
        className={`text-[13px] text-[#0F172A] border-b border-[#E2E8F0] pb-1 ${
          destaque ? 'font-bold text-[15px]' : ''
        } ${mono ? 'font-mono tracking-wider' : ''}`}
      >
        {valor}
      </p>
    </div>
  )
}

function ResumoBox({
  titulo,
  valor,
  cor = 'neutral',
  pequeno = false,
}: {
  titulo: string
  valor: string
  cor?: 'neutral' | 'green' | 'red' | 'blue'
  pequeno?: boolean
}) {
  const cores = {
    neutral: { bg: '#F8FAFC', border: '#E2E8F0', text: '#0F172A' },
    green: { bg: '#F0FDF4', border: '#BBF7D0', text: '#166534' },
    red: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
    blue: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
  }

  return (
    <div
      className="rounded-lg border p-3"
      style={{
        backgroundColor: cores[cor].bg,
        borderColor: cores[cor].border,
      }}
    >
      <p
        className="text-[9px] font-bold uppercase tracking-wider opacity-70"
        style={{ color: cores[cor].text }}
      >
        {titulo}
      </p>
      <p
        className={`font-bold mt-1 tabular-nums leading-none ${
          pequeno ? 'text-[13px]' : 'text-[18px]'
        }`}
        style={{ color: cores[cor].text }}
      >
        {valor}
      </p>
    </div>
  )
}