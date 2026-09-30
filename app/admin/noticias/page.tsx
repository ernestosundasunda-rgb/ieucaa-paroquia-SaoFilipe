import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserWithProfile } from '@/lib/auth/getUser'
import DeleteNoticiaButton from '@/components/noticias/DeleteNoticiaButton'

export default async function NoticiasPage() {
  const { profile } = await getUserWithProfile()

  if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin')) {
    redirect('/admin/dashboard')
  }

  const supabase = await createClient()
  const { data: noticias } = await supabase
    .from('noticias')
    .select('*')
    .order('data_publicacao', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Notícias
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {noticias?.length ?? 0} notícia
            {noticias?.length === 1 ? '' : 's'} publicada
            {noticias?.length === 1 ? '' : 's'}
          </p>
        </div>

        <Link
          href="/admin/noticias/nova"
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
          Nova Notícia
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {!noticias || noticias.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm text-gray-500">
              Ainda não há notícias publicadas.
            </p>
            <Link
              href="/admin/noticias/nova"
              className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Publicar primeira notícia
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Notícia
                  </th>
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="text-left px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Data
                  </th>
                  <th className="text-right px-6 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {noticias.map((noticia) => (
                  <tr
                    key={noticia.id}
                    className="transition-colors duration-150 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Miniatura */}
                        <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                          {noticia.imagem_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={noticia.imagem_url}
                              alt={noticia.titulo}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                              <span className="text-[9px] font-medium text-white/80 text-center leading-tight px-1">
                                Sem imagem
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Texto */}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-xs">
                            {noticia.titulo}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                            {noticia.conteudo.substring(0, 60)}
                            {noticia.conteudo.length > 60 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full capitalize">
                        {noticia.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {noticia.autor_nome || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {new Date(noticia.data_publicacao).toLocaleDateString(
                        'pt-PT'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/noticias/editar/${noticia.id}`}
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150"
                        >
                          Editar
                        </Link>
                        <DeleteNoticiaButton
                          id={noticia.id}
                          titulo={noticia.titulo}
                        />
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