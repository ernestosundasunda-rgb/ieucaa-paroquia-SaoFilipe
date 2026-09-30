'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AvatarUpload from './AvatarUpload'
import type { Profile } from '@/types'

interface Props {
  profile: Profile
}

export default function PerfilForm({ profile }: Props) {
  const router = useRouter()

  const [form, setForm] = useState({
    nome: profile.nome,
    telefone: profile.telefone ?? '',
    endereco: profile.endereco ?? '',
    data_nascimento: profile.data_nascimento ?? '',
    data_batismo: profile.data_batismo ?? '',
    cargo: profile.cargo ?? '',
  })

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setSucesso('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (!form.nome.trim()) {
      setErro('O nome é obrigatório.')
      return
    }

    setLoading(true)

    const supabase = createClient()

    // ⚠️ NÃO incluir "role" nem "email" — são geridos pelo sistema
    const dados = {
      nome: form.nome.trim(),
      telefone: form.telefone.trim() || null,
      endereco: form.endereco.trim() || null,
      data_nascimento: form.data_nascimento || null,
      data_batismo: form.data_batismo || null,
      cargo: form.cargo.trim() || null,
    }

    const { error } = await supabase
      .from('profiles')
      .update(dados)
      .eq('id', profile.id)

    if (error) {
      setErro('Erro ao guardar: ' + error.message)
      setLoading(false)
      return
    }

    setSucesso('Perfil atualizado com sucesso!')
    setLoading(false)

    router.refresh()
  }

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-gray-50 disabled:text-gray-400'

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <div className="flex justify-center pb-6 border-b border-gray-100">
        <AvatarUpload
          userId={profile.id}
          fotoAtual={profile.foto_url}
          nome={profile.nome}
        />
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {erro && (
          <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
            {erro}
          </div>
        )}
        {sucesso && (
          <div className="px-4 py-3 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-700">
            {sucesso}
          </div>
        )}

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
              placeholder="O teu nome"
              className={inputClass}
            />
          </div>

          {/* Email (não editável) */}
          <div className="md:col-span-2">
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-400">
              O email não pode ser alterado nesta página.
            </p>
          </div>

          {/* Role (não editável) */}
          <div className="md:col-span-2">
            <label className={labelClass}>Nível de Acesso</label>
            <input
              type="text"
              value={profile.role}
              disabled
              className={`${inputClass} capitalize`}
            />
            <p className="mt-1 text-xs text-gray-400">
              O nível de acesso só pode ser alterado por um administrador.
            </p>
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

          {/* Cargo */}
          <div>
            <label className={labelClass}>Cargo</label>
            <input
              type="text"
              name="cargo"
              value={form.cargo}
              onChange={handleChange}
              placeholder="Ex: Diácono, Presbítero, Membro"
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
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/perfil"
            className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30"
          >
            {loading ? 'A guardar...' : 'Guardar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}