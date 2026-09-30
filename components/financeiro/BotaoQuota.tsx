'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  quotaId: string
  pago: boolean
  mes: number
  ano: number
  registadoPor?: string
}

const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export default function BotaoQuota({ quotaId, pago, mes, ano }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleToggle() {
    setErro('')
    setLoading(true)

    const supabase = createClient()

    // Obter o utilizador atual (para registar quem marcou)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const novoEstado = !pago

    const { error } = await supabase
      .from('quotas')
      .update({
        pago: novoEstado,
        data_pagamento: novoEstado ? new Date().toISOString().split('T')[0] : null,
        registado_por: novoEstado ? user?.id : null,
      })
      .eq('id', quotaId)

    if (error) {
      setErro(error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`group relative inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
          pago
            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50'
        }`}
        title={
          pago
            ? `Marcar ${MESES[mes - 1]}/${ano} como não pago`
            : `Marcar ${MESES[mes - 1]}/${ano} como pago`
        }
      >
        {loading ? (
          <>
            <svg
              className="w-3.5 h-3.5 animate-spin"
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
            A processar...
          </>
        ) : pago ? (
          <>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Pago
          </>
        ) : (
          <>
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Marcar pago
          </>
        )}
      </button>

      {erro && <p className="text-[10px] text-red-600 text-center">{erro}</p>}
    </div>
  )
}