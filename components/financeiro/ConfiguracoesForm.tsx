'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatarKz } from '@/lib/quota'

interface Props {
  valorAtual: string
  totalMembros: number
}

export default function ConfiguracoesForm({
  valorAtual,
  totalMembros,
}: Props) {
  const router = useRouter()
  const [valor, setValor] = useState(valorAtual)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const valorNumero = Number(valor)
  const valorValido =
    !isNaN(valorNumero) && valorNumero > 0 && valorNumero <= 1000000

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (!valorValido) {
      setErro('O valor deve ser um número entre 1 e 1.000.000 Kz.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('configuracoes')
      .update({
        valor: String(valorNumero),
        updated_at: new Date().toISOString(),
      })
      .eq('chave', 'valor_quota')

    if (error) {
      setErro('Erro: ' + error.message)
      setLoading(false)
      return
    }

    setSucesso(
      'Valor atualizado com sucesso! As próximas quotas usarão este valor.'
    )
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {erro && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
          {erro}
        </div>
      )}
      {sucesso && (
        <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-sm text-green-700">
          {sucesso}
        </div>
      )}

      {/* Valor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Valor da Quota Mensal (Kz)
        </label>
        <div className="relative">
          <input
            type="number"
            min="1"
            max="1000000"
            step="1"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full px-3.5 py-3 pr-16 text-lg font-semibold border border-gray-200 rounded-lg bg-white text-gray-900 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
            Kz
          </span>
        </div>
        {valorValido && (
          <p className="mt-1.5 text-xs text-gray-500">
            Valor formatado: <strong>{formatarKz(valorNumero)}</strong>
          </p>
        )}
      </div>

      {/* Aviso */}
      <div className="px-4 py-3 rounded-lg bg-blue-50 border border-blue-100">
        <div className="flex gap-2">
          <svg
            className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-xs text-blue-700 leading-relaxed">
            <p className="font-semibold mb-1">Importante:</p>
            <ul className="space-y-0.5 list-disc list-inside">
              <li>
                O novo valor aplica-se apenas a <strong>quotas futuras</strong>
              </li>
              <li>
                As quotas já geradas <strong>mantêm o valor original</strong>
              </li>
              <li>
                Atualmente existem <strong>{totalMembros} membros</strong>{' '}
                registados
              </li>
              <li>
                Receita mensal esperada:{' '}
                <strong>{formatarKz(valorNumero * totalMembros)}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Botão */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => {
            setValor(valorAtual)
            setErro('')
            setSucesso('')
          }}
          disabled={loading}
          className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150 disabled:opacity-60"
        >
          Repor
        </button>

        <button
          type="submit"
          disabled={loading || !valorValido || valor === valorAtual}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30"
        >
          {loading ? 'A guardar...' : 'Guardar Configuração'}
        </button>
      </div>
    </form>
  )
}