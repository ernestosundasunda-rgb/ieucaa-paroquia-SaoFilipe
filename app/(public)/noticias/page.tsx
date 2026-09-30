import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NoticiaCard from '@/components/public/NoticiaCard'
import FiltrosNoticias from '@/components/public/FiltrosNoticias'
import Reveal from '@/components/public/Reveal'
import { CATEGORIAS_NOTICIA } from '@/lib/constants'
import type { Noticia } from '@/types'

interface Props {
  searchParams: Promise<{ categoria?: string }>
}

export default async function NoticiasPage({ searchParams }: Props) {
  const { categoria } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('noticias')
    .select('*')
    .order('data_publicacao', { ascending: false })

  if (categoria && categoria !== 'todas') {
    query = query.eq('categoria', categoria)
  }

  const { data: noticias } = await query

  const total = noticias?.length ?? 0
  const categoriaLabel = categoria
    ? CATEGORIAS_NOTICIA[categoria] ?? categoria
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors duration-150 mb-4"
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
            Voltar à página inicial
          </Link>

          <span className="block text-xs font-semibold tracking-wider uppercase text-blue-700">
            Notícias
          </span>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            {categoriaLabel ? `Notícias de ${categoriaLabel}` : 'Todas as Notícias'}
          </h1>
          <p className="mt-3 text-base text-gray-600">
            {total} {total === 1 ? 'notícia publicada' : 'notícias publicadas'}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <FiltrosNoticias />
        </div>
      </div>

      {/* Lista */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {!noticias || noticias.length === 0 ? (
          <Reveal>
            <div className="bg-white rounded-xl border border-gray-100 px-6 py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-7 h-7 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500">
                {categoria
                  ? 'Ainda não há notícias nesta categoria.'
                  : 'Ainda não há notícias publicadas.'}
              </p>
              {categoria && (
                <Link
                  href="/noticias"
                  className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver todas as notícias
                </Link>
              )}
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((noticia, i) => (
              <Reveal key={noticia.id} delay={i * 60}>
                <NoticiaCard noticia={noticia as Noticia} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}