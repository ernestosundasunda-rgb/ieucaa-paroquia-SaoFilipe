import CabecalhoIgreja from '@/components/documentos/CabecalhoIgreja'
import { formatarData } from '@/lib/utils'
import type { Membro } from '@/types'

interface Props {
  membros: Membro[]
  filtrosAtivos: {
    nome?: string
    bi?: string
    cargo?: string
    tipo_sanguineo?: string
  }
}

export default function TabelaRelatorio({ membros, filtrosAtivos }: Props) {
  const total = membros.length
  const temFiltros = Object.values(filtrosAtivos).some(Boolean)

  // Texto dos filtros aplicados
  const filtrosTexto = [
    filtrosAtivos.nome && `Nome: "${filtrosAtivos.nome}"`,
    filtrosAtivos.bi && `BI: "${filtrosAtivos.bi}"`,
    filtrosAtivos.cargo && `Cargo: "${filtrosAtivos.cargo}"`,
    filtrosAtivos.tipo_sanguineo &&
      `Tipo Sanguíneo: "${filtrosAtivos.tipo_sanguineo}"`,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div
      id="relatorio-para-pdf"
      className="bg-white rounded-xl border border-gray-100 p-10"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      {/* Cabeçalho institucional */}
      <CabecalhoIgreja />

      {/* Título */}
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold text-blue-950 uppercase tracking-widest">
          Relatório de Membros
        </h2>
        <div className="mt-2 w-24 h-0.5 bg-blue-900 mx-auto" />

        {temFiltros && (
          <p className="mt-3 text-xs text-gray-600 italic">
            Filtros aplicados — {filtrosTexto}
          </p>
        )}
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <p className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
            Total de Membros
          </p>
          <p className="text-2xl font-bold text-blue-950 mt-1">{total}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <p className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
            Com BI Registado
          </p>
          <p className="text-2xl font-bold text-blue-950 mt-1">
            {membros.filter((m) => m.bi).length}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <p className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
            Com Foto
          </p>
          <p className="text-2xl font-bold text-blue-950 mt-1">
            {membros.filter((m) => m.foto_url).length}
          </p>
        </div>
      </div>

      {/* Tabela */}
      {membros.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-500">
            Nenhum membro corresponde aos filtros aplicados.
          </p>
        </div>
      ) : (
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="text-left px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800 w-8">
                #
              </th>
              <th className="text-left px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800">
                Nome Completo
              </th>
              <th className="text-left px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800">
                Nº BI
              </th>
              <th className="text-left px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800">
                Telefone
              </th>
              <th className="text-left px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800">
                Cargo
              </th>
              <th className="text-left px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800">
                Tipo Sang.
              </th>
              <th className="text-left px-2 py-2 font-semibold uppercase tracking-wider border border-blue-800">
                Batismo
              </th>
            </tr>
          </thead>

          <tbody>
            {membros.map((m, i) => (
              <tr
                key={m.id}
                className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
              >
                <td className="px-2 py-2 border border-gray-200 text-center text-gray-500">
                  {i + 1}
                </td>
                <td className="px-2 py-2 border border-gray-200 font-medium text-gray-900">
                  {m.nome}
                </td>
                <td className="px-2 py-2 border border-gray-200 text-gray-700 font-mono text-[10px]">
                  {m.bi || '—'}
                </td>
                <td className="px-2 py-2 border border-gray-200 text-gray-700">
                  {m.telefone || '—'}
                </td>
                <td className="px-2 py-2 border border-gray-200 text-gray-700">
                  {m.cargo || '—'}
                </td>
                <td className="px-2 py-2 border border-gray-200 text-gray-700 text-center">
                  {m.tipo_sanguineo && m.tipo_sanguineo !== 'desconhecido'
                    ? m.tipo_sanguineo
                    : '—'}
                </td>
                <td className="px-2 py-2 border border-gray-200 text-gray-700">
                  {formatarData(m.data_batismo)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Rodapé */}
      <div className="mt-10 pt-5 border-t border-gray-200">
        <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-wider">
          <p>
            Documento emitido em{' '}
            {formatarData(new Date().toISOString())}
          </p>
          <p>Paróquia de São Filipe — Papelão, Uíge</p>
        </div>
      </div>
    </div>
  )
}