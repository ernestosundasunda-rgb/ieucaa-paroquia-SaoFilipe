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

interface Props {
  params: Promise<{ id: string }>
}

export default async function FichaFinanceiraPage({ params }: Props) {
  const { id } = await params
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

  // Obter todas as quotas do membro
  const { data: quotas } = await supabase
    .from('quotas')
    .select('*')
    .eq('membro_id', id)
    .order('ano', { ascending: false })
    .order('mes', { ascending: false })

  const lista = (quotas ?? []) as Quota[]
  const resumo = calcularResumoQuotas(lista)
  const idade = calcularIdade(m.data_nascimento)

  // Agrupar quotas por ano
  const quotasPorAno = lista.reduce<Record<number, Quota[]>>((acc, q) => {
    if (!acc[q.ano]) acc[q.ano] = []
    acc[q.ano].push(q)
    return acc
  }, {})

  const anos = Object.keys(quotasPorAno)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toolbar (não vai para PDF) */}
      <div className="flex items-center justify-between mb-6 print:hidden">
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

        <BotaoExportarFichaFinanceira nomeMembro={m.nome} />
      </div>

      {/* DOCUMENTO PDF */}
      <div
        id="ficha-financeira-pdf"
        className="bg-white rounded-xl border border-gray-100 p-10"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Cabeçalho institucional */}
        <CabecalhoIgreja />

        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-bold text-blue-950 uppercase tracking-widest">
            Ficha Financeira
          </h2>
          <div className="mt-2 w-24 h-0.5 bg-blue-900 mx-auto" />
        </div>

        {/* Foto + Dados */}
        <div className="flex gap-8 mb-8">
          {/* Foto */}
          <div className="flex-shrink-0">
            <div className="w-40 h-48 bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center overflow-hidden">
              {m.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.foto_url}
                  alt={m.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center px-2">
                  <svg
                    className="w-12 h-12 text-gray-300 mx-auto mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    Fotografia
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dados */}
          <div className="flex-1 space-y-3">
            <Campo label="Nome completo" valor={m.nome} destaque />
            <Campo label="Nº do Bilhete de Identidade" valor={m.bi || '—'} mono />

            <div className="grid grid-cols-2 gap-3">
              <Campo
                label="Data de Nascimento"
                valor={formatarData(m.data_nascimento)}
              />
              <Campo
                label="Idade"
                valor={idade !== null ? `${idade} anos` : '—'}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Campo label="Cargo Ministerial" valor={m.cargo || '—'} />
              <Campo
                label="Membro desde"
                valor={formatarData(
                  m.data_inicio_quota || m.created_at
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Campo label="Telefone" valor={m.telefone || '—'} />
              <Campo label="Email" valor={m.email || '—'} />
            </div>
          </div>
        </div>

        {/* Resumo Financeiro */}
        <div className="border-t border-gray-200 my-6" />

        <div className="mb-6">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-4">
            Resumo Financeiro
          </h3>

          <div className="grid grid-cols-4 gap-3">
            <ResumoCard
              titulo="Total de Quotas"
              valor={String(resumo.total)}
            />
            <ResumoCard
              titulo="Pagas"
              valor={String(resumo.pagas)}
              cor="green"
            />
            <ResumoCard
              titulo="Não Pagas"
              valor={String(resumo.naoPagas)}
              cor="red"
            />
            <ResumoCard
              titulo="Total Recebido"
              valor={formatarKz(resumo.valorPago)}
              cor="blue"
              pequeno
            />
          </div>

          {/* Barra de progresso */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
              <span className="font-semibold">Progresso de Pagamento</span>
              <span>{resumo.percentagemPago}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${resumo.percentagemPago}%` }}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 my-6" />

        {/* Histórico por Ano */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-4">
            Histórico de Quotas
          </h3>

          {anos.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center py-8">
              Sem quotas registadas.
            </p>
          ) : (
            <div className="space-y-6">
              {anos.map((ano) => {
                const quotasAno = quotasPorAno[ano].sort(
                  (a, b) => a.mes - b.mes
                )
                const pagasAno = quotasAno.filter((q) => q.pago).length
                const totalAno = quotasAno.length

                return (
                  <div key={ano}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-gray-800">
                        {ano}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {pagasAno} de {totalAno} pagas
                      </span>
                    </div>

                    <div className="grid grid-cols-12 gap-1.5">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (mes) => {
                          const quota = quotasAno.find((q) => q.mes === mes)

                          return (
                            <div key={mes} className="flex flex-col">
                              <div
                                className={`aspect-square rounded flex items-center justify-center text-[10px] font-semibold ${
                                  quota?.pago
                                    ? 'bg-green-500 text-white'
                                    : quota
                                    ? 'bg-red-100 text-red-600 border border-red-200'
                                    : 'bg-gray-50 text-gray-300 border border-gray-100'
                                }`}
                                title={
                                  quota
                                    ? `${NOMES_MESES_CURTOS[mes - 1]}: ${
                                        quota.pago ? 'Pago' : 'Não pago'
                                      }`
                                    : 'Não aplicável'
                                }
                              >
                                {NOMES_MESES_CURTOS[mes - 1]}
                              </div>
                            </div>
                          )
                        }
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-[10px] text-gray-500 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-green-500" />
            <span>Pago</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-100 border border-red-200" />
            <span>Não pago</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-gray-100 border border-gray-200" />
            <span>Sem quota</span>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-10 pt-5 border-t border-gray-200 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
            Documento emitido em {formatarData(new Date().toISOString())}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Paróquia de São Filipe — Papelão, Uíge · Angola
          </p>
        </div>
      </div>

      {/* ÁREA DE GESTÃO (não vai para PDF) */}
      <div className="mt-8 print:hidden">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Gestão de Quotas
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Marca ou desmarca quotas mensais. Todas as alterações são
            registadas.
          </p>
        </div>

        {anos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <p className="text-sm text-gray-500">
              Nenhuma quota para gerir.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {anos.map((ano) => {
              const quotasAno = quotasPorAno[ano].sort(
                (a, b) => a.mes - b.mes
              )

              return (
                <div
                  key={ano}
                  className="bg-white rounded-xl border border-gray-100 p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-semibold text-gray-800">
                      {ano}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {quotasAno.filter((q) => q.pago).length} de{' '}
                      {quotasAno.length} pagas
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {quotasAno.map((quota) => (
                      <div
                        key={quota.id}
                        className={`rounded-lg border p-3 transition-all duration-200 ${
                          quota.pago
                            ? 'bg-green-50/50 border-green-200'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="text-center mb-2">
                          <p className="text-xs font-semibold text-gray-700">
                            {NOMES_MESES_CURTOS[quota.mes - 1]}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {formatarKz(Number(quota.valor))}
                          </p>
                          {quota.pago && quota.data_pagamento && (
                            <p className="text-[10px] text-green-600 mt-0.5">
                              {formatarData(quota.data_pagamento)}
                            </p>
                          )}
                        </div>
                        <BotaoQuota
                          quotaId={quota.id}
                          pago={quota.pago}
                          mes={quota.mes}
                          ano={quota.ano}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p
        className={`text-sm text-gray-900 border-b border-gray-200 pb-1 ${
          destaque ? 'font-bold text-base' : ''
        } ${mono ? 'font-mono tracking-wider' : ''}`}
      >
        {valor}
      </p>
    </div>
  )
}

function ResumoCard({
  titulo,
  valor,
  cor = 'gray',
  pequeno = false,
}: {
  titulo: string
  valor: string
  cor?: 'gray' | 'green' | 'red' | 'blue'
  pequeno?: boolean
}) {
  const cores = {
    gray: 'bg-gray-50 border-gray-200 text-gray-900',
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <div className={`rounded-lg border p-3 ${cores[cor]}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
        {titulo}
      </p>
      <p
        className={`font-bold mt-1 ${
          pequeno ? 'text-sm' : 'text-2xl'
        } tracking-tight`}
      >
        {valor}
      </p>
    </div>
  )
}