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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href="/perfil"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-150 mb-3"
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

          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Editar Perfil
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Atualiza as tuas informações pessoais
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-8">
          <PerfilForm profile={profile} />
        </div>
      </div>
    </div>
  )
}