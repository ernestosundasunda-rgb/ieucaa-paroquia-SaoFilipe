'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import FotoMembroUpload from './FotoMembroUpload'
import { TIPOS_SANGUINEOS, CARGOS_SUGERIDOS, BI_REGEX } from '@/lib/constants'
import type { Membro, TipoSanguineo } from '@/types'

interface Props {
  membro?: Membro
}

export default function MembroForm({ membro }: Props) {
  const router = useRouter()
  const editando = !!membro

  const [form, setForm] = useState({
    nome: membro?.nome ?? '',
    bi: membro?.bi ?? '',
    email: membro?.email ?? '',
    telefone: membro?.telefone ?? '',
    endereco: membro?.endereco ?? '',
    data_nascimento: membro?.data_nascimento ?? '',
    data_batismo: membro?.data_batismo ?? '',
    data_confirmacao: membro?.data_confirmacao ?? '',
    data_inicio_quota: membro?.data_inicio_quota ?? '',
    tipo_sanguineo: (membro?.tipo_sanguineo ?? '') as TipoSanguineo | '',
    cargo: membro?.cargo ?? '',
  })

  const [fotoUrl, setFotoUrl] = useState<string | null>(
    membro?.foto_url ?? null
  )

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const biValido = form.bi === '' || BI_REGEX.test(form.bi)
  const biTemConteudo = form.bi.length > 0

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target

    if (name === 'bi') {
      const limpo = value.replace(/\s/g, '').toUpperCase()
      setForm({ ...form, bi: limpo })
      return
    }

    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')

    if (!form.nome.trim()) {
      setErro('O nome é obrigatório.')
      return
    }

    if (form.bi && !BI_REGEX.test(form.bi)) {
      setErro(
        'O BI deve ter o formato correto: 9 dígitos + 2 letras + 3 dígitos (ex: 000123456LA041)'
      )
      return
    }

    setLoading(true)
    const supabase = createClient()

    const dados = {
      nome: form.nome.trim(),
      bi: form.bi.trim() || null,
      email: form.email.trim() || null,
      telefone: form.telefone.trim() || null,
      endereco: form.endereco.trim() || null,
      data_nascimento: form.data_nascimento || null,
      data_batismo: form.data_batismo || null,
      data_confirmacao: form.data_confirmacao || null,
      data_inicio_quota: form.data_inicio_quota || null,
      tipo_sanguineo: form.tipo_sanguineo || null,
      cargo: form.cargo.trim() || null,
      foto_url: fotoUrl,
    }

    const { error } = editando
      ? await supabase.from('membros').update(dados).eq('id', membro!.id)
      : await supabase.from('membros').insert(dados)

    if (error) {
      if (error.code === '23505' && error.message.includes('bi')) {
        setErro('Já existe um membro cadastrado com este BI.')
      } else {
        setErro('Erro: ' + error.message)
      }
      setLoading(false)
      return
    }

    router.push('/admin/membros')
    router.refresh()
  }

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {erro && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Foto */}
      <div className="flex justify-center pb-6 border-b border-gray-100">
        <FotoMembroUpload
          fotoAtual={membro?.foto_url ?? null}
          onFotoMudou={setFotoUrl}
          nome={form.nome}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nome */}
        <div className="md:col-span-2">
          <label className={labelClass}>Nome completo *</label>
          <input
            type="text"
            name="nome"
            required
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome do membro"
            className={inputClass}
          />
        </div>

        {/* BI */}
        <div className="md:col-span-2">
          <label className={labelClass}>Nº do Bilhete de Identidade</label>
          <input
            type="text"
            name="bi"
            value={form.bi}
            onChange={handleChange}
            placeholder="000123456LA041"
            maxLength={14}
            className={`${inputClass} font-mono tracking-wider uppercase ${
              biTemConteudo && !biValido
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                : biTemConteudo && biValido
                ? 'border-green-300 focus:border-green-500 focus:ring-green-500/10'
                : ''
            }`}
          />
          {biTemConteudo && !biValido && (
            <p className="mt-1.5 text-xs text-red-600">
              Formato inválido. Deve ter 9 dígitos + 2 letras + 3 dígitos.
            </p>
          )}
          {biTemConteudo && biValido && (
            <p className="mt-1.5 text-xs text-green-600">Formato válido</p>
          )}
          {!biTemConteudo && (
            <p className="mt-1.5 text-xs text-gray-400">
              Formato: 9 dígitos + 2 letras + 3 dígitos
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@exemplo.com"
            className={inputClass}
          />
        </div>

        {/* Telefone */}
        <div>
          <label className={labelClass}>Telefone</label>
          <input
            type="text"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="+244 900 000 000"
            className={inputClass}
          />
        </div>

        {/* Endereço */}
        <div className="md:col-span-2">
          <label className={labelClass}>Endereço</label>
          <input
            type="text"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
            placeholder="Rua, número, bairro"
            className={inputClass}
          />
        </div>

        {/* Data Nascimento */}
        <div>
          <label className={labelClass}>Data de Nascimento</label>
          <input
            type="date"
            name="data_nascimento"
            value={form.data_nascimento}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Tipo Sanguíneo */}
        <div>
          <label className={labelClass}>Tipo Sanguíneo</label>
          <select
            name="tipo_sanguineo"
            value={form.tipo_sanguineo}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Não especificado</option>
            {TIPOS_SANGUINEOS.map((t) => (
              <option key={t.valor} value={t.valor}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Data Batismo */}
        <div>
          <label className={labelClass}>Data de Batismo</label>
          <input
            type="date"
            name="data_batismo"
            value={form.data_batismo}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        {/* Data Confirmação */}
        <div>
          <label className={labelClass}>Data de Confirmação</label>
          <input
            type="date"
            name="data_confirmacao"
            value={form.data_confirmacao}
            onChange={handleChange}
            className={inputClass}
          />
          <p className="mt-1.5 text-xs text-gray-400">Campo opcional</p>
        </div>

        {/* Cargo */}
        <div className="md:col-span-2">
          <label className={labelClass}>Cargo</label>
          <input
            type="text"
            name="cargo"
            value={form.cargo}
            onChange={handleChange}
            placeholder="Ex: Diácono, Presbítero, Membro"
            list="cargos-sugeridos"
            className={inputClass}
          />
          <datalist id="cargos-sugeridos">
            {CARGOS_SUGERIDOS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        {/* Data Início Quota */}
        <div className="md:col-span-2 pt-4 border-t border-gray-100">
          <label className={labelClass}>Data de Início das Quotas</label>
          <input
            type="date"
            name="data_inicio_quota"
            value={form.data_inicio_quota}
            onChange={handleChange}
            className={inputClass}
          />
          <div className="mt-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Se deixares vazio:</strong> as quotas começam a contar a
              partir do momento do cadastro.
              <br />
              <strong>Preenche apenas se:</strong> este membro já era da
              paróquia antes de ser cadastrado no site e queres cobrar quotas
              retroativas.
            </p>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Link
          href="/admin/membros"
          className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={loading || (biTemConteudo && !biValido)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30"
        >
          {loading
            ? 'A guardar...'
            : editando
            ? 'Guardar Alterações'
            : 'Criar Membro'}
        </button>
      </div>
    </form>
  )
}