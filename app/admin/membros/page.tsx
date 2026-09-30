import Link from 'next/link'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWithProfile } from '@/lib/auth/getUser'
import DeleteMembroButton from '@/components/membros/DeleteMembroButton'
import FiltrosMembros from '@/components/membros/FiltrosMembros'

interface Props {
  searchParams: Promise<{
    nome?: string
    bi?: string
    cargo?: string
    tipo_sanguineo?: string
  }>
}

export default async function MembrosPage({ searchParams }: Props) {
  const { profile } = await getUserWithProfile()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    redirect('/admin/dashboard')
  }

  const filtros = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('membros')
    .select('*')
    .order('nome', { ascending: true })

  if (filtros.nome) {
    query = query.ilike('nome', `%${filtros.nome}%`)
  }
  if (filtros.bi) {
    query = query.ilike('bi', `%${filtros.bi}%`)
  }
  if (filtros.cargo) {
    query = query.eq('cargo', filtros.cargo)
  }
  if (filtros.tipo_sanguineo) {
    query = query.eq('tipo_sanguineo', filtros.tipo_sanguineo)
  }

  const { data: membros } = await query

  const total = membros?.length ?? 0
  const temFiltros = !!(
    filtros.nome ||
    filtros.bi ||
    filtros.cargo ||
    filtros.tipo_sanguineo
  )

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Membros
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} membro{total === 1 ? '' : 's'}{' '}
            {temFiltros ? 'encontrado' : 'registado'}
            {total === 1 ? '' : 's'}
          </p>
        </div>

        <Link
          href="/admin/membros/novo"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Novo Membro
        </Link>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <Suspense fallback={<div className="h-32 bg-white rounded-xl border border-gray-100" />}>
          <FiltrosMembros />
        </Suspense>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {!membros || membros.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-gray-500">
              {temFiltros
                ? 'Nenhum membro corresponde aos filtros aplicados.'
                : 'Ainda não há membros registados.'}
            </p>
            {!temFiltros && (
              <Link
                href="/admin/membros/novo"
                className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Adicionar primeiro membro
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Membro
                  </th>
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Nº BI
                  </th>
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Tipo Sang.
                  </th>
                  <th className="text-right px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {membros.map((membro) => (
                  <tr
                    key={membro.id}
                    className="transition-colors duration-150 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {membro.foto_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={membro.foto_url}
                              alt={membro.nome}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-blue-600">
                              {membro.nome.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {membro.nome}
                          </p>
                          {membro.email && (
                            <p className="text-xs text-gray-400 truncate">
                              {membro.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                      {membro.bi || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {membro.telefone || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {membro.cargo || '—'}
                    </td>
                    <td className="px-6 py-4">
                      {membro.tipo_sanguineo &&
                      membro.tipo_sanguineo !== 'desconhecido' ? (
                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-red-50 text-red-700 rounded-full">
                          {membro.tipo_sanguineo}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/membros/${membro.id}/ficha`}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-150"
                        >
                          Ver Ficha
                        </Link>
                        <Link
                          href={`/admin/membros/editar/${membro.id}`}
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150"
                        >
                          Editar
                        </Link>
                        <DeleteMembroButton id={membro.id} nome={membro.nome} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}