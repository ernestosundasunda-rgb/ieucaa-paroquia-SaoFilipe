import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWithProfile } from '@/lib/auth/getUser'
import MembroForm from '@/components/membros/MembroForm'
import type { Membro } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarMembroPage({ params }: Props) {
  const { id } = await params
  const { profile } = await getUserWithProfile()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    redirect('/admin/dashboard')
  }

  const supabase = await createClient()
  const { data: membro } = await supabase
    .from('membros')
    .select('*')
    .eq('id', id)
    .single()

  if (!membro) {
    notFound()
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
          Editar Membro
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Atualiza as informações de {membro.nome}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-8">
        <MembroForm membro={membro as Membro} />
      </div>
    </div>
  )
}