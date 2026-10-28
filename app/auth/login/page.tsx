'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import AuthSidePanel from '@/components/auth/AuthSidePanel'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [lembrar, setLembrar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErro('Email ou palavra-passe incorretos.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: 'var(--color-background-muted)' }}
    >
      {/* Círculos decorativos de fundo */}
      <div className="hidden lg:block fixed top-0 right-0 w-[600px] h-[600px] rounded-full border border-[#0D6EFD]/8 pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="hidden lg:block fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full border border-[#0D6EFD]/8 pointer-events-none translate-y-1/2 -translate-x-1/3" />

      {/* Card flutuante — dividido em duas colunas */}
      <div className="relative w-full max-w-[1100px]">
        <div className="bg-white rounded-[20px] shadow-[0_25px_70px_rgba(8,29,61,0.15)] overflow-hidden grid lg:grid-cols-2">
          {/* Coluna esquerda azul */}
          <AuthSidePanel
            titulo="Bem-vindo"
            subtitulo="A Direção da Juventude é o espaço onde sonhos se encontram com valores, e pessoas se tornam líderes para um futuro melhor."
          />

          {/* Coluna direita — formulário */}
          <div className="px-8 sm:px-12 py-10 lg:py-14 flex flex-col">
            {/* Link voltar ao site */}
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

            {/* Título */}
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{ color: 'var(--color-primary)' }}
            >
              Acesso à plataforma
            </span>

            <h1 className="mt-3 text-[28px] sm:text-[32px] font-bold text-[#0F172A] tracking-tight leading-tight">
              Entrar na sua conta
            </h1>

            <p className="mt-3 text-[14px] text-[#64748B]">
              Faça login para acessar a área da Direção da Juventude.
            </p>

            {erro && (
              <div className="mt-6 px-4 py-3 rounded-[10px] bg-red-50 border border-red-100 text-[13px] text-red-700">
                {erro}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleLogin} className="mt-7 space-y-5">
              {/* Email */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Palavra-passe */}
              <div>
                <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">
                  Palavra-passe
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a sua palavra-passe"
                    className="input pl-10 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                    aria-label="Mostrar palavra-passe"
                  >
                    {mostrarPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Lembrar + Esqueci */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-[13px] text-[#64748B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lembrar}
                    onChange={(e) => setLembrar(e.target.checked)}
                    className="w-4 h-4 rounded border-[#CBD5E1] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  Manter-me conectado
                </label>

                <Link
                  href="/auth/recuperar-senha"
                  className="text-[13px] font-medium transition-colors"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Esqueci a palavra-passe
                </Link>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full mt-2"
              >
                {loading ? 'A entrar...' : (
                  <>
                    Entrar
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divisor */}
            <div className="mt-6 flex items-center gap-4">
              <span className="flex-1 h-px bg-[#E2E8F0]" />
              <span className="text-[12px] text-[#94A3B8]">ou</span>
              <span className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            {/* Rodapé do formulário */}
            <p className="mt-6 text-center text-[13px] text-[#64748B]">
              Não tem uma conta?{' '}
              <Link
                href="/auth/cadastro"
                className="font-semibold transition-colors"
                style={{ color: 'var(--color-primary)' }}
              >
                Registe-se aqui
              </Link>
            </p>
          </div>
        </div>

        {/* Rodapé abaixo do card */}
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