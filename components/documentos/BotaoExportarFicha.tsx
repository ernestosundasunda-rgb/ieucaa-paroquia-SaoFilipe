'use client'

import { useState } from 'react'
import { exportarElementoParaPDF } from '@/lib/pdf'
import { gerarNomeFicheiro } from '@/lib/utils'
import type { Membro } from '@/types'

interface Props {
  membro: Membro
}

export default function BotaoExportarFicha({ membro }: Props) {
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleExportar() {
    setErro('')
    setLoading(true)

    try {
      const nomeFicheiro = gerarNomeFicheiro('FICHA-MEMBRO', membro.nome)

      await exportarElementoParaPDF({
        elementoId: 'ficha-para-pdf',
        nomeFicheiro,
        orientacao: 'portrait',
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
        disabled={loading}
        className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm shadow-blue-900/20 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
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
            A gerar PDF...
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
        <p className="text-xs text-red-600 max-w-[240px] text-right">{erro}</p>
      )}
    </div>
  )
}