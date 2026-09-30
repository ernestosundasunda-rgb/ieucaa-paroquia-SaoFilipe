import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIAS_NOTICIA } from '@/lib/constants'
import type { Noticia } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function NoticiaDetalhePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: noticia } = await supabase
    .from('noticias')
    .select('*')
    .eq('id', id)
    .single()

  if (!noticia) {
    notFound()
  }

  const noticiaTipada = noticia as Noticia
  const dataFormatada = new Date(
    noticiaTipada.data_publicacao
  ).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const categoriaNome =
    CATEGORIAS_NOTICIA[noticiaTipada.categoria] ?? noticiaTipada.categoria

  // Notícias relacionadas (mesma categoria, exceto a atual)
  const { data: relacionadas } = await supabase
    .from('noticias')
    .select('*')
    .eq('categoria', noticiaTipada.categoria)
    .neq('id', noticiaTipada.id)
    .order('data_publicacao', { ascending: false })
    .limit(3)

  return (
    <article className="min-h-screen bg-white">
      {/* Cabeçalho */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-20">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-1.5 text-sm text-blue-200 hover:text-white transition-colors duration-150 mb-6"
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
            Voltar às notícias
          </Link>

          <span className="inline-block text-xs font-medium tracking-wider uppercase bg-white/15 backdrop-blur-sm text-white border border-white/20 px-3 py-1.5 rounded-full">
            {categoriaNome}
          </span>

          <h1 className="mt-5 text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            {noticiaTipada.titulo}
          </h1>

          <div className="mt-6 flex items-center gap-3 text-sm text-blue-200">
            {noticiaTipada.autor_nome && (
              <>
                <span>{noticiaTipada.autor_nome}</span>
                <span className="text-blue-400">·</span>
              </>
            )}
            <span>{dataFormatada}</span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        {/* Imagem (quando existir) */}
        {noticiaTipada.imagem_url && (
          <div className="mb-10 -mt-24 relative z-10">
            <div className="aspect-video rounded-xl overflow-hidden shadow-xl shadow-blue-900/10 border-4 border-white bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={noticiaTipada.imagem_url}
                alt={noticiaTipada.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

       
            <div className="prose prose-gray max-w-none w-full overflow-hidden">
  {noticiaTipada.conteudo.split('\n').map((paragrafo, i) =>
    paragrafo.trim() ? (
      <p
        key={i}
        className="text-base md:text-lg text-gray-700 leading-relaxed mb-5 break-words whitespace-pre-wrap"
        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
      >
        {paragrafo}
      </p>
    ) : null
  )}
</div>

      </div>

      {/* Notícias relacionadas */}
      {relacionadas && relacionadas.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">
              Mais em {categoriaNome}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relacionadas.map((rel) => {
                const relData = new Date(
                  rel.data_publicacao
                ).toLocaleDateString('pt-PT', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })

                return (
                  <Link
                    key={rel.id}
                    href={`/noticias/${rel.id}`}
                    className="group block bg-white rounded-xl border border-gray-100 p-6 transition-all duration-200 hover:border-blue-200 hover:shadow-md hover:shadow-blue-900/5 hover:-translate-y-0.5"
                  >
                    <p className="text-xs text-gray-400">{relData}</p>
                    <h3 className="mt-2 text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-900 transition-colors duration-150">
                      {rel.titulo}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {rel.conteudo}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}