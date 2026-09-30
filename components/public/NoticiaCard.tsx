import Link from 'next/link'
import { CATEGORIAS_NOTICIA } from '@/lib/constants'
import type { Noticia } from '@/types'

interface Props {
  noticia: Noticia
}

export default function NoticiaCard({ noticia }: Props) {
  const dataFormatada = new Date(noticia.data_publicacao).toLocaleDateString(
    'pt-PT',
    { day: '2-digit', month: 'long', year: 'numeric' }
  )

  const categoriaNome =
    CATEGORIAS_NOTICIA[noticia.categoria] ?? noticia.categoria

  return (
    <Link
      href={`/noticias/${noticia.id}`}
      className="group block bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 hover:-translate-y-0.5"
    >
      {/* Cabeçalho visual — imagem OU gradiente */}
      <div className="h-44 relative overflow-hidden bg-blue-900">
        {noticia.imagem_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={noticia.imagem_url}
              alt={noticia.titulo}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay escuro para o badge ler bem */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-900/20 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-700" />
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '20px 20px',
              }}
            />
          </>
        )}

        {/* Badge de categoria */}
        <div className="absolute bottom-3 left-4">
          <span className="inline-block text-[11px] font-medium tracking-wide uppercase bg-white/15 backdrop-blur-sm text-white border border-white/20 px-2.5 py-1 rounded-full">
            {categoriaNome}
          </span>
        </div>
      </div>

      {/* Corpo */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-900 transition-colors duration-150">
          {noticia.titulo}
        </h3>

        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
          {noticia.conteudo}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">{dataFormatada}</span>

          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:text-blue-700 transition-colors duration-150">
            Ler mais
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}