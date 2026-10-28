'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TIPOS_SANGUINEOS, CARGOS_SUGERIDOS } from '@/lib/constants'

export default function FiltrosRelatorios() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [nome, setNome] = useState(searchParams.get('nome') ?? '')
  const [bi, setBi] = useState(searchParams.get('bi') ?? '')
  const [cargo, setCargo] = useState(searchParams.get('cargo') ?? '')
  const [tipoSanguineo, setTipoSanguineo] = useState(
    searchParams.get('tipo_sanguineo') ?? ''
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()

      if (nome.trim()) params.set('nome', nome.trim())
      if (bi.trim()) params.set('bi', bi.trim().toUpperCase())
      if (cargo) params.set('cargo', cargo)
      if (tipoSanguineo) params.set('tipo_sanguineo', tipoSanguineo)

      const query = params.toString()
      router.push(query ? `/admin/relatorios?${query}` : '/admin/relatorios')
    }, 350)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nome, bi, cargo, tipoSanguineo])

  function limparTudo() {
    setNome('')
    setBi('')
    setCargo('')
    setTipoSanguineo('')
  }

  const temFiltros = nome || bi || cargo || tipoSanguineo

  return (
    <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-5 print:hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[#64748B]"
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
          <h3 className="text-[13px] font-bold text-[#0F172A]">Filtros</h3>
        </div>

        {temFiltros && (
          <button
            onClick={limparTudo}
            className="text-[11px] font-semibold transition-colors"
            style={{ color: 'var(--color-primary)' }}
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
            Nome
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Pesquisar..."
            className="input"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
            Nº BI
          </label>
          <input
            type="text"
            value={bi}
            onChange={(e) => setBi(e.target.value.toUpperCase())}
            placeholder="000123456LA041"
            maxLength={14}
            className="input font-mono uppercase"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
            Cargo
          </label>
          <select
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className="input"
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
          <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
            Tipo sanguíneo
          </label>
          <select
            value={tipoSanguineo}
            onChange={(e) => setTipoSanguineo(e.target.value)}
            className="input"
          >
            <option value="">Todos</option>
            {TIPOS_SANGUINEOS.map((t) => (
              <option key={t.valor} value={t.valor}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}