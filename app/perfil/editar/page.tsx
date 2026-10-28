import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserWithProfile } from '@/lib/auth/getUser'
import PerfilForm from '@/components/perfil/PerfilForm'

export default async function EditarPerfilPage() {
  const { user, profile } = await getUserWithProfile()

  if (!user || !profile) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Barra azul — Voltar ao perfil */}
      <div style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link
            href="/perfil"
            className="inline-flex items-center gap-2 text-[13px] font-semibold transition-opacity hover:opacity-80"
            style={{ color: '#FFFFFF' }}
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar ao perfil
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-10 px-4">
        {/* Cabeçalho da página */}
        <div className="mb-8">
          <span className="section-label">
            <span className="w-8 h-px bg-[var(--color-primary)]" />
            Perfil
          </span>
          <h1 className="heading-md text-[#0F172A]">Editar perfil</h1>
          <p className="mt-2 text-[14px] text-[#64748B]">
            Atualiza as tuas informações pessoais.
          </p>
        </div>

        <div className="bg-white rounded-[18px] border border-[#E2E8F0] p-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
          <PerfilForm profile={profile} />
        </div>
      </div>
    </div>
  )
}