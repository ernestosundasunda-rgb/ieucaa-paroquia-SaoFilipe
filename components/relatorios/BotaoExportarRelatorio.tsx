'use client'

import { useState } from 'react'
import { exportarElementoParaPDF } from '@/lib/pdf'
import { gerarTimestamp } from '@/lib/utils'

interface Props {
  totalMembros: number
}

export default function BotaoExportarRelatorio({ totalMembros }: Props) {
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleExportar() {
    if (totalMembros === 0) {
      setErro('Não há registos para exportar.')
      return
    }

    setErro('')
    setLoading(true)

    try {
      const nomeFicheiro = `RELATORIO-MEMBROS-${gerarTimestamp()}.pdf`

      await exportarElementoParaPDF({
        elementoId: 'relatorio-para-pdf',
        nomeFicheiro,
        orientacao: 'landscape',
        formato: 'a4',
        qualidade: 0.95,
      })
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro desconhecido'
      setErro('Erro ao exportar: ' + msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleExportar}
        disabled={loading || totalMembros === 0}
        className="inline-flex items-center gap-2 min-h-[40px] px-4 rounded-[10px] text-[13px] font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: '#FFFFFF',
        }}
      >
        {loading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            A gerar...
          </>
        ) : (
          <>
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exportar PDF
          </>
        )}
      </button>

      {erro && (
        <p className="text-[11px] text-red-600 max-w-[240px] text-right">
          {erro}
        </p>
      )}
    </div>
  )
}