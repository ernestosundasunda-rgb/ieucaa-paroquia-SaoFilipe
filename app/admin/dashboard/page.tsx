import Link from 'next/link'
import { getUserWithProfile } from '@/lib/auth/getUser'
import { createClient } from '@/lib/supabase/server'
import { formatarKz } from '@/lib/quota'
import Reveal from '@/components/public/Reveal'

export default async function DashboardPage() {
  const { profile } = await getUserWithProfile()
  const supabase = await createClient()

  const hoje = new Date()
  const mesAtual = hoje.getMonth() + 1
  const anoAtual = hoje.getFullYear()

  const [
    { count: totalMembros },
    { count: totalNoticias },
    { data: quotasMes },
    { data: quotasPagas },
    { data: todasQuotas },
  ] = await Promise.all([
    supabase.from('membros').select('*', { count: 'exact', head: true }),
    supabase.from('noticias').select('*', { count: 'exact', head: true }),
    supabase
      .from('quotas')
      .select('pago, valor')
      .eq('mes', mesAtual)
      .eq('ano', anoAtual),
    supabase
      .from('quotas')
      .select('valor, mes, ano')
      .eq('pago', true)
      .eq('ano', anoAtual),
    supabase.from('quotas').select('pago, valor, mes, ano'),
  ])

  const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin'
  const quotasPagasMes = quotasMes?.filter((q) => q.pago).length ?? 0
  const quotasNaoPagasMes = (quotasMes?.length ?? 0) - quotasPagasMes
  const totalRecebido =
    quotasPagas?.reduce((acc, q) => acc + Number(q.valor), 0) ?? 0
  const taxaAdesao =
    quotasMes && quotasMes.length > 0
      ? Math.round((quotasPagasMes / quotasMes.length) * 100)
      : 0

  const mesesLabels = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]

  // Receita por mês do ano atual
  const receitaPorMes = Array(12).fill(0)
  quotasPagas?.forEach((q) => {
    if (q.mes >= 1 && q.mes <= 12) {
      receitaPorMes[q.mes - 1] += Number(q.valor)
    }
  })
  const maxReceita = Math.max(...receitaPorMes, 1)

  // Quotas pagas por mês (todos os anos)
  const quotasPagasPorMes = Array(12).fill(0)
  todasQuotas?.forEach((q) => {
    if (q.pago && q.mes >= 1 && q.mes <= 12) {
      quotasPagasPorMes[q.mes - 1] += 1
    }
  })
  const maxQuotasPagas = Math.max(...quotasPagasPorMes, 1)
  const mesComMaisPagamentos = quotasPagasPorMes.indexOf(maxQuotasPagas) + 1
  const totalPagamentos = quotasPagasPorMes.reduce((a, b) => a + b, 0)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <span className="section-label">
          <span className="w-8 h-px bg-[var(--color-primary)]" />
          Dashboard
        </span>
        <h1 className="heading-md text-[#0F172A]">Visão geral</h1>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card
          titulo="Total de Membros"
          valor={totalMembros ?? 0}
          sublabel="Registados"
          gradiente="linear-gradient(135deg, #0D6EFD 0%, #0A58CA 100%)"
          Icone={IconUsersSvg}
        />
        <Card
          titulo="Notícias"
          valor={totalNoticias ?? 0}
          sublabel="Publicadas"
          gradiente="linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)"
          Icone={IconNewsSvg}
        />
        <Card
          titulo="Quotas Pagas"
          valor={quotasPagasMes}
          sublabel={`Este mês`}
          gradiente="linear-gradient(135deg, #10B981 0%, #059669 100%)"
          Icone={IconFinanceiroSvg}
        />
        <Card
          titulo="Total Recebido"
          valor={formatarKz(totalRecebido)}
          sublabel={`Em ${anoAtual}`}
          gradiente="linear-gradient(135deg, #D6A84F 0%, #B8842F 100%)"
          Icone={IconRelatorioSvg}
        />
      </div>

      {/* ===== Gráfico 1: Receita por mês + Taxa de adesão ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Gráfico de barras verticais — Receita */}
        <div className="lg:col-span-2 bg-white rounded-[16px] border border-[#E2E8F0] p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[14px] font-bold text-[#0F172A]">
                Receita por mês
              </h3>
              <p className="mt-0.5 text-[11px] text-[#64748B]">
                Valores recebidos em {anoAtual}
              </p>
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: 'var(--color-primary-soft)',
                color: 'var(--color-primary)',
              }}
            >
              {anoAtual}
            </span>
          </div>

          <div className="flex items-end justify-between gap-1.5 h-32">
            {receitaPorMes.map((valor, i) => {
              const altura = maxReceita > 0 ? (valor / maxReceita) * 100 : 0
              const ehMesAtual = i + 1 === mesAtual
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1.5"
                >
                  <div className="relative w-full h-full flex items-end">
                    <div
                      className="w-full rounded-t-sm transition-all duration-500"
                      style={{
                        height: `${Math.max(altura, 3)}%`,
                        background: ehMesAtual
                          ? 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)'
                          : 'linear-gradient(180deg, #93C5FD 0%, #60A5FA 100%)',
                      }}
                      title={`${mesesLabels[i]}: ${formatarKz(valor)}`}
                    />
                  </div>
                  <span
                    className={`text-[9px] font-semibold ${
                      ehMesAtual
                        ? 'text-[var(--color-primary)]'
                        : 'text-[#94A3B8]'
                    }`}
                  >
                    {mesesLabels[i]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Taxa de adesão */}
        <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-5 flex flex-col">
          <h3 className="text-[14px] font-bold text-[#0F172A]">
            Taxa de adesão
          </h3>
          <p className="mt-0.5 text-[11px] text-[#64748B]">
            Quotas pagas este mês
          </p>

          <div className="flex-1 flex items-center justify-center py-3">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="-rotate-90 w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#gradientCircle)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(taxaAdesao / 100) * 264} 264`}
                />
                <defs>
                  <linearGradient
                    id="gradientCircle"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[24px] font-bold text-[#0F172A] tracking-tight tabular-nums">
                  {taxaAdesao}%
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748B] mt-0.5">
                  Aderência
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E2E8F0]">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">
                Pagas
              </p>
              <p className="mt-0.5 text-[15px] font-bold text-[#10B981] tabular-nums">
                {quotasPagasMes}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">
                Em falta
              </p>
              <p className="mt-0.5 text-[15px] font-bold text-[#EF4444] tabular-nums">
                {quotasNaoPagasMes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Gráfico 2: Quotas pagas por mês (VERTICAL + barras de progressão) ===== */}
      <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-5 mb-6">
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 className="text-[14px] font-bold text-[#0F172A]">
              Quotas pagas por mês
            </h3>
            <p className="mt-0.5 text-[11px] text-[#64748B]">
              Total acumulado · {totalPagamentos} pagamentos
            </p>
          </div>

          {/* Destaque — mês com mais pagamentos */}
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--color-primary-soft)' }}
          >
            <div>
              <p
                className="text-[9px] font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-primary)' }}
              >
                Mês com mais pagamentos
              </p>
              <p
                className="text-[12px] font-bold mt-0.5"
                style={{ color: 'var(--color-primary-dark)' }}
              >
                {mesesLabels[mesComMaisPagamentos - 1]} · {maxQuotasPagas}
              </p>
            </div>
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#FFF',
              }}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Gráfico de barras VERTICAIS */}
        <div className="flex items-end justify-between gap-2 h-40">
          {quotasPagasPorMes.map((valor, i) => {
            const percentagem =
              maxQuotasPagas > 0 ? (valor / maxQuotasPagas) * 100 : 0
            const ehMaximo = i + 1 === mesComMaisPagamentos && valor > 0
            const ehMesAtual = i + 1 === mesAtual

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                {/* Valor acima da barra */}
                <span
                  className={`text-[10px] font-bold tabular-nums ${
                    ehMaximo
                      ? 'text-[#B8842F]'
                      : ehMesAtual
                      ? 'text-[var(--color-primary)]'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  {valor > 0 ? valor : ''}
                </span>

                {/* Coluna vertical — barra de progresso */}
                <div className="relative w-full flex-1 flex items-end">
                  {/* Fundo da barra (track) */}
                  <div className="absolute inset-0 rounded-t-md bg-[#F1F5F9]" />

                  {/* Barra de progresso */}
                  <div
                    className="relative w-full rounded-t-md transition-all duration-700 overflow-hidden"
                    style={{
                      height: `${Math.max(percentagem, valor > 0 ? 8 : 3)}%`,
                      background: ehMaximo
                        ? 'linear-gradient(180deg, #D6A84F 0%, #B8842F 100%)'
                        : ehMesAtual
                        ? 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)'
                        : 'linear-gradient(180deg, #93C5FD 0%, #60A5FA 100%)',
                    }}
                  >
                    {/* Efeito de "preenchimento" listado */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          'linear-gradient(0deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                        backgroundSize: '100% 6px',
                      }}
                    />

                    {/* Badge Top dentro da barra (só no máximo) */}
                    {ehMaximo && (
                      <div className="absolute top-1 left-1/2 -translate-x-1/2">
                        <span
                          className="text-[7px] font-bold uppercase tracking-wider px-1 py-0.5 rounded whitespace-nowrap"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            color: '#B8842F',
                          }}
                        >
                          Top
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mês */}
                <span
                  className={`text-[10px] font-bold ${
                    ehMesAtual
                      ? 'text-[var(--color-primary)]'
                      : 'text-[#64748B]'
                  }`}
                >
                  {mesesLabels[i]}
                </span>
              </div>
            )
          })}
        </div>

        {/* Barras de progressão horizontais — detalhe por mês */}
        <div className="mt-6 pt-5 border-t border-[#E2E8F0] space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-3">
            Distribuição percentual
          </p>

          {quotasPagasPorMes.map((valor, i) => {
            const percentagem =
              maxQuotasPagas > 0 ? (valor / maxQuotasPagas) * 100 : 0
            const ehMaximo = i + 1 === mesComMaisPagamentos && valor > 0
            const ehMesAtual = i + 1 === mesAtual

            return (
              <div key={i} className="flex items-center gap-3">
                {/* Mês */}
                <span
                  className={`text-[11px] font-bold w-8 flex-shrink-0 ${
                    ehMesAtual
                      ? 'text-[var(--color-primary)]'
                      : 'text-[#64748B]'
                  }`}
                >
                  {mesesLabels[i]}
                </span>

                {/* Barra de progresso */}
                <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${percentagem}%`,
                      background: ehMaximo
                        ? 'linear-gradient(90deg, #D6A84F 0%, #B8842F 100%)'
                        : ehMesAtual
                        ? 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)'
                        : 'linear-gradient(90deg, #93C5FD 0%, #60A5FA 100%)',
                    }}
                  />
                </div>

                {/* Percentagem */}
                <span
                  className={`text-[10px] font-bold tabular-nums w-10 text-right ${
                    ehMaximo
                      ? 'text-[#B8842F]'
                      : ehMesAtual
                      ? 'text-[var(--color-primary)]'
                      : 'text-[#94A3B8]'
                  }`}
                >
                  {Math.round(percentagem)}%
                </span>
              </div>
            )
          })}
        </div>

        {/* Legenda */}
        <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm"
              style={{
                background: 'linear-gradient(180deg, #D6A84F, #B8842F)',
              }}
            />
            <span className="text-[10px] text-[#64748B]">Mês TOP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--color-primary)]" />
            <span className="text-[10px] text-[#64748B]">Mês atual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#93C5FD]" />
            <span className="text-[10px] text-[#64748B]">Outros meses</span>
          </div>
        </div>
      </div>

      {/* Informação */}
      <div className="bg-white rounded-[16px] border border-[#E2E8F0] p-5">
        <div className="flex items-start gap-3.5">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--color-primary-soft)' }}
          >
            <svg
              className="w-4 h-4"
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
          </div>

          <div>
            <h3 className="text-[14px] font-bold text-[#0F172A]">
              Bem-vindo ao painel
            </h3>
            <p className="mt-1 text-[12px] text-[#64748B] leading-relaxed max-w-2xl">
              {isAdmin
                ? 'Tens permissões de administrador. Podes gerir membros, publicar notícias, controlar quotas e consultar relatórios.'
                : 'Bem-vindo ao teu painel. Aqui podes consultar e editar o teu perfil.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   CARD DE ESTATÍSTICA (compacto)
   ============================================ */

function Card({
  titulo,
  valor,
  sublabel,
  gradiente,
  Icone,
}: {
  titulo: string
  valor: string | number
  sublabel?: string
  gradiente: string
  Icone: React.FC<{ className?: string }>
}) {
  return (
    <div
      className="group relative rounded-[14px] p-4 text-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)]"
      style={{ background: gradiente }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div className="min-w-0">
          <p
            className="text-[9px] font-bold uppercase tracking-[0.15em]"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            {titulo}
          </p>
          <p className="mt-1.5 text-[22px] font-bold tracking-tight tabular-nums leading-none">
            {valor}
          </p>
          {sublabel && (
            <p
              className="mt-1.5 text-[10px]"
              style={{ color: 'rgba(255, 255, 255, 0.75)' }}
            >
              {sublabel}
            </p>
          )}
        </div>

        <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-white/25">
          <Icone className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}

/* ============================================
   ÍCONES INLINE
   ============================================ */

function IconUsersSvg({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6-4a3 3 0 11-3-3 3 3 0 013 3z"
      />
    </svg>
  )
}

function IconNewsSvg({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    </svg>
  )
}

function IconFinanceiroSvg({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
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
  )
}

function IconRelatorioSvg({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}