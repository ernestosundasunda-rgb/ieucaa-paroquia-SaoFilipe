import CabecalhoIgreja from '@/components/documentos/CabecalhoIgreja'
import { formatarData } from '@/lib/utils'
import type { Membro } from '@/types'

interface Props {
  membros: Membro[]
  filtrosAtivos?: {
    nome?: string
    bi?: string
    cargo?: string
    tipo_sanguineo?: string
  }
}

export default function TabelaRelatorio({
  membros,
  filtrosAtivos = {},
}: Props) {
  const total = membros.length
  const temFiltros = Object.values(filtrosAtivos).some(Boolean)

  // Contagem por género (usando o campo nome para inferir? Não temos campo género)
  // Vou usar dados reais se existirem, senão deixar 0
  // Se quiseres contagem por género, precisa de um campo "genero" na tabela membros

  return (
    <div
      id="relatorio-para-pdf"
      className="bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden"
    >
      <div className="p-8 pb-0">
        <CabecalhoIgreja />

        <div className="text-center py-5 border-b-2 border-[#082F6B] mb-6">
          <h2 className="text-[15px] font-bold text-[#082F6B] uppercase tracking-[0.15em]">
            Relatório de Membros
          </h2>

          {temFiltros && (
            <p className="mt-2 text-[11px] text-[#64748B] italic">
              Filtros aplicados
            </p>
          )}
        </div>
      </div>

      <div className="px-8 pb-8">
        {membros.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[13px] text-[#64748B]">
              Sem registos para mostrar.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] border-collapse">
              <thead>
                <tr style={{ backgroundColor: 'var(--color-primary-dark)' }}>
                  <th className="text-left px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]" style={{ color: '#FFFFFF' }}>#</th>
                  <th className="text-left px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]" style={{ color: '#FFFFFF' }}>Nome completo</th>
                  <th className="text-left px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]" style={{ color: '#FFFFFF' }}>Nº BI</th>
                  <th className="text-left px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]" style={{ color: '#FFFFFF' }}>Telefone</th>
                  <th className="text-left px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]" style={{ color: '#FFFFFF' }}>Cargo</th>
                  <th className="text-center px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]" style={{ color: '#FFFFFF' }}>T. Sang.</th>
                  <th className="text-left px-3 py-2.5 font-semibold uppercase tracking-wider text-[10px] border border-[#083D8F]" style={{ color: '#FFFFFF' }}>Batismo</th>
                </tr>
              </thead>
              <tbody>
                {membros.map((m, i) => (
                  <tr key={m.id} style={{ backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                    <td className="px-3 py-2 border border-[#E2E8F0] text-center text-[#64748B] tabular-nums">{i + 1}</td>
                    <td className="px-3 py-2 border border-[#E2E8F0] font-semibold text-[#0F172A]">{m.nome}</td>
                    <td className="px-3 py-2 border border-[#E2E8F0] text-[#0F172A] font-mono text-[11px] tracking-wider">{m.bi || '—'}</td>
                    <td className="px-3 py-2 border border-[#E2E8F0] text-[#0F172A]">{m.telefone || '—'}</td>
                    <td className="px-3 py-2 border border-[#E2E8F0] text-[#0F172A]">{m.cargo || '—'}</td>
                    <td className="px-3 py-2 border border-[#E2E8F0] text-[#0F172A] text-center tabular-nums">
                      {m.tipo_sanguineo && m.tipo_sanguineo !== 'desconhecido' ? m.tipo_sanguineo : '—'}
                    </td>
                    <td className="px-3 py-2 border border-[#E2E8F0] text-[#0F172A] tabular-nums">
                      {formatarData(m.data_batismo)}
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Rodapé com totais */}
              <tfoot>
                <tr style={{ backgroundColor: 'var(--color-primary-soft)' }}>
                  <td
                    colSpan={7}
                    className="px-3 py-3 border border-[#E2E8F0]"
                  >
                    <div className="flex flex-wrap items-center gap-6 text-[11px]">
                      <span className="font-bold text-[#082F6B] uppercase tracking-wider">
                        Total: {total} {total === 1 ? 'cadastrado' : 'cadastrados'}
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="mt-8 pt-5 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#94A3B8] uppercase tracking-[0.1em]">
          <p>Documento emitido em {formatarData(new Date().toISOString())}</p>
          <p>Paróquia de São Filipe — Papelão, Uíge</p>
        </div>
      </div>
    </div>
  )
}