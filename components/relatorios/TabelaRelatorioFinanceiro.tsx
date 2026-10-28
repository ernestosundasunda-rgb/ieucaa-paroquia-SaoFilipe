import CabecalhoIgreja from '@/components/documentos/CabecalhoIgreja'
import { formatarData } from '@/lib/utils'
import { formatarKz } from '@/lib/quota'

interface LinhaRelatorio {
  membro: {
    id: string
    nome: string
    bi: string | null
    cargo: string | null
    foto_url: string | null
  }
  totalQuotas: number
  quotasPagas: number
  quotasNaoPagas: number
  valorPago: number
  valorEmFalta: number
  percentagem: number
}

interface Props {
  linhas: LinhaRelatorio[]
  resumoGeral: {
    totalMembros: number
    totalRecebido: number
    totalEmFalta: number
    taxaAdesao: number
  }
  filtrosAtivos: {
    nome?: string
    cargo?: string
    ano?: string
    estado?: string
  }
}

export default function TabelaRelatorioFinanceiro({
  linhas,
  resumoGeral,
  filtrosAtivos,
}: Props) {
  const filtrosTexto = [
    filtrosAtivos.nome && `Nome: "${filtrosAtivos.nome}"`,
    filtrosAtivos.cargo && `Cargo: "${filtrosAtivos.cargo}"`,
    filtrosAtivos.ano && `Ano: ${filtrosAtivos.ano}`,
    filtrosAtivos.estado === 'em_dia' && `Estado: Em dia`,
    filtrosAtivos.estado === 'com_divida' && `Estado: Com dívida`,
  ]
    .filter(Boolean)
    .join(' · ')

  const temFiltros = filtrosTexto.length > 0

  return (
    <div
      id="relatorio-financeiro-pdf"
      className="bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden"
    >
      {/* Cabeçalho institucional */}
      <div className="p-8 pb-0">
        <CabecalhoIgreja />

        <div className="text-center py-5 border-b-2 border-[#082F6B] mb-6">
          <h2 className="text-[15px] font-bold text-[#082F6B] uppercase tracking-[0.15em]">
            Relatório Financeiro Consolidado
          </h2>

          {temFiltros && (
            <p className="mt-2 text-[11px] text-[#64748B] italic">
              Filtros aplicados — {filtrosTexto}
            </p>
          )}
        </div>

        {/* Resumo em linha */}
        <div className="grid grid-cols-4 gap-0 mb-6 border border-[#E2E8F0] rounded-[10px] overflow-hidden">
          <div className="px-4 py-4 border-r border-[#E2E8F0]">
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              Total de membros
            </p>
            <p className="mt-1 text-[22px] font-bold text-[#0F172A] tabular-nums leading-none">
              {resumoGeral.totalMembros}
            </p>
          </div>

          <div className="px-4 py-4 border-r border-[#E2E8F0]">
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              Total recebido
            </p>
            <p className="mt-1 text-[18px] font-bold text-[#10B981] tabular-nums leading-none">
              {formatarKz(resumoGeral.totalRecebido)}
            </p>
          </div>

          <div className="px-4 py-4 border-r border-[#E2E8F0]">
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              Total em falta
            </p>
            <p className="mt-1 text-[18px] font-bold text-[#EF4444] tabular-nums leading-none">
              {formatarKz(resumoGeral.totalEmFalta)}
            </p>
          </div>

          <div className="px-4 py-4">
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
              Taxa de adesão
            </p>
            <p className="mt-1 text-[22px] font-bold text-[#0F172A] tabular-nums leading-none">
              {resumoGeral.taxaAdesao}%
            </p>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="px-8 pb-8">
        {linhas.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[13px] text-[#64748B]">
              Nenhum membro corresponde aos filtros aplicados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] border-collapse">
              <thead>
                <tr style={{ backgroundColor: 'var(--color-primary-dark)' }}>
                  <th
                    className="text-left px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]"
                    style={{ color: '#FFFFFF' }}
                  >
                    #
                  </th>
                  <th
                    className="text-left px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]"
                    style={{ color: '#FFFFFF' }}
                  >
                    Nome
                  </th>
                  <th
                    className="text-left px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]"
                    style={{ color: '#FFFFFF' }}
                  >
                    Cargo
                  </th>
                  <th
                    className="text-center px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]"
                    style={{ color: '#FFFFFF' }}
                  >
                    Pagas
                  </th>
                  <th
                    className="text-center px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]"
                    style={{ color: '#FFFFFF' }}
                  >
                    Em falta
                  </th>
                  <th
                    className="text-right px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]"
                    style={{ color: '#FFFFFF' }}
                  >
                    Pago
                  </th>
                  <th
                    className="text-right px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]"
                    style={{ color: '#FFFFFF' }}
                  >
                    Dívida
                  </th>
                  <th
                    className="text-center px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F] w-20"
                    style={{ color: '#FFFFFF' }}
                  >
                    Aderência
                  </th>
                </tr>
              </thead>

              <tbody>
                {linhas.map((l, i) => (
                  <tr
                    key={l.membro.id}
                    style={{
                      backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                    }}
                  >
                    <td className="px-3 py-2 border border-[#E2E8F0] text-center text-[#64748B] tabular-nums">
                      {i + 1}
                    </td>
                    <td className="px-3 py-2 border border-[#E2E8F0] font-semibold text-[#0F172A]">
                      {l.membro.nome}
                    </td>
                    <td className="px-3 py-2 border border-[#E2E8F0] text-[#0F172A]">
                      {l.membro.cargo || '—'}
                    </td>
                    <td className="px-3 py-2 border border-[#E2E8F0] text-center font-semibold text-[#10B981] tabular-nums">
                      {l.quotasPagas}
                    </td>
                    <td className="px-3 py-2 border border-[#E2E8F0] text-center font-semibold text-[#EF4444] tabular-nums">
                      {l.quotasNaoPagas}
                    </td>
                    <td className="px-3 py-2 border border-[#E2E8F0] text-right text-[#0F172A] tabular-nums">
                      {formatarKz(l.valorPago)}
                    </td>
                    <td className="px-3 py-2 border border-[#E2E8F0] text-right text-[#EF4444] tabular-nums">
                      {l.valorEmFalta > 0 ? formatarKz(l.valorEmFalta) : '—'}
                    </td>
                    <td className="px-3 py-2 border border-[#E2E8F0] text-center">
                      <span
                        className="font-bold tabular-nums"
                        style={{
                          color:
                            l.percentagem === 100
                              ? '#10B981'
                              : l.percentagem >= 50
                              ? '#D6A84F'
                              : '#EF4444',
                        }}
                      >
                        {l.percentagem}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Rodapé da tabela */}
              <tfoot>
                <tr style={{ backgroundColor: 'var(--color-primary-soft)' }}>
                  <td
                    colSpan={3}
                    className="px-3 py-2.5 border border-[#E2E8F0] text-right font-bold text-[#082F6B] uppercase tracking-wider text-[10px]"
                  >
                    Totais
                  </td>
                  <td className="px-3 py-2.5 border border-[#E2E8F0] text-center font-bold text-[#10B981] tabular-nums">
                    {linhas.reduce((acc, l) => acc + l.quotasPagas, 0)}
                  </td>
                  <td className="px-3 py-2.5 border border-[#E2E8F0] text-center font-bold text-[#EF4444] tabular-nums">
                    {linhas.reduce((acc, l) => acc + l.quotasNaoPagas, 0)}
                  </td>
                  <td className="px-3 py-2.5 border border-[#E2E8F0] text-right font-bold text-[#082F6B] tabular-nums">
                    {formatarKz(resumoGeral.totalRecebido)}
                  </td>
                  <td className="px-3 py-2.5 border border-[#E2E8F0] text-right font-bold text-[#EF4444] tabular-nums">
                    {resumoGeral.totalEmFalta > 0
                      ? formatarKz(resumoGeral.totalEmFalta)
                      : '—'}
                  </td>
                  <td className="px-3 py-2.5 border border-[#E2E8F0] text-center font-bold text-[#082F6B] tabular-nums">
                    {resumoGeral.taxaAdesao}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Rodapé do documento */}
        <div className="mt-8 pt-5 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#94A3B8] uppercase tracking-[0.1em]">
          <p>
            Documento emitido em {formatarData(new Date().toISOString())}
          </p>
          <p>Paróquia de São Filipe — Papelão, Uíge</p>
        </div>
      </div>
    </div>
  )
}