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
      className="bg-white rounded-xl border border-gray-100 p-10"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      {/* Cabeçalho institucional */}
      <CabecalhoIgreja />

      {/* Título */}
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold text-blue-950 uppercase tracking-widest">
          Relatório Financeiro Consolidado
        </h2>
        <div className="mt-2 w-32 h-0.5 bg-blue-900 mx-auto" />

        {temFiltros && (
          <p className="mt-3 text-xs text-gray-600 italic">
            Filtros aplicados — {filtrosTexto}
          </p>
        )}
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <ResumoCard
          titulo="Total de Membros"
          valor={String(resumoGeral.totalMembros)}
        />
        <ResumoCard
          titulo="Total Recebido"
          valor={formatarKz(resumoGeral.totalRecebido)}
          cor="green"
        />
        <ResumoCard
          titulo="Total em Falta"
          valor={formatarKz(resumoGeral.totalEmFalta)}
          cor="red"
        />
        <ResumoCard
          titulo="Taxa de Adesão"
          valor={`${resumoGeral.taxaAdesao}%`}
          cor="blue"
        />
      </div>

      {/* Tabela */}
      {linhas.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-500">
            Nenhum membro corresponde aos filtros aplicados.
          </p>
        </div>
      ) : (
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="text-left px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800 w-8">
                #
              </th>
              <th className="text-left px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800">
                Nome
              </th>
              <th className="text-left px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800">
                Cargo
              </th>
              <th className="text-center px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800 w-20">
                Pagas
              </th>
              <th className="text-center px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800 w-20">
                Em Falta
              </th>
              <th className="text-right px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800">
                Pago
              </th>
              <th className="text-right px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800">
                Dívida
              </th>
              <th className="text-center px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800 w-16">
                %
              </th>
            </tr>
          </thead>

          <tbody>
            {linhas.map((l, i) => (
              <tr
                key={l.membro.id}
                className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-2 py-1.5 border border-gray-200 text-center text-gray-500">
                  {i + 1}
                </td>
                <td className="px-2 py-1.5 border border-gray-200 font-medium text-gray-900">
                  {l.membro.nome}
                </td>
                <td className="px-2 py-1.5 border border-gray-200 text-gray-700">
                  {l.membro.cargo || '—'}
                </td>
                <td className="px-2 py-1.5 border border-gray-200 text-center text-green-700 font-semibold">
                  {l.quotasPagas}
                </td>
                <td className="px-2 py-1.5 border border-gray-200 text-center text-red-700 font-semibold">
                  {l.quotasNaoPagas}
                </td>
                <td className="px-2 py-1.5 border border-gray-200 text-right text-gray-900 font-mono">
                  {formatarKz(l.valorPago)}
                </td>
                <td className="px-2 py-1.5 border border-gray-200 text-right text-red-700 font-mono">
                  {l.valorEmFalta > 0 ? formatarKz(l.valorEmFalta) : '—'}
                </td>
                <td className="px-2 py-1.5 border border-gray-200 text-center">
                  <span
                    className={`font-semibold ${
                      l.percentagem === 100
                        ? 'text-green-700'
                        : l.percentagem >= 50
                        ? 'text-yellow-700'
                        : 'text-red-700'
                    }`}
                  >
                    {l.percentagem}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Rodapé da tabela — totais */}
          <tfoot>
            <tr className="bg-blue-50">
              <td
                colSpan={3}
                className="px-2 py-2 border border-gray-200 text-right font-bold text-blue-950 uppercase tracking-wider text-[10px]"
              >
                Totais
              </td>
              <td className="px-2 py-2 border border-gray-200 text-center font-bold text-green-800">
                {linhas.reduce((acc, l) => acc + l.quotasPagas, 0)}
              </td>
              <td className="px-2 py-2 border border-gray-200 text-center font-bold text-red-800">
                {linhas.reduce((acc, l) => acc + l.quotasNaoPagas, 0)}
              </td>
              <td className="px-2 py-2 border border-gray-200 text-right font-bold text-blue-950 font-mono">
                {formatarKz(resumoGeral.totalRecebido)}
              </td>
              <td className="px-2 py-2 border border-gray-200 text-right font-bold text-red-800 font-mono">
                {resumoGeral.totalEmFalta > 0
                  ? formatarKz(resumoGeral.totalEmFalta)
                  : '—'}
              </td>
              <td className="px-2 py-2 border border-gray-200 text-center font-bold text-blue-950">
                {resumoGeral.taxaAdesao}%
              </td>
            </tr>
          </tfoot>
        </table>
      )}

      {/* Rodapé */}
      <div className="mt-10 pt-5 border-t border-gray-200">
        <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-wider">
          <p>
            Documento emitido em {formatarData(new Date().toISOString())}
          </p>
          <p>Paróquia de São Filipe — Papelão, Uíge</p>
        </div>
      </div>
    </div>
  )
}

function ResumoCard({
  titulo,
  valor,
  cor = 'gray',
}: {
  titulo: string
  valor: string
  cor?: 'gray' | 'green' | 'red' | 'blue'
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
      <p className="text-base font-bold mt-1 tracking-tight">{valor}</p>
    </div>
  )
}