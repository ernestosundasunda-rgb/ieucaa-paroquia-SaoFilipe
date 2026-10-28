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

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <div className="flex justify-center pb-6 border-b border-[#E2E8F0]">
        <AvatarUpload
          userId={profile.id}
          fotoAtual={profile.foto_url}
          nome={profile.nome}
        />
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {erro && (
          <div className="px-4 py-3 rounded-[10px] bg-red-50 border border-red-100 text-[13px] text-red-700">
            {erro}
          </div>
        )}
        {sucesso && (
          <div className="px-4 py-3 rounded-[10px] bg-[#EAF3FF] border border-[var(--color-primary)]/20 text-[13px] text-[var(--color-primary-dark)]">
            {sucesso}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nome */}
          <div className="md:col-span-2">
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
              Nome completo *
            </label>
            <input
              type="text"
              name="nome"
              required
              value={form.nome}
              onChange={handleChange}
              placeholder="O teu nome"
              className="input"
            />
          </div>

          {/* Email (não editável) */}
          <div className="md:col-span-2">
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="input"
            />
            <p className="mt-1.5 text-[11px] text-[#94A3B8]">
              O email não pode ser alterado nesta página.
            </p>
          </div>

          {/* Role (não editável) */}
          <div className="md:col-span-2">
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
              Nível de acesso
            </label>
            <input
              type="text"
              value={profile.role}
              disabled
              className="input capitalize"
            />
            <p className="mt-1.5 text-[11px] text-[#94A3B8]">
              O nível de acesso só pode ser alterado por um administrador.
            </p>
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
              Telefone
            </label>
            <input
              type="text"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="+244 900 000 000"
              className="input"
            />
          </div>

          {/* Cargo */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
              Cargo
            </label>
            <input
              type="text"
              name="cargo"
              value={form.cargo}
              onChange={handleChange}
              placeholder="Ex: Diácono, Presbítero, Membro"
              className="input"
            />
          </div>

          {/* Endereço */}
          <div className="md:col-span-2">
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
              Endereço
            </label>
            <input
              type="text"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              placeholder="Rua, número, bairro"
              className="input"
            />
          </div>

          {/* Data Nascimento */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
              Data de nascimento
            </label>
            <input
              type="date"
              name="data_nascimento"
              value={form.data_nascimento}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Data Batismo */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0F172A] mb-1.5">
              Data de batismo
            </label>
            <input
              type="date"
              name="data_batismo"
              value={form.data_batismo}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        {/* Botões — Cancelar secundário + Guardar azul escuro */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <Link
            href="/perfil"
            className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-[10px] text-[14px] font-semibold border transition-all duration-200 hover:bg-[#F8FAFC]"
            style={{
              borderColor: 'var(--color-border-strong)',
              color: 'var(--color-text)',
            }}
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-[10px] text-[14px] font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-primary-dark)',
              color: '#FFFFFF',
            }}
          >
            {loading ? 'A guardar...' : 'Guardar alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}