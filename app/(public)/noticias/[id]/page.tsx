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

  const { data: relacionadas } = await supabase
    .from('noticias')
    .select('*')
    .eq('categoria', noticiaTipada.categoria)
    .neq('id', noticiaTipada.id)
    .order('data_publicacao', { ascending: false })
    .limit(3)

  return (
    <article className="min-h-screen bg-white overflow-x-hidden">
      {/* Cabeçalho */}
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

        <div className="absolute top-0 right-0 w-96 h-96 rounded-full border border-white/10 -translate-y-1/3 translate-x-1/3" />

        <div className="relative max-w-3xl mx-auto px-6 py-16">
          <Link
            href="/noticias"
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
            Voltar às notícias
          </Link>

          <span className="inline-block text-[11px] font-bold tracking-[0.12em] uppercase bg-white/15 backdrop-blur-sm text-white border border-white/20 px-3 py-1.5 rounded-full">
            {categoriaNome}
          </span>

          <h1 className="mt-5 heading-lg text-white break-words">
            {noticiaTipada.titulo}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-[13px] text-white/70">
            {noticiaTipada.autor_nome && (
              <span className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold">
                  {noticiaTipada.autor_nome.charAt(0).toUpperCase()}
                </div>
                {noticiaTipada.autor_nome}
              </span>
            )}

            <span className="text-white/40">•</span>
            <span>{dataFormatada}</span>
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        {noticiaTipada.imagem_url && (
          <div className="mb-10 -mt-28 relative z-10">
            <div className="aspect-video rounded-[18px] overflow-hidden shadow-[0_20px_60px_rgba(8,47,107,0.15)] border-4 border-white bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={noticiaTipada.imagem_url}
                alt={noticiaTipada.titulo}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Conteúdo com quebra de linha */}
        <div className="w-full max-w-full overflow-hidden">
          <div className="text-[16px] md:text-[17px] text-[#0F172A] leading-[1.8] whitespace-pre-line break-words">
            {noticiaTipada.conteudo}
          </div>
        </div>

        {/* Separador institucional */}
        <div className="mt-12 pt-8 border-t border-[#E2E8F0] flex items-center gap-3">
          <span className="w-8 h-px bg-[#D6A84F]" />
          <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#64748B]">
            Fim da notícia
          </span>
        </div>
      </div>

      {/* Notícias relacionadas */}
      {relacionadas && relacionadas.length > 0 && (
        <section className="bg-[#F8FAFC] border-t border-[#E2E8F0]">
          <div className="container py-16">
            <div className="mb-10">
              <span className="section-label">
                <span className="w-8 h-px bg-[#0D6EFD]" />
                Mais em {categoriaNome}
              </span>
              <h2 className="section-title">Notícias relacionadas</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relacionadas.map((rel) => {
                const relData = new Date(rel.data_publicacao).toLocaleDateString(
                  'pt-PT',
                  {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }
                )

                return (
                  <Link
                    key={rel.id}
                    href={`/noticias/${rel.id}`}
                    className="group block bg-white rounded-[18px] border border-[#E2E8F0] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0D6EFD]/40 hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
                  >
                    <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-[0.05em]">
                      {relData}
                    </p>
                    <h3 className="mt-3 heading-sm text-[#0F172A] leading-snug line-clamp-2 group-hover:text-[#0D6EFD] transition-colors duration-200">
                      {rel.titulo}
                    </h3>
                    <p className="mt-3 text-[14px] text-[#64748B] line-clamp-2 leading-relaxed">
                      {rel.conteudo}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}