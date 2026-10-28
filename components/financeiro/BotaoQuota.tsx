'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  quotaId: string
  pago: boolean
  mes: number
  ano: number
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export default function BotaoQuota({ quotaId, pago, mes, ano }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleToggle() {
    setErro('')
    setLoading(true)

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const novoEstado = !pago

    const { error } = await supabase
      .from('quotas')
      .update({
        pago: novoEstado,
        data_pagamento: novoEstado
          ? new Date().toISOString().split('T')[0]
          : null,
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
        className="w-full inline-flex items-center justify-center gap-1.5 min-h-[32px] px-3 rounded-md text-[11px] font-bold transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          backgroundColor: pago ? 'var(--color-danger)' : 'var(--color-primary)',
          color: '#FFFFFF',
        }}
        title={
          pago
            ? `Desmarcar ${MESES[mes - 1]}/${ano}`
            : `Marcar ${MESES[mes - 1]}/${ano} como pago`
        }
      >
        {loading ? (
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : pago ? (
          <>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Desmarcar
          </>
        ) : (
          <>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Marcar pago
          </>
        )}
      </button>

      {erro && (
        <p className="text-[9px] text-red-600 text-center">{erro}</p>
      )}
    </div>
  )
}