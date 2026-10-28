'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AuthSidePanel from '@/components/auth/AuthSidePanel'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function handleRecuperar(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/nova-senha`,
    })

    if (error) {
      setErro('Erro: ' + error.message)
      setLoading(false)
      return
    }

    setSucesso('Email enviado! Verifique a sua caixa de entrada.')
    setLoading(false)
    setEmail('')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--color-background-muted)' }}
    >
      <div className="hidden lg:block fixed top-0 right-0 w-[600px] h-[600px] rounded-full border border-[#0D6EFD]/8 pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="hidden lg:block fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full border border-[#0D6EFD]/8 pointer-events-none translate-y-1/2 -translate-x-1/3" />

      <div className="relative w-full max-w-[1100px]">
        <div className="bg-white rounded-[20px] shadow-[0_25px_70px_rgba(8,29,61,0.15)] overflow-hidden grid lg:grid-cols-2">
          <AuthSidePanel
            titulo="Recuperar"
            subtitulo="Recupere o acesso à plataforma da Direção da Juventude."
          />

          <div className="px-8 sm:px-12 py-10 lg:py-14 flex flex-col">
            <div className="flex justify-end mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#64748B] hover:text-[var(--color-primary)] transition-colors"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Voltar ao site
              </Link>
            </div>

            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ color: 'var(--color-primary)' }}
            >
              Acesso à plataforma
            </span>

            <h1 className="mt-3 text-[28px] sm:text-[32px] font-bold text-[#0F172A] tracking-tight leading-tight">
              Recuperar palavra-passe
            </h1>

            <p className="mt-3 text-[14px] text-[#64748B]">
              Insira o seu email para receber o link de recuperação.
            </p>

            {erro && (
              <div className="mt-6 px-4 py-3 rounded-[10px] bg-red-50 border border-red-100 text-[13px] text-red-700">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="mt-6 px-4 py-3 rounded-[10px] bg-[#EAF3FF] border border-[var(--color-primary)]/20 text-[13px] text-[var(--color-primary-dark)]">
                {sucesso}
              </div>
            )}

            <form onSubmit={handleRecuperar} className="mt-7 space-y-5">
              <div>
                <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-2"
              >
                {loading ? 'A enviar...' : 'Enviar link de recuperação'}
              </button>
            </form>

            <p className="mt-6 text-center text-[13px] text-[#64748B]">
              Lembrou-se da palavra-passe?{' '}
              <Link
                href="/auth/login"
                className="font-semibold transition-colors"
                style={{ color: 'var(--color-primary)' }}
              >
                Voltar ao login
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#94A3B8] uppercase">
            Direção da Juventude · IEUCAA · Paróquia de São Filipe
          </p>
          <p className="mt-2 text-[12px] italic text-[#94A3B8]">
            "Jovens unidos por um mesmo propósito."
          </p>
          <div className="mt-3 w-8 h-0.5 bg-[#D6A84F] mx-auto" />
        </div>
      </div>
    </div>
  )
}