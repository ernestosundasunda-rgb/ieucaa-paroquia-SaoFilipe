'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CARGOS_SUGERIDOS } from '@/lib/constants'

interface Props {
  anosDisponiveis: number[]
}

export default function FiltrosRelatorioFinanceiro({ anosDisponiveis }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [nome, setNome] = useState(searchParams.get('nome') ?? '')
  const [cargo, setCargo] = useState(searchParams.get('cargo') ?? '')
  const [ano, setAno] = useState(searchParams.get('ano') ?? '')
  const [estado, setEstado] = useState(searchParams.get('estado') ?? '')

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()

      if (nome.trim()) params.set('nome', nome.trim())
      if (cargo) params.set('cargo', cargo)
      if (ano) params.set('ano', ano)
      if (estado) params.set('estado', estado)

      const query = params.toString()
      router.push(
        query
          ? `/admin/relatorios/financeiro?${query}`
          : '/admin/relatorios/financeiro'
      )
    }, 350)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nome, cargo, ano, estado])

  function limpar() {
    setNome('')
    setCargo('')
    setAno('')
    setEstado('')
  }

  const temFiltros = nome || cargo || ano || estado

  const inputClass =
    'w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 print:hidden">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <h3 className="text-sm font-medium text-gray-700">
          Filtros do Relatório
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
            Nome
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Pesquisar nome..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
            Cargo
          </label>
          <select
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className={inputClass}
          >
            <option value="">Todos</option>
            {CARGOS_SUGERIDOS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
            Ano
          </label>
          <select
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className={inputClass}
          >
            <option value="">Todos os anos</option>
            {anosDisponiveis.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className={inputClass}
          >
            <option value="">Todos</option>
            <option value="em_dia">Em dia (100%)</option>
            <option value="com_divida">Com dívida</option>
          </select>
        </div>
      </div>

      {temFiltros && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">Filtros ativos</p>
          <button
            onClick={limpar}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors duration-150"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  )
}