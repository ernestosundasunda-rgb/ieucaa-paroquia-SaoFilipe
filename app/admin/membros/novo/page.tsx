import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserWithProfile } from '@/lib/auth/getUser'
import MembroForm from '@/components/membros/MembroForm'

export default async function NovoMembroPage() {
  const { profile } = await getUserWithProfile()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    redirect('/admin/dashboard')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/membros"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-150 mb-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar aos membros
        </Link>

        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Novo Membro
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Preenche os dados para registar um novo membro
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-8">
        <MembroForm />
      </div>
    </div>
  )
}