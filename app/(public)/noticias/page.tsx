import Link from 'next/link'
import { Suspense } from 'react'
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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Cabeçalho da página */}
      <section className="relative bg-[#082F6B] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="absolute top-0 right-0 w-80 h-80 rounded-full border border-white/10 -translate-y-1/3 translate-x-1/3" />

        <div className="relative container py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[12px] font-semibold text-white/70 hover:text-white transition-colors uppercase tracking-[0.12em] mb-6"
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
            Voltar ao início
          </Link>

          <span className="block text-[12px] font-bold tracking-[0.15em] uppercase text-[#D6A84F]">
            Notícias
          </span>

          <h1 className="mt-3 heading-lg text-white max-w-2xl">
            {categoriaLabel
              ? `Notícias de ${categoriaLabel}`
              : 'Todas as notícias'}
          </h1>

          <p className="mt-4 text-[15px] text-white/70 max-w-xl">
            {total} {total === 1 ? 'notícia publicada' : 'notícias publicadas'}
          </p>
        </div>
      </section>

      {/* Filtros */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-[72px] z-40">
        <div className="container py-4">
          <Suspense fallback={<div className="h-10" />}>
            <FiltrosNoticias />
          </Suspense>
        </div>
      </div>

      {/* Lista */}
      <section className="section">
        <div className="container">
          {!noticias || noticias.length === 0 ? (
            <Reveal>
              <div className="card-static p-16 text-center max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-full bg-[#F4F8FD] flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-[#0D6EFD]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2"
                    />
                  </svg>
                </div>

                <p className="text-[15px] text-[#64748B]">
                  {categoria
                    ? 'Ainda não há notícias nesta categoria.'
                    : 'Ainda não há notícias publicadas.'}
                </p>

                {categoria && (
                  <Link href="/noticias" className="btn btn-secondary mt-6">
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
      </section>
    </div>
  )
}